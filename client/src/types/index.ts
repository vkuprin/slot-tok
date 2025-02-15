// src/types/index.ts
export interface Video {
  id: string;
  url: string;
  thumbnail: string;
  duration: number;
  likes: number;
  saved: boolean;
  liked: boolean;
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
