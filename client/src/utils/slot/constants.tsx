import { SlotSymbol } from "@/types";

export const SYMBOLS: SlotSymbol[] = [
  {
    id: 1,
    name: "Cherry",
    symbol: "🍒",
    value: 10,
    probability: 0.3,
  },
  {
    id: 2,
    name: "Lemon",
    symbol: "🍋",
    value: 20,
    probability: 0.25,
  },
  {
    id: 3,
    name: "Seven",
    symbol: "7️⃣",
    value: 50,
    probability: 0.15,
  },
  {
    id: 4,
    name: "Diamond",
    symbol: "💎",
    value: 100,
    probability: 0.1,
  },
];

export const SPIN_DURATION = 2000; // ms
export const MIN_BET = 10;
export const MAX_BET = 100;
