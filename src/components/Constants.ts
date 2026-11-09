export enum Player {
  Dealer = 'X',
  Player = 'O',
  Tie = 'T',
}

export enum InputMethods {
  Text = 'text',
  Arduino = 'arduino',
  NintendoSwitch = 'nintendo-switch',
}

export const STATS_WINDOW_OPTIONS = [10, 20] as const;
export type StatsWindow = (typeof STATS_WINDOW_OPTIONS)[number];
