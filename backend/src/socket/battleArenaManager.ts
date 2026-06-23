import { Server, Socket } from 'socket.io';

interface PlayerState {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: 'left' | 'right';
  health: number;
  maxHealth: number;
  kills: number;
  deaths: number;
  weapon: string;
  isDead: boolean;
  color: number;
}

interface MatchState {
  roomId: string;
  players: Record<string, PlayerState>;
  status: 'waiting' | 'playing' | 'finished';
  winner: string | null;
}

const activeMatches: Record<string, MatchState> = {};

export const setupBattleArenaSocket = (io: Server, socket: Socket) => {
  
  socket.on('ba-join', ({ roomId, user }) => {
    if (!activeMatches[roomId]) {
      activeMatches[roomId] = {
        roomId,
        players: {},
        status: 'playing',
        winner: null
      };
    }

    const match = activeMatches[roomId];
    
    // Spawn player
    match.players[socket.id] = {
      id: socket.id,
      name: user.username,
      x: Math.random() * 600 + 100, // random spawn X
      y: 100, // Drop from top
      vx: 0,
      vy: 0,
      facing: 'right',
      health: 100,
      maxHealth: 100,
      kills: 0,
      deaths: 0,
      weapon: 'pistol',
      isDead: false,
      color: Math.floor(Math.random() * 16777215) // Random tint
    };

    socket.join(roomId);
    
    // Send current state to new player
    socket.emit('ba-init', {
      players: match.players,
      me: socket.id
    });

    // Broadcast new player to others
    socket.to(roomId).emit('ba-player-joined', match.players[socket.id]);
  });

  socket.on('ba-player-update', ({ roomId, state }) => {
    const match = activeMatches[roomId];
    if (match && match.players[socket.id]) {
      const p = match.players[socket.id];
      if (p.isDead) return;

      // Update basic transform
      p.x = state.x;
      p.y = state.y;
      p.vx = state.vx;
      p.vy = state.vy;
      p.facing = state.facing;

      // We use volatile emit since it happens ~20-60 times a second and we don't care if a packet drops
      socket.to(roomId).volatile.emit('ba-player-moved', {
        id: socket.id,
        x: p.x,
        y: p.y,
        vx: p.vx,
        vy: p.vy,
        facing: p.facing
      });
    }
  });

  socket.on('ba-shoot', ({ roomId, bulletData }) => {
    const match = activeMatches[roomId];
    if (match && match.players[socket.id] && !match.players[socket.id].isDead) {
      socket.to(roomId).emit('ba-player-shot', {
        shooterId: socket.id,
        ...bulletData
      });
    }
  });

  socket.on('ba-hit', ({ roomId, targetId, damage }) => {
    const match = activeMatches[roomId];
    if (match && match.players[targetId] && !match.players[targetId].isDead) {
      const target = match.players[targetId];
      const shooter = match.players[socket.id];

      target.health -= damage;
      
      io.to(roomId).emit('ba-health-changed', {
        id: targetId,
        health: target.health
      });

      if (target.health <= 0) {
        target.isDead = true;
        target.health = 0;
        target.deaths += 1;
        
        if (shooter) {
          shooter.kills += 1;
        }

        io.to(roomId).emit('ba-player-died', {
          victimId: targetId,
          killerId: socket.id,
          victimDeaths: target.deaths,
          killerKills: shooter ? shooter.kills : 0
        });

        // Respawn logic
        setTimeout(() => {
          if (activeMatches[roomId] && activeMatches[roomId].players[targetId]) {
            const p = activeMatches[roomId].players[targetId];
            p.isDead = false;
            p.health = p.maxHealth;
            p.x = Math.random() * 600 + 100;
            p.y = 100;
            io.to(roomId).emit('ba-player-respawned', p);
          }
        }, 3000);
      }
    }
  });

  socket.on('disconnect', () => {
    // Find room this socket was in
    for (const roomId in activeMatches) {
      if (activeMatches[roomId].players[socket.id]) {
        delete activeMatches[roomId].players[socket.id];
        socket.to(roomId).emit('ba-player-left', socket.id);
        
        // Clean up empty rooms
        if (Object.keys(activeMatches[roomId].players).length === 0) {
          delete activeMatches[roomId];
        }
      }
    }
  });
  
  socket.on('ba-leave', ({ roomId }) => {
    if (activeMatches[roomId] && activeMatches[roomId].players[socket.id]) {
      delete activeMatches[roomId].players[socket.id];
      socket.to(roomId).emit('ba-player-left', socket.id);
      socket.leave(roomId);
    }
  });
};
