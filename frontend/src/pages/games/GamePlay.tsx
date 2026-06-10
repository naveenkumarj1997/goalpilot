import { useLocation, Navigate } from 'react-router-dom';
import TicTacToe from './TicTacToe';
import ConnectFour from './ConnectFour';
import RockPaperScissors from './RockPaperScissors';
import Battleship from './Battleship';
import SnakeAndLadders from './SnakeAndLadders';
import KartRacer from './KartRacer';

export default function GamePlay() {
  const location = useLocation();
  const state = location.state as any;

  if (!state || !state.gameType) {
    return <Navigate to="/games" replace />;
  }

  if (state.gameType === 'TicTacToe') {
    return <TicTacToe />;
  }

  if (state.gameType === 'ConnectFour') {
    return <ConnectFour />;
  }

  if (state.gameType === 'RockPaperScissors') {
    return <RockPaperScissors />;
  }

  if (state.gameType === 'Battleship') {
    return <Battleship />;
  }

  if (state.gameType === 'SnakeAndLadders') {
    return <SnakeAndLadders />;
  }

  if (state.gameType === 'KartRacer') {
    return <KartRacer />;
  }

  return <Navigate to="/games" replace />;
}
