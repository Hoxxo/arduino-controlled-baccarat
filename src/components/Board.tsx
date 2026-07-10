import Column from './Column.tsx';
import type { Cell } from './GameLogic.ts';

type BoardProps = {
  Winners: Cell[][];
};

export default function Board({ Winners }: BoardProps) {
  return (
    <div className="board">
      {Winners.map((col, ci) => (
        <div className="board__column-wrapper" key={ci}>
          <Column WinnerColumns={col} />
        </div>
      ))}
    </div>
  );
}
