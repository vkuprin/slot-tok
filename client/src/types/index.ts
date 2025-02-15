// src/types/index.ts
export interface Video {
  id: string;
  url: string;
  thumbnail: string;
  duration: number;
  likes: number;
  saved: boolean;
  liked: boolean;
  description: string;
  title: string;
}

export interface User {
  id: string;
  credits: number;
  powerUps: PowerUp[];
}

export interface PowerUp {
  id: string;
  type: "multiplier" | "extra_spin" | "bonus";
  value: number;
  duration?: number;
}

export interface SlotSymbol {
  id: number;
  name: string;
  symbol: string;
  value: number;
  probability: number;
}

export interface SlotResult {
  combination: number[];
  isWin: boolean;
  winAmount?: number;
  multiplier?: number;
}

export interface GameState {
  credits: number;
  currentPowerUp: PowerUp | null;
  wins: number;
  spins: number;
}

export type PowerUpType = "multiplier" | "extra_spin" | "bonus";

export interface PowerUp {
  id: string;
  type: PowerUpType;
  value: number;
  icon: string;
  duration?: number;
}

export type GameMode = "normal" | "turbo" | "practice";

export interface GameStatistics {
  totalWinAmount: number;
  averageWinAmount: number;
  winRate: number;
}

export interface GameState {
  credits: number;
  currentPowerUp: PowerUp | null;
  wins: number;
  spins: number;
  currentBet: number;
  isAutoPlay: boolean;
  gameMode: GameMode;
  winHistory: Array<{
    amount: number;
    timestamp: number;
  }>;
  highestWin: number;
  lastWin: number;
  powerUpsAvailable: PowerUp[];
  statistics: GameStatistics;
}
