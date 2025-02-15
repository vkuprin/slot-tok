import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { GameState, PowerUp, GameMode } from "@/types";

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
  | { type: "INCREMENT_SPINS" }
  | { type: "SET_BET"; payload: number }
  | { type: "TOGGLE_AUTOPLAY" }
  | { type: "SET_GAME_MODE"; payload: GameMode }
  | { type: "ADD_WIN_HISTORY"; payload: { amount: number; timestamp: number } }
  | { type: "RESET_GAME" };

const initialState: GameState = {
  credits: 1000,
  currentPowerUp: null,
  wins: 0,
  spins: 0,
  currentBet: 10,
  isAutoPlay: false,
  gameMode: "normal",
  winHistory: [],
  highestWin: 0,
  lastWin: 0,
  powerUpsAvailable: [],
  statistics: {
    totalWinAmount: 0,
    averageWinAmount: 0,
    winRate: 0,
  },
};

const GameContext = createContext<GameContextType | undefined>(undefined);

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ADD_CREDITS":
      return {
        ...state,
        credits: state.credits + action.payload,
        lastWin: action.payload,
        highestWin: Math.max(state.highestWin, action.payload),
        statistics: {
          ...state.statistics,
          totalWinAmount: state.statistics.totalWinAmount + action.payload,
          averageWinAmount:
            (state.statistics.totalWinAmount + action.payload) /
            (state.wins + 1),
          winRate: ((state.wins + 1) / (state.spins + 1)) * 100,
        },
      };

    case "USE_CREDITS":
      return {
        ...state,
        credits: state.credits - action.payload,
      };

    case "ACTIVATE_POWER_UP":
      return {
        ...state,
        currentPowerUp: action.payload,
        powerUpsAvailable: state.powerUpsAvailable.filter(
          (p) => p.id !== action.payload.id,
        ),
      };

    case "DEACTIVATE_POWER_UP":
      return {
        ...state,
        currentPowerUp: null,
      };

    case "INCREMENT_WINS":
      return {
        ...state,
        wins: state.wins + 1,
      };

    case "INCREMENT_SPINS":
      return {
        ...state,
        spins: state.spins + 1,
        statistics: {
          ...state.statistics,
          winRate: (state.wins / (state.spins + 1)) * 100,
        },
      };

    case "SET_BET":
      return {
        ...state,
        currentBet: action.payload,
      };

    case "TOGGLE_AUTOPLAY":
      return {
        ...state,
        isAutoPlay: !state.isAutoPlay,
      };

    case "SET_GAME_MODE":
      return {
        ...state,
        gameMode: action.payload,
      };

    case "ADD_WIN_HISTORY": {
      const newWinHistory = [action.payload, ...state.winHistory].slice(0, 10);
      return {
        ...state,
        winHistory: newWinHistory,
      };
    }

    case "RESET_GAME":
      return {
        ...initialState,
        powerUpsAvailable: state.powerUpsAvailable,
      };

    default:
      return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Persist game state to localStorage
  useEffect(() => {
    localStorage.setItem("gameState", JSON.stringify(state));
  }, [state]);

  // Auto-save interval
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem("gameState", JSON.stringify(state));
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
