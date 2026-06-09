export interface GameStat {
  _id: string;
  user: {
    _id: string;
    name: string;
    email?: string;
  };
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
  winRate: number;
}

export interface MatchHistory {
  _id: string;
  gameType: string;
  winner?: { _id: string; name: string };
  loser?: { _id: string; name: string };
  isDraw: boolean;
  duration: number;
  playedAt: string;
}

export interface OnlineUser {
  socketId: string;
  userId: string;
  username: string;
}
