import { Player } from './Constants.ts';
import { dealerWin, playerWin, tieWin } from './Winners.tsx';
import type { Cell } from './GameLogic.ts';

export type BoxProps = {
  cell: Cell;
};

const RESULT_SYMBOLS = {
  [Player.Dealer]: dealerWin,
  [Player.Player]: playerWin,
} as const;

export default function Box({ cell }: BoxProps) {
  if (cell.kind === 'tie') {
    return (
      <button className="box box--tie-only">
        {tieWin()}
        {cell.tieCount > 1 && <span className="tie-badge">{cell.tieCount}</span>}
      </button>
    );
  }

  const variantClass =
    cell.winner === Player.Dealer ? 'box--dealer' : 'box--player';

  return (
    <button className={`box ${variantClass}`}>
      {RESULT_SYMBOLS[cell.winner]()}
      {cell.tieCount === 1 && <span className="tie-mark" />}
      {cell.tieCount > 1 && <span className="tie-badge">{cell.tieCount}</span>}
    </button>
  );
}
