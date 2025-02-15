// src/components/SlotMachine/SlotMachine.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { slotMachine } from "@/utils/slot/SlotLogic";
import { SYMBOLS } from "@/utils/slot/constants";
import useSound from "use-sound";
import { useGame } from "@/providers/GameProvider";

interface Props {
  onSpin: () => Promise<void>;
  isSpinning: boolean;
  disabled?: boolean;
}

export default function SlotMachine({
  onSpin,
  isSpinning,
  disabled = false,
}: Props) {
  const [reels, setReels] = useState<string[][]>(
    Array(3).fill([...SYMBOLS.map((s) => s.symbol)]),
  );
  const [winAmount, setWinAmount] = useState<number>(0);
  const [winLine, setWinLine] = useState<boolean>(false);
  const { state } = useGame();

  // Sound effects
  const [playSpinSound] = useSound("/sounds/spin.mp3");
  const [playWinSound] = useSound("/sounds/win.mp3");

  const handleSpin = async () => {
    if (isSpinning || disabled) return;

    setWinLine(false);
    setWinAmount(0);
    playSpinSound();

    // Generate spinning animation
    const spinningReels = reels.map(() =>
      Array(20)
        .fill(null)
        .map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].symbol),
    );
    setReels(spinningReels);

    try {
      await onSpin();

      const result = slotMachine.generateSpinResult(state.currentPowerUp);

      // Update reels with result
      const finalReels = result.combination.map((id) => [
        SYMBOLS.find((s) => s.id === id)?.symbol || SYMBOLS[0].symbol,
      ]);
      setReels(finalReels);

      if (result.isWin) {
        setWinLine(true);
        setWinAmount(result.winAmount || 0);
        playWinSound();
      }
    } catch (error) {
      console.error("Spin error:", error);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-800 rounded-lg p-6">
      <div className="relative">
        {/* Win line */}
        <WinLine active={winLine} />

        {/* Reels container */}
        <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-900 p-4 rounded">
          {reels.map((reel, i) => (
            <ReelStrip
              key={i}
              symbols={reel}
              isSpinning={isSpinning}
              delay={i * 0.2}
            />
          ))}
        </div>

        {/* Win amount display */}
        <WinDisplay amount={winAmount} />

        {/* Power-up indicator */}
        {state.currentPowerUp && (
          <div className="absolute top-2 right-2 bg-purple-600 px-3 py-1 rounded-full text-sm">
            {state.currentPowerUp.value}x
          </div>
        )}
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning || disabled}
        className={`
          w-full py-4 px-6 rounded-lg transition-all transform
          ${
            isSpinning || disabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 hover:scale-105"
          }
          text-white font-bold text-lg shadow-lg
        `}
      >
        {isSpinning ? (
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            Spinning...
          </motion.span>
        ) : disabled ? (
          "Not enough credits"
        ) : (
          "SPIN"
        )}
      </button>

      {/* Bet display */}
      <div className="mt-4 text-center text-gray-300">
        Bet: {state.currentBet} credits
      </div>
    </div>
  );
}

// src/components/SlotMachine/ReelStrip.tsx
interface ReelStripProps {
  symbols: string[];
  isSpinning: boolean;
  delay: number;
}

export function ReelStrip({ symbols, isSpinning, delay }: ReelStripProps) {
  return (
    <div className="relative h-24 overflow-hidden bg-gray-800 rounded">
      <motion.div
        animate={{
          y: isSpinning ? [0, -1000, 0] : 0,
        }}
        transition={{
          duration: isSpinning ? 2 : 0.5,
          delay,
          ease: "easeOut",
        }}
        className="flex flex-col items-center"
      >
        {symbols.map((symbol, j) => (
          <div
            key={j}
            className="flex items-center justify-center h-24 text-4xl"
          >
            {symbol}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// src/components/SlotMachine/WinLine.tsx
interface WinLineProps {
  active: boolean;
}

export function WinLine({ active }: WinLineProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0.5, 1],
            scale: [1, 1.1, 1],
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 bg-yellow-500/30 z-10 rounded"
        />
      )}
    </AnimatePresence>
  );
}

// src/components/SlotMachine/WinDisplay.tsx
interface WinDisplayProps {
  amount: number;
}

export function WinDisplay({ amount }: WinDisplayProps) {
  return (
    <AnimatePresence>
      {amount > 0 && (
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{
            scale: 1,
            y: 0,
            rotate: [0, -5, 5, -5, 0],
          }}
          exit={{ scale: 0, y: 50 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                     bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg z-20
                     shadow-lg text-xl"
        >
          WIN! {amount} credits
        </motion.div>
      )}
    </AnimatePresence>
  );
}
