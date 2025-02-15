// src/components/PowerUpBar.tsx
import { motion } from "framer-motion";
import { useGame } from "@/providers/GameProvider";
import { PowerUp, PowerUpType } from "@/types";

const powerUps: PowerUp[] = [
  {
    id: "1",
    type: "multiplier" as PowerUpType,
    value: 2,
    icon: "2x",
  },
  {
    id: "2",
    type: "multiplier" as PowerUpType,
    value: 3,
    icon: "3x",
  },
  {
    id: "3",
    type: "extra_spin" as PowerUpType,
    value: 1,
    icon: "🎰",
  },
];

export default function PowerUpBar() {
  const { state, dispatch } = useGame();

  const handlePowerUpClick = (powerUp: PowerUp) => {
    if (state.credits >= 50) {
      dispatch({ type: "USE_CREDITS", payload: 50 });
      dispatch({ type: "ACTIVATE_POWER_UP", payload: powerUp });

      // Auto-deactivate after 5 spins
      setTimeout(
        () => {
          dispatch({ type: "DEACTIVATE_POWER_UP" });
        },
        5 * 60 * 1000,
      );
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      {powerUps.map((powerUp) => (
        <motion.button
          key={powerUp.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-lg ${
            state.currentPowerUp?.id === powerUp.id
              ? "bg-purple-600"
              : "bg-gray-700"
          } ${state.credits < 50 ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => handlePowerUpClick(powerUp)}
          disabled={state.credits < 50}
        >
          <span className="text-xl">{powerUp.icon}</span>
        </motion.button>
      ))}
    </div>
  );
}
