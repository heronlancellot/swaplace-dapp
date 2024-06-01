// The Raw Interface represents the object interface of a Leaderboard coming from Ponder
export interface RawLeaderboardCompleteInterface {
  id: string;
  network: bigint;
  ensName: string;
  firstInteractionDate: bigint;
  lastInteractionDate: bigint;
  createSwapCount: bigint;
  acceptSwapCount: bigint;
  cancelSwapCount: bigint;
  totalTransactionCount: bigint;
  totalScore: bigint;
}

export interface RawLeaderboardDataInterface {
  id: string;
  totalScore: bigint;
}

export interface LeaderboardData {
  Rank: number;
  Address: string;
  Points: bigint;
}

export enum Leaderboard {
  Rank = "Rank",
  Address = "Address",
  Points = "Points",
}
