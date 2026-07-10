import type { Stats as StatsType } from './GameLogic.ts';

type StatsProps = {
  stats: StatsType;
};

export default function Stats({ stats }: StatsProps) {
  const fmt = (n: number) => `${n.toFixed(1)}%`;

  return (
    <div className="stats">
      <div className="stats__item">
        <span>Hands</span>
        <strong>{stats.total}</strong>
      </div>
      <div className="stats__item stats__item--dealer">
        <span>Dealer</span>
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
  );
}
