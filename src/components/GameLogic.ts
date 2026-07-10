import { Player } from './Constants.ts';

export type Cell =
  | { kind: 'result'; winner: Player.Dealer | Player.Player; tieCount: number }
  | { kind: 'tie'; tieCount: number };

/** A column on a real Big Road board only ever holds 6 cells of a streak. */
export const BIG_ROAD_ROWS = 6;

/**
 * Rebuilds the Big Road board from the full chronological event log.
 * Ties don't start a new column; they tally onto the most recent
 * Dealer/Player cell. A run of ties before any Dealer/Player result gets
 * its own standalone cell so it's never lost, even if no result ever follows.
 * A streak longer than BIG_ROAD_ROWS spills into a new column to its right
 * ("dragon tail") instead of growing a single column without limit.
 */
export function buildMat(events: Player[]): Cell[][] {
  const mat: Cell[][] = [];
  let currentCol: Cell[] = [];
  let hasResult = false;
  let streakWinner: Player.Dealer | Player.Player | null = null;

  for (const event of events) {
    if (event === Player.Tie) {
      if (!hasResult && currentCol.length === 0) {
        currentCol = [{ kind: 'tie', tieCount: 0 }];
        mat.push(currentCol);
      }
      currentCol[currentCol.length - 1].tieCount++;
      continue;
    }

    hasResult = true;
    if (streakWinner === event && currentCol.length < BIG_ROAD_ROWS) {
      currentCol.push({ kind: 'result', winner: event, tieCount: 0 });
    } else {
      streakWinner = event;
      currentCol = [{ kind: 'result', winner: event, tieCount: 0 }];
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
  let dealerWins = 0;
  let playerWins = 0;
  let ties = 0;

  for (const event of events) {
    if (event === Player.Dealer) dealerWins++;
    else if (event === Player.Player) playerWins++;
    else ties++;
  }

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
