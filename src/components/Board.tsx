import { Player } from './Constants.ts';
import Column from './Column.tsx';

type BoardProps = {
  Winners: Player[][];
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
