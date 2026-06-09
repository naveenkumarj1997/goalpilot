import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import gameService from '../../services/gameService';
import type { GameStat, MatchHistory } from '../../types/game';
import { Users, Trophy, History, Gamepad2, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MiniGamesDashboard() {
  const { onlineUsers, socket } = useSocket();
  const [leaderboard, setLeaderboard] = useState<GameStat[]>([]);
  const [myStats, setMyStats] = useState<GameStat | null>(null);
  const [myHistory, setMyHistory] = useState<MatchHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Invitation Modal State
  const [isInviting, setIsInviting] = useState<{ targetId: string, name: string } | null>(null);
  const [selectedGame, setSelectedGame] = useState('TicTacToe');
  const [selectedFormat, setSelectedFormat] = useState('single');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [lb, stats, history] = await Promise.all([
        gameService.getLeaderboard(),
        gameService.getMyStats(),
        gameService.getMyHistory()
      ]);
      setLeaderboard(lb);
      setMyStats(stats);
      setMyHistory(history);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = () => {
    if (isInviting && socket) {
      socket.emit('invitePlayer', { targetUserId: isInviting.targetId, gameType: selectedGame, format: selectedFormat });
      alert(`Invitation sent to ${isInviting.name}! Waiting for them to accept...`);
      setIsInviting(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-100">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-8 border border-blue-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse" />
        <div className="absolute bottom-[-50%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse" />
        
        <h1 className="text-4xl font-extrabold flex items-center relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          <Gamepad2 className="w-10 h-10 mr-4 text-blue-400" />
          Gaming Lounge
        </h1>
        <p className="text-slate-400 mt-2 text-lg relative z-10">Challenge online players in real-time, rank up on the leaderboard, and claim victory.</p>
        
        {myStats && (
          <div className="flex gap-6 mt-6 relative z-10">
            <div className="bg-slate-800/80 px-6 py-3 rounded-xl border border-slate-700 backdrop-blur-sm">
              <div className="text-sm text-slate-400 font-medium">Win Rate</div>
              <div className="text-2xl font-bold text-blue-400">{myStats.winRate}%</div>
            </div>
            <div className="bg-slate-800/80 px-6 py-3 rounded-xl border border-slate-700 backdrop-blur-sm">
              <div className="text-sm text-slate-400 font-medium">Total Wins</div>
              <div className="text-2xl font-bold text-green-400">{myStats.wins}</div>
            </div>
            <div className="bg-slate-800/80 px-6 py-3 rounded-xl border border-slate-700 backdrop-blur-sm">
              <div className="text-sm text-slate-400 font-medium">Matches Played</div>
              <div className="text-2xl font-bold text-purple-400">{myStats.gamesPlayed}</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ONLINE PLAYERS */}
        <div className="lg:col-span-1 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[500px]">
          <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-400" />
              Online Players
            </h2>
            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full">{onlineUsers.length} Online</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {onlineUsers.length === 0 ? (
              <div className="text-center text-slate-500 mt-10">No other players online right now.</div>
            ) : (
              onlineUsers.map(u => (
                <div key={u.userId} className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-400 mr-3 animate-pulse" />
                    <span className="font-medium">{u.username}</span>
                  </div>
                  <button 
                    onClick={() => setIsInviting({ targetId: u.userId, name: u.username })}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Challenge
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* LEADERBOARD & HISTORY */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Leaderboard */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 bg-slate-900/50">
              <h2 className="text-lg font-bold flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                Global Leaderboard
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                    <th className="p-4 font-medium">Rank</th>
                    <th className="p-4 font-medium">Player</th>
                    <th className="p-4 font-medium text-center">Wins</th>
                    <th className="p-4 font-medium text-center">Win Rate</th>
                    <th className="p-4 font-medium text-center">Played</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {leaderboard.map((stat, i) => (
                    <tr key={stat._id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-bold text-slate-500">#{i + 1}</td>
                      <td className="p-4 font-medium text-blue-300">{stat.user.name}</td>
                      <td className="p-4 text-center font-bold text-green-400">{stat.wins}</td>
                      <td className="p-4 text-center font-bold">{stat.winRate}%</td>
                      <td className="p-4 text-center text-slate-400">{stat.gamesPlayed}</td>
                    </tr>
                  ))}
                  {leaderboard.length === 0 && !loading && (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">No data available yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Match History */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 bg-slate-900/50">
              <h2 className="text-lg font-bold flex items-center">
                <History className="w-5 h-5 mr-2 text-purple-400" />
                Recent Matches
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-slate-800">
                  {myHistory.map(match => (
                    <tr key={match._id} className="hover:bg-slate-800/50 transition-colors text-sm">
                      <td className="p-4 font-bold text-purple-400">{match.gameType}</td>
                      <td className="p-4 text-slate-300">
                        {match.isDraw ? (
                          <span className="text-yellow-500 font-bold">DRAW</span>
                        ) : (
                          <>
                            <span className="text-green-400 font-bold">{match.winner?.name}</span>
                            <span className="text-slate-500 mx-2">def.</span>
                            <span className="text-red-400 font-bold">{match.loser?.name}</span>
                          </>
                        )}
                      </td>
                      <td className="p-4 text-right text-slate-500">
                        {new Date(match.playedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {myHistory.length === 0 && !loading && (
                    <tr><td colSpan={3} className="p-8 text-center text-slate-500">Play some matches to see your history!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Invite Modal */}
      {isInviting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl p-6 w-full max-w-sm relative"
          >
            <h3 className="text-xl font-bold text-white mb-4">Challenge {isInviting.name}</h3>
            <div className="space-y-3 mb-6">
              {['TicTacToe', 'ConnectFour', 'RockPaperScissors', 'Battleship', 'SnakeAndLadders'].map(game => (
                <button
                  key={game}
                  onClick={() => setSelectedGame(game)}
                  className={`w-full p-4 rounded-xl text-left border transition-all ${
                    selectedGame === game 
                      ? 'border-blue-500 bg-blue-500/10 text-blue-300' 
                      : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <div className="font-bold">
                    {game === 'TicTacToe' ? 'Tic-Tac-Toe' : game === 'ConnectFour' ? 'Connect Four' : game === 'RockPaperScissors' ? 'Rock Paper Scissors' : game === 'Battleship' ? 'Battleship' : 'Snakes & Ladders'}
                  </div>
                </button>
              ))}
            </div>

            {selectedGame === 'RockPaperScissors' && (
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-400 mb-2">Match Format</label>
                <div className="flex gap-2">
                  {[
                    { id: 'single', label: 'Single' },
                    { id: 'bo3', label: 'Best of 3' },
                    { id: 'bo5', label: 'Best of 5' },
                  ].map(format => (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg border transition-all ${
                        selectedFormat === format.id
                          ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button 
                onClick={() => setIsInviting(null)}
                className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl hover:bg-slate-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendInvite}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-500 transition-colors font-medium shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                Send Invite
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
