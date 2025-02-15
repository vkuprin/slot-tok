import { GameError, GameErrorCode } from "./GameError";

export const handleGameError = (error: unknown): string => {
  if (error instanceof GameError) {
    switch (error.code) {
      case GameErrorCode.INSUFFICIENT_CREDITS:
        return "Not enough credits to play";
      case GameErrorCode.VIDEO_LOAD_ERROR:
        return "Failed to load video content";
      case GameErrorCode.NETWORK_ERROR:
        return "Connection issues. Please try again";
      case GameErrorCode.SPIN_ERROR:
        return "Error during spin. Please try again";
      case GameErrorCode.POWERUP_ERROR:
        return "Error activating power-up";
      case GameErrorCode.AUTH_ERROR:
        return "Authentication error. Please log in again";
      default:
        return "An unexpected error occurred";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};
