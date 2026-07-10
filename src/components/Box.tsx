import { Player } from './Constants.ts';
import { dealerWin, playerWin, tieWin } from './Winners.tsx';
import type { Cell } from './GameLogic.ts';

export type BoxProps = {
  cell: Cell;
};

export default function Box({ cell }: BoxProps) {
  const symbol =
    cell.winner === Player.Dealer
      ? dealerWin()
      : cell.winner === Player.Player
        ? playerWin()
        : tieWin();

  const showBadge =
    cell.tieCount > 0 && !(cell.winner === Player.Tie && cell.tieCount === 1);

  return (
    <button className="box">
      {symbol}
      {showBadge && (
        <span className="tie-badge">
          {cell.tieCount > 1 ? cell.tieCount : ''}
        </span>
      )}
    </button>
  );
}
