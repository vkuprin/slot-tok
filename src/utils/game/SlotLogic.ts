import { SlotResult, PowerUp, SlotSymbol } from "@/types";
import { GameError, GameErrorCode } from "../errors/GameError";

export class SlotMachineLogic {
  private static instance: SlotMachineLogic;

  private constructor() {}

  public static getInstance(): SlotMachineLogic {
    if (!SlotMachineLogic.instance) {
      SlotMachineLogic.instance = new SlotMachineLogic();
    }
    return SlotMachineLogic.instance;
  }

  private getRandomSymbol(): SlotSymbol {
    const SYMBOLS: SlotSymbol[] = [
      {
        id: 1,
        name: "Cherry",
        symbol: "🍒",
        value: 10,
        probability: 0.4,
      },
      {
        id: 2,
        name: "Lemon",
        symbol: "🍋",
        value: 20,
        probability: 0.3,
      },
      {
        id: 3,
        name: "Seven",
        symbol: "7️⃣",
        value: 50,
        probability: 0.2,
      },
      {
        id: 4,
        name: "Diamond",
        symbol: "💎",
        value: 100,
        probability: 0.1,
      },
    ];

    const random = Math.random();
    let probabilitySum = 0;

    for (const symbol of SYMBOLS) {
      probabilitySum += symbol.probability;
      if (random <= probabilitySum) {
        return symbol;
      }
    }

    return SYMBOLS[0];
  }

  public generateSpinResult(powerUp?: PowerUp): SlotResult {
    try {
      const shouldWin = Math.random() > 0.5; // 50% chance to win

      if (shouldWin) {
        const winningSymbol = this.getRandomSymbol();
        const reels = Array(3).fill(winningSymbol);

        const baseWinAmount = winningSymbol.value;
        const multiplier = powerUp?.type === "multiplier" ? powerUp.value : 1;

        return {
          combination: reels.map((r) => r.id),
          isWin: true,
          winAmount: baseWinAmount * multiplier,
          multiplier,
        };
      } else {
        const reels = Array(3)
          .fill(null)
          .map(() => this.getRandomSymbol());

        return {
          combination: reels.map((r) => r.id),
          isWin: false,
        };
      }
    } catch {
      throw new GameError(
        "Failed to generate spin result",
        GameErrorCode.SPIN_ERROR,
      );
    }
  }
}

export const slotMachine = SlotMachineLogic.getInstance();
