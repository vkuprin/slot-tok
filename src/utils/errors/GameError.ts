export class GameError extends Error {
  constructor(
    message: string,
    public code: GameErrorCode,
  ) {
    super(message);
    this.name = "GameError";
  }
}

export enum GameErrorCode {
  INSUFFICIENT_CREDITS = "INSUFFICIENT_CREDITS",
  VIDEO_LOAD_ERROR = "VIDEO_LOAD_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  SPIN_ERROR = "SPIN_ERROR",
  POWERUP_ERROR = "POWERUP_ERROR",
  AUTH_ERROR = "AUTH_ERROR",
}
