// src/providers/GameProvider.tsx
import { createContext, useContext, useReducer, ReactNode } from "react";
import { GameState, PowerUp } from "@/types";

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

type GameAction =
  | { type: "ADD_CREDITS"; payload: number }
  | { type: "USE_CREDITS"; payload: number }
  | { type: "ACTIVATE_POWER_UP"; payload: PowerUp }
  | { type: "DEACTIVATE_POWER_UP" }
  | { type: "INCREMENT_WINS" }
  | { type: "INCREMENT_SPINS" };

const initialState: GameState = {
  credits: 1000,
  currentPowerUp: null,
  wins: 0,
  spins: 0,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ADD_CREDITS":
      return { ...state, credits: state.credits + action.payload };
    case "USE_CREDITS":
      return { ...state, credits: state.credits - action.payload };
    case "ACTIVATE_POWER_UP":
      return { ...state, currentPowerUp: action.payload };
    case "DEACTIVATE_POWER_UP":
      return { ...state, currentPowerUp: null };
    case "INCREMENT_WINS":
      return { ...state, wins: state.wins + 1 };
    case "INCREMENT_SPINS":
      return { ...state, spins: state.spins + 1 };
    default:
      return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
