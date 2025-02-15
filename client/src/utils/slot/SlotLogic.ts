import { SlotResult, PowerUp, SlotSymbol } from "@/types";
import { SYMBOLS } from "./constants";
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

  public generateSpinResult(powerUp?: PowerUp): SlotResult {
    try {
      const reels = Array(3)
        .fill(null)
        .map(() => this.getRandomSymbol());

      const isWin = reels.every((symbol) => symbol.id === reels[0].id);
      const baseWinAmount = isWin ? reels[0].value : 0;
      const multiplier = powerUp?.type === "multiplier" ? powerUp.value : 1;

      return {
        combination: reels.map((r) => r.id),
        isWin,
        winAmount: baseWinAmount * multiplier,
        multiplier,
      };
    } catch (error) {
      throw new GameError(
        "Failed to generate spin result",
        GameErrorCode.SPIN_ERROR,
        error,
      );
    }
  }

  private getRandomSymbol(): SlotSymbol {
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

  public calculatePayout(result: SlotResult, betAmount: number): number {
    return result.isWin ? betAmount * (result.multiplier || 1) : 0;
  }
}

export const slotMachine = SlotMachineLogic.getInstance();
