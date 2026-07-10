import { Player } from './Constants.ts';

export type Cell = {
  winner: Player;
  tieCount: number;
};

/**
 * Rebuilds the Big Road board from the full chronological event log.
 * Ties don't start a new column; they're tallied onto the most recent
 * Dealer/Player cell. A run of ties before any Dealer/Player result gets
 * its own standalone cell.
 */
export function buildMat(events: Player[]): Cell[][] {
  const mat: Cell[][] = [];
  let currentCol: Cell[] = [];
  let leadingTies = 0;
  let started = false;

  for (const event of events) {
    if (event === Player.Tie) {
      if (!started) {
        leadingTies++;
      } else {
        currentCol[currentCol.length - 1].tieCount++;
      }
      continue;
    }

    if (!started) {
      started = true;
      if (leadingTies > 0) {
        mat.push([{ winner: Player.Tie, tieCount: leadingTies }]);
        leadingTies = 0;
      }
      currentCol = [{ winner: event, tieCount: 0 }];
      mat.push(currentCol);
      continue;
    }

    const lastResult = currentCol[currentCol.length - 1].winner;
    if (lastResult === event) {
      currentCol.push({ winner: event, tieCount: 0 });
    } else {
      currentCol = [{ winner: event, tieCount: 0 }];
      mat.push(currentCol);
    }
  }

  return mat;
}

export type Stats = {
  total: number;
  dealerWins: number;
  playerWins: number;
  ties: number;
  dealerPct: number;
  playerPct: number;
  tiePct: number;
};

export function computeStats(events: Player[]): Stats {
  const total = events.length;
  const dealerWins = events.filter((e) => e === Player.Dealer).length;
  const playerWins = events.filter((e) => e === Player.Player).length;
  const ties = events.filter((e) => e === Player.Tie).length;
  const pct = (n: number) => (total === 0 ? 0 : (n / total) * 100);

  return {
    total,
    dealerWins,
    playerWins,
    ties,
    dealerPct: pct(dealerWins),
    playerPct: pct(playerWins),
    tiePct: pct(ties),
  };
}
