import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onSpin: () => void;
  isSpinning: boolean;
}

const SYMBOLS = ["🍎", "🍋", "🍒", "7️⃣", "💎"];
const REEL_COUNT = 3;

export default function SlotMachine({ onSpin, isSpinning }: Props) {
  const [reels, setReels] = useState<string[][]>(
    Array(REEL_COUNT).fill(SYMBOLS),
  );

  const handleSpin = () => {
    if (isSpinning) return;
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
        disabled={isSpinning}
        className="w-full py-3 px-6 bg-red-500 text-white rounded-lg
                 disabled:bg-gray-400 disabled:cursor-not-allowed
                 hover:bg-red-600 transition-colors"
      >
        {isSpinning ? "Spinning..." : "SPIN"}
      </button>
    </div>
  );
}
