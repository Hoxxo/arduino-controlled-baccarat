import { STATS_WINDOW_OPTIONS, type StatsWindow } from './Constants.ts';
import type { Stats as StatsType } from './GameLogic.ts';

type StatsProps = {
  stats: StatsType;
  windowSize: StatsWindow;
  onWindowSizeChange: (windowSize: StatsWindow) => void;
};

export default function Stats({
  stats,
  windowSize,
  onWindowSizeChange,
}: StatsProps) {
  const fmt = (n: number) => `${n.toFixed(1)}%`;

  return (
    <div className="stats-panel">
      <label className="stats-window" htmlFor="stats-window-select">
        Statistics for last
        <select
          id="stats-window-select"
          value={windowSize}
          onChange={(event) =>
            onWindowSizeChange(Number(event.target.value) as StatsWindow)
          }
        >
          {STATS_WINDOW_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option} hands
            </option>
          ))}
        </select>
      </label>
      <div className="stats">
        <div className="stats__item">
          <span>Recent hands</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stats__item stats__item--dealer">
          <span>Banker</span>
          <strong>
            {stats.dealerWins} ({fmt(stats.dealerPct)})
          </strong>
        </div>
        <div className="stats__item stats__item--player">
          <span>Player</span>
          <strong>
            {stats.playerWins} ({fmt(stats.playerPct)})
          </strong>
        </div>
        <div className="stats__item stats__item--tie">
          <span>Tie</span>
          <strong>
            {stats.ties} ({fmt(stats.tiePct)})
          </strong>
        </div>
      </div>
    </div>
  );
}
