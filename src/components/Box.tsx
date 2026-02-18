import { Player } from './Constants.ts';
import { playerWin, dealerWin } from './Winners.tsx';

export type BoxProps = {
  winner: Player;
};

export default function Box(props: BoxProps) {
  return (
    <button className="box">
      {props.winner === Player.Dealer ? dealerWin() : playerWin()}
    </button>
  );
}
