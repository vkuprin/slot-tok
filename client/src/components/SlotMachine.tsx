// src/components/SlotMachine.tsx
import { useState } from "react";
import { motion } from "framer-motion";

// Update the Props interface to include disabled
interface Props {
  onSpin: () => void | Promise<void>; // Allow for async function
  isSpinning: boolean;
  disabled?: boolean; // Add disabled prop
}

const SYMBOLS = ["🍎", "🍋", "🍒", "7️⃣", "💎"];
const REEL_COUNT = 3;

export default function SlotMachine({
  onSpin,
  isSpinning,
  disabled = false,
}: Props) {
  const [reels, setReels] = useState<string[][]>(
    Array(REEL_COUNT).fill(SYMBOLS),
  );

  const handleSpin = () => {
    if (isSpinning || disabled) return;
    onSpin();
    // Animate reels
    const newReels = reels.map(() =>
      [...SYMBOLS].sort(() => Math.random() - 0.5),
    );
    setReels(newReels);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-800 rounded-lg p-6">
      <div className="grid grid-cols-3 gap-2 mb-4 bg-white p-4 rounded">
        {reels.map((reel, i) => (
          <motion.div
            key={i}
            className="flex justify-center items-center text-4xl"
            animate={{ y: isSpinning ? [0, -20, 0] : 0 }}
            transition={{
              duration: 0.5,
              repeat: isSpinning ? Infinity : 0,
            }}
          >
            {reel[0]}
          </motion.div>
        ))}
      </div>
      <button
        onClick={handleSpin}
        disabled={isSpinning || disabled}
        className={`w-full py-3 px-6 rounded-lg transition-colors
                   ${
                     isSpinning || disabled
                       ? "bg-gray-400 cursor-not-allowed"
                       : "bg-red-500 hover:bg-red-600"
                   } text-white`}
      >
        {isSpinning ? "Spinning..." : disabled ? "Not enough credits" : "SPIN"}
      </button>
    </div>
  );
}
