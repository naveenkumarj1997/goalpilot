import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import GameStat from '../models/GameStat';
import KartStats from '../models/KartStats';
import { ludoManager } from './ludoManager';
import Match from '../models/Match';
import Message from '../models/Message';
import { Server as HttpServer } from 'http';

interface OnlineUser {
  socketId: string;
  userId: string;
  username: string;
}

export const setupSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // For dev, allow all
      methods: ['GET', 'POST'],
    },
  });

  const onlineUsers = new Map<string, OnlineUser>(); // userId -> OnlineUser
  const rooms = new Map<string, { players: string[]; ready: Set<string>; rematchReady?: Set<string>; gameType: string; format?: string; rpsMoves?: Map<string, string>; bshipReady?: Set<string> }>();

  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));

      // Attach user to socket
      (socket as any).user = {
        id: user._id.toString(),
        username: user.name,
      };
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    
    // Mark as online
    onlineUsers.set(user.id, {
      socketId: socket.id,
      userId: user.id,
      username: user.username,
    });

    // Broadcast updated online list
    io.emit('onlineUsers', Array.from(onlineUsers.values()));

    socket.on('disconnect', () => {
      const activeUser = onlineUsers.get(user.id);
      if (activeUser && activeUser.socketId === socket.id) {
        onlineUsers.delete(user.id);
        io.emit('onlineUsers', Array.from(onlineUsers.values()));
      }
    });

    // --- CHAT & FRIENDS SYSTEM ---
    socket.on('sendPrivateMessage', async ({ receiverId, text }) => {
      try {
        const newMessage = await Message.create({
          sender: user.id,
          receiver: receiverId,
          text,
        });

        const targetUser = onlineUsers.get(receiverId);
        if (targetUser) {
          io.to(targetUser.socketId).emit('receivePrivateMessage', {
            _id: newMessage._id,
            sender: user.id,
            receiver: receiverId,
            text,
            createdAt: newMessage.createdAt,
            read: false
          });
          // Also emit an unread count update so the badge can update
          io.to(targetUser.socketId).emit('unreadCountUpdate');
        }
      } catch (err) {
        console.error('Error sending private message via socket', err);
      }
    });

    socket.on('markMessagesAsRead', async ({ senderId }) => {
      try {
        await Message.updateMany(
          { sender: senderId, receiver: user.id, read: false },
          { $set: { read: true } }
        );
        socket.emit('unreadCountUpdate'); // tell sender to refresh their own badge
      } catch (err) {
        console.error('Error marking messages as read via socket', err);
      }
    });

    socket.on('sendFriendRequestEvent', ({ receiverId }) => {
      const targetUser = onlineUsers.get(receiverId);
      if (targetUser) {
        io.to(targetUser.socketId).emit('receiveFriendRequest', {
          senderId: user.id,
          senderName: user.username,
        });
      }
    });

    socket.on('acceptFriendRequestEvent', ({ senderId }) => {
      const targetUser = onlineUsers.get(senderId);
      if (targetUser) {
        io.to(targetUser.socketId).emit('friendRequestAccepted', {
          accepterId: user.id,
          accepterName: user.username,
        });
      }
    });

    // --- INVITATION SYSTEM ---
    socket.on('invitePlayer', ({ targetUserId, gameType, format }) => {
      const targetUser = onlineUsers.get(targetUserId);
      if (targetUser) {
        io.to(targetUser.socketId).emit('receiveInvite', {
          senderId: user.id,
          senderName: user.username,
          gameType,
          format,
        });
      }
    });

    socket.on('inviteReply', ({ senderId, accept, gameType, format }) => {
      const sender = onlineUsers.get(senderId);
      if (sender) {
        if (accept) {
          // Create room
          const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          rooms.set(roomId, { players: [sender.userId, user.id], ready: new Set(), gameType, format });
          
          // Tell both players to join the room
          io.to(sender.socketId).emit('inviteAccepted', { roomId, gameType, format, opponentName: user.username, opponentId: user.id });
          socket.emit('inviteAccepted', { roomId, gameType, format, opponentName: sender.username, opponentId: sender.userId });
        } else {
          io.to(sender.socketId).emit('inviteRejected', { rejecterName: user.username });
        }
      }
    });

    // --- ROOM SYSTEM ---
    socket.on('joinRoom', ({ roomId }) => {
      socket.join(roomId);
      const ludoState = ludoManager.getGame(roomId);
      if (ludoState) {
        socket.emit('ludoGameState', ludoState);
      }
    });

    socket.on('lobbyMessage', ({ roomId, message }) => {
      io.to(roomId).emit('lobbyMessage', {
        senderId: user.id,
        senderName: user.username,
        text: message,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('readyUp', ({ roomId }) => {
      const room = rooms.get(roomId);
      if (room) {
        room.ready.add(user.id);
        io.to(roomId).emit('playerReady', { userId: user.id });

        if (room.ready.size === 2) {
          if (room.gameType === 'Ludo') {
            const state = ludoManager.initGame(roomId, room.players[0], room.players[1]);
            io.to(roomId).emit('ludoGameState', state);
          }
          io.to(roomId).emit('gameStart', { starterId: room.players[0] });
        }
      }
    });

    // --- GAME SYNC ---
    socket.on('gameMove', ({ roomId, moveData }) => {
      // Broadcast to EVERYONE in room except sender
      socket.to(roomId).emit('gameMove', moveData);
    });

    // --- LUDO SPECIFIC ---
    socket.on('ludoRollDice', ({ roomId }) => {
      const res = ludoManager.rollDice(roomId, user.id);
      if (res.success) {
        io.to(roomId).emit('ludoDiceRolled', { diceValue: res.diceValue });
        
        // Wait 6s for the realistic dice animation to complete before broadcasting state
        setTimeout(() => {
          const state = ludoManager.getGame(roomId);
          if (state) io.to(roomId).emit('ludoGameState', state);
        }, 6000);
      } else {
        socket.emit('ludoError', { error: res.error });
      }
    });

    socket.on('ludoMoveToken', ({ roomId, tokenId }) => {
      const res = ludoManager.moveToken(roomId, user.id, tokenId);
      if (res.success) {
        // Emit move event to animate smoothly
        io.to(roomId).emit('ludoTokenMoved', { tokenId, newState: res.state, capturedIds: res.capturedIds });
        
        // Check for winner
        if (res.state && res.state.winner) {
          setTimeout(() => {
            io.to(roomId).emit('gameEnd', { winnerId: res.state!.winner === 'red' ? res.state!.players.red : res.state!.players.blue, reason: 'completed' });
          }, 3000); // allow animations to finish
        }
      } else {
        socket.emit('ludoError', { error: res.error });
      }
    });

    // --- RPS SPECIFIC ---
    socket.on('rpsMove', ({ roomId, move }) => {
      const room = rooms.get(roomId);
      if (room && room.gameType === 'RockPaperScissors') {
        if (!room.rpsMoves) room.rpsMoves = new Map();
        room.rpsMoves.set(user.id, move);

        // Tell opponent that a move was locked in (but don't reveal what it is)
        socket.to(roomId).emit('rpsOpponentLocked');

        if (room.rpsMoves.size === 2) {
          // Both locked in, reveal!
          const movesObj: any = {};
          for (let [pId, pMove] of room.rpsMoves.entries()) {
            movesObj[pId] = pMove;
          }
          io.to(roomId).emit('rpsReveal', movesObj);
          room.rpsMoves.clear();
        }
      }
    });

    // --- SNAKE & LADDERS 2D EMOTES, COMBAT & CHAT ---
    socket.on('sl2dEmote', ({ roomId, emote }) => {
      io.to(roomId).emit('sl2dEmoteReceived', { userId: user.id, emote });
    });

    socket.on('sl2dReady', ({ roomId, color, shape }) => {
      io.to(roomId).emit('sl2dReadyReceived', { userId: user.id, color, shape });
    });

    socket.on('sl2dCombatAction', ({ roomId, actionData }) => {
      // Broadcast attack or buff to other players in the room
      socket.to(roomId).emit('sl2dCombatActionReceived', { userId: user.id, ...actionData });
    });

    socket.on('sl2dRequestSync', ({ roomId }) => {
      socket.to(roomId).emit('sl2dRequestSyncReceived', { userId: user.id });
    });

    socket.on('sl2dGameStateSync', ({ roomId, syncData }) => {
      socket.to(roomId).emit('sl2dGameStateSyncReceived', syncData);
    });

    // --- BATTLESHIP SPECIFIC ---
    socket.on('bshipReady', ({ roomId }) => {
      const room = rooms.get(roomId);
      if (room && room.gameType === 'Battleship') {
        if (!room.bshipReady) room.bshipReady = new Set();
        room.bshipReady.add(user.id);
        
        io.to(roomId).emit('bshipPlayerReady', { userId: user.id });

        if (room.bshipReady.size === 2) {
          io.to(roomId).emit('bshipStart', { starterId: room.players[0] });
          room.bshipReady.clear();
        }
      }
    });

    socket.on('bshipAttack', ({ roomId, r, c }) => {
      // Forward attack to opponent
      socket.to(roomId).emit('bshipAttackReceived', { r, c });
    });

    socket.on('bshipAttackResult', ({ roomId, r, c, result, shipName, isGameOver }) => {
      // Return result back to the attacker
      socket.to(roomId).emit('bshipAttackResultReceived', { r, c, result, shipName, isGameOver });
    });

    socket.on('rematchRequest', ({ roomId }) => {
      const room = rooms.get(roomId);
      if (room) {
        if (!room.rematchReady) room.rematchReady = new Set();
        room.rematchReady.add(user.id);

        if (room.rematchReady.size === 2) {
          room.rematchReady.clear();
          io.to(roomId).emit('rematchStart');
        } else {
          socket.to(roomId).emit('rematchRequestedByOpponent');
        }
      }
    });

    // --- GAME STATS UPDATE ---
    socket.on('gameEnd', async ({ roomId, gameType, winnerId, loserId, isDraw, duration }) => {
      // Only process this once per room to avoid double-counting
      // The client logic should ensure only the winner (or a designated host on draw) emits this
      try {
        await Match.create({
          gameType,
          winner: winnerId || null,
          loser: loserId || null,
          isDraw,
          duration: duration || 0,
        });

        if (!isDraw && winnerId && loserId) {
          // Update Winner
          let wStat = await GameStat.findOne({ user: winnerId });
          if (!wStat) wStat = new GameStat({ user: winnerId });
          wStat.wins += 1;
          wStat.gamesPlayed += 1;
          await wStat.save();

          // Update Loser
          let lStat = await GameStat.findOne({ user: loserId });
          if (!lStat) lStat = new GameStat({ user: loserId });
          lStat.losses += 1;
          lStat.gamesPlayed += 1;
          await lStat.save();
        } else if (isDraw && winnerId && loserId) {
          // Both get a draw (winnerId/loserId represent the two players)
          let s1 = await GameStat.findOne({ user: winnerId });
          if (!s1) s1 = new GameStat({ user: winnerId });
          s1.draws += 1;
          s1.gamesPlayed += 1;
          await s1.save();

          let s2 = await GameStat.findOne({ user: loserId });
          if (!s2) s2 = new GameStat({ user: loserId });
          s2.draws += 1;
          s2.gamesPlayed += 1;
          await s2.save();
        }

        // --- KART RACING SPECIFIC STATS ---
        if (gameType === 'KartRacer') {
            if (!isDraw && winnerId && loserId) {
                // Update Winner Kart Stats
                let wkStat = await KartStats.findOne({ userId: winnerId });
                if (!wkStat) wkStat = new KartStats({ userId: winnerId });
                wkStat.wins += 1;
                wkStat.totalRaces += 1;
                await wkStat.save();

                // Update Loser Kart Stats
                let lkStat = await KartStats.findOne({ userId: loserId });
                if (!lkStat) lkStat = new KartStats({ userId: loserId });
                lkStat.losses += 1;
                lkStat.totalRaces += 1;
                await lkStat.save();
            }
        }
        
        io.to(roomId).emit('statsUpdated');
      } catch (err) {
        console.error('Error saving game stats', err);
      }
    });
  });
};
