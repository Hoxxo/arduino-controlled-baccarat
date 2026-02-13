import Box from './Box.tsx';
import { Player } from './Constants.ts';

export type ColProps = {
  WinnerColumns: Player[];
};

export default function Column({ WinnerColumns }: ColProps) {
  return (
    <div className="column">
      {WinnerColumns.map((w, i) => (
        <Box key={i} winner={w} />
      ))}
    </div>
  );
}
