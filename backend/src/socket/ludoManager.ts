export interface LudoToken {
  id: number;
  player: 'red' | 'blue';
  progress: number; // 0 = Base, 1 = Start cell, 2-51 = Outer path, 52-56 = Home path, 57 = Finished
}

export interface LudoGameState {
  roomId: string;
  players: {
    red: string; // userId
    blue: string; // userId
  };
  turn: 'red' | 'blue';
  diceValue: number | null;
  hasRolled: boolean;
  tokens: LudoToken[];
  winner: string | null;
  startTime: number;
  movesCount: number;
}

export const SAFE_ZONES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

export class LudoManager {
  private games: Map<string, LudoGameState> = new Map();

  public initGame(roomId: string, redPlayerId: string, bluePlayerId: string): LudoGameState {
    const tokens: LudoToken[] = [];
    for (let i = 0; i < 4; i++) tokens.push({ id: i, player: 'red', progress: 0 });
    for (let i = 4; i < 8; i++) tokens.push({ id: i, player: 'blue', progress: 0 });

    const state: LudoGameState = {
      roomId,
      players: { red: redPlayerId, blue: bluePlayerId },
      turn: 'red',
      diceValue: null,
      hasRolled: false,
      tokens,
      winner: null,
      startTime: Date.now(),
      movesCount: 0
    };

    this.games.set(roomId, state);
    return state;
  }

  public getGame(roomId: string): LudoGameState | undefined {
    return this.games.get(roomId);
  }

  public removeGame(roomId: string) {
    this.games.delete(roomId);
  }

  // Helper to map progress to a global cell index on the outer track (0-51)
  // Returns -1 if not on outer track
  public getGlobalIndex(player: 'red' | 'blue', progress: number): number {
    if (progress < 1 || progress > 51) return -1;
    const startOffset = player === 'red' ? 0 : 26;
    return (progress - 1 + startOffset) % 52;
  }

  public rollDice(roomId: string, userId: string): { success: boolean, diceValue?: number, error?: string, nextTurn?: boolean } {
    const game = this.games.get(roomId);
    if (!game) return { success: false, error: 'Game not found' };
    
    const isRedTurn = game.turn === 'red';
    if ((isRedTurn && game.players.red !== userId) || (!isRedTurn && game.players.blue !== userId)) {
      return { success: false, error: 'Not your turn' };
    }

    if (game.hasRolled) return { success: false, error: 'Already rolled' };

    const roll = Math.floor(Math.random() * 6) + 1;
    game.diceValue = roll;
    game.hasRolled = true;

    // Check if player has any valid moves
    const validMoves = this.getValidMoves(game, game.turn, roll);
    if (validMoves.length === 0) {
       // Turn skipped
       if (roll !== 6) {
           game.turn = game.turn === 'red' ? 'blue' : 'red';
       }
       game.hasRolled = false;
       game.diceValue = null;
       return { success: true, diceValue: roll, nextTurn: true };
    }

    return { success: true, diceValue: roll, nextTurn: false };
  }

  public getValidMoves(game: LudoGameState, player: 'red'|'blue', roll: number): number[] {
     const validTokenIds: number[] = [];
     const playerTokens = game.tokens.filter(t => t.player === player);
     
     for (const token of playerTokens) {
         if (token.progress === 57) continue; // Already finished
         if (token.progress === 0) {
             if (roll === 6) validTokenIds.push(token.id); // Can spawn
         } else {
             const newProgress = token.progress + roll;
             if (newProgress <= 57) validTokenIds.push(token.id); // Can move
         }
     }
     return validTokenIds;
  }

  public moveToken(roomId: string, userId: string, tokenId: number): { success: boolean, capturedIds?: number[], error?: string, state?: LudoGameState } {
    const game = this.games.get(roomId);
    if (!game) return { success: false, error: 'Game not found' };
    
    const isRedTurn = game.turn === 'red';
    if ((isRedTurn && game.players.red !== userId) || (!isRedTurn && game.players.blue !== userId)) {
      return { success: false, error: 'Not your turn' };
    }

    if (!game.hasRolled || game.diceValue === null) {
      return { success: false, error: 'Must roll first' };
    }

    const validMoves = this.getValidMoves(game, game.turn, game.diceValue);
    if (!validMoves.includes(tokenId)) {
      return { success: false, error: 'Invalid move' };
    }

    const token = game.tokens.find(t => t.id === tokenId);
    if (!token) return { success: false, error: 'Token not found' };

    let capturedIds: number[] = [];
    let grantedExtraTurn = game.diceValue === 6;

    if (token.progress === 0) {
      // Spawn
      token.progress = 1;
    } else {
      // Move forward
      token.progress += game.diceValue;

      // Check for captures
      const globalIdx = this.getGlobalIndex(token.player, token.progress);
      if (globalIdx !== -1 && !SAFE_ZONES.has(globalIdx)) {
        // Find opponent tokens at this global index
        const opponentTokens = game.tokens.filter(t => t.player !== token.player);
        for (const opToken of opponentTokens) {
          const opGlobalIdx = this.getGlobalIndex(opToken.player, opToken.progress);
          if (opGlobalIdx === globalIdx) {
            // Captured!
            opToken.progress = 0;
            capturedIds.push(opToken.id);
            grantedExtraTurn = true; // Extra turn for capturing
          }
        }
      }

      if (token.progress === 57) {
        grantedExtraTurn = true; // Extra turn for reaching home
      }
    }

    game.movesCount++;
    game.hasRolled = false;
    game.diceValue = null;

    if (!grantedExtraTurn) {
      game.turn = game.turn === 'red' ? 'blue' : 'red';
    }

    // Check Win Condition
    const myTokens = game.tokens.filter(t => t.player === game.turn);
    if (myTokens.every(t => t.progress === 57)) {
      game.winner = game.turn;
    }

    return { success: true, capturedIds, state: game };
  }
}

export const ludoManager = new LudoManager();
