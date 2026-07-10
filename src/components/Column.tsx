import Box from './Box.tsx';
import type { Cell } from './GameLogic.ts';

export type ColProps = {
  WinnerColumns: Cell[];
};

export default function Column({ WinnerColumns }: ColProps) {
  return (
    <div className="column">
      {WinnerColumns.map((cell, i) => (
        <Box key={i} cell={cell} />
      ))}
    </div>
  );
}
