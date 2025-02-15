import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { slotMachine } from "@/utils/game/SlotLogic";
import { SYMBOLS } from "@/utils/game/constants";
import { useGame } from "@/hooks/game/useGameProvider";
import { useMediaQuery } from "@/hooks/video/useMediaQuery";

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
  const [reels, setReels] = useState<string[][]>(() => {
    return Array(3)
      .fill(null)
      .map(() =>
        Array(6)
          .fill(null)
          .map(
            () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].symbol,
          ),
      );
  });
  const [winAmount, setWinAmount] = useState<number>(0);
  const { state } = useGame();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSpin = async () => {
    if (isSpinning || disabled) return;

    setWinAmount(0);

    const spinningReels = reels.map(() =>
      Array(4)
        .fill(null)
        .map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].symbol),
    );
    setReels(spinningReels);

    try {
      await onSpin();
      const result = slotMachine.generateSpinResult(
        state.currentPowerUp || undefined,
      );

      const finalReels = result.combination.map((id) => {
        const mainSymbol =
          SYMBOLS.find((s) => s.id === id)?.symbol || SYMBOLS[0].symbol;
        return Array(6).fill(mainSymbol);
      });
      setReels(finalReels);

      if (result.isWin) {
        setWinAmount(result.winAmount || 0);
      }
    } catch (error) {
      console.error("Spin error:", error);
    }
  };

  return (
    <div
      className="w-full h-full bg-gray-800 rounded-lg p-6 flex flex-col"
      style={{ maxHeight: "90vh" }}
    >
      <div className="flex-1 relative">
        <div className="h-full grid grid-cols-3 gap-2 md:gap-4 bg-gray-900 p-4 md:p-6 rounded">
          {reels.map((reel, i) => (
            <ReelStrip
              key={i}
              symbols={reel}
              isSpinning={isSpinning}
              delay={i * 0.2}
              isWinning={winAmount > 0}
              isMobile={isMobile}
            />
          ))}
        </div>

        <WinDisplay amount={winAmount} />

        {state.currentPowerUp && (
          <div className="absolute top-2 right-2 bg-purple-600 px-3 py-1 rounded-full text-sm">
            {state.currentPowerUp.value}x
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
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

        <div className="text-center text-gray-300">
          Bet: {state.currentBet} credits
        </div>
      </div>
    </div>
  );
}

interface ReelStripProps {
  symbols: string[];
  isSpinning: boolean;
  delay: number;
  isWinning?: boolean;
  isMobile?: boolean;
}

function ReelStrip({ symbols, isSpinning, delay, isWinning }: ReelStripProps) {
  const displaySymbols = isSpinning
    ? [...symbols, ...symbols].slice(0, 18)
    : symbols;

  return (
    <div className="relative h-full overflow-hidden bg-gray-800 rounded">
      <motion.div
        animate={{
          y: isSpinning ? [0, -2000, 0] : 0,
        }}
        transition={{
          duration: isSpinning ? 2 : 0.5,
          delay,
          ease: "easeOut",
        }}
        className="grid grid-rows-6 h-full w-full gap-2"
      >
        {displaySymbols.map((symbol, j) => (
          <div
            key={j}
            className={`
              flex items-center justify-center
              text-2xl sm:text-3xl md:text-5xl lg:text-6xl
              transition-all duration-300
              ${
                isWinning && j % symbols.length === 2
                  ? "text-yellow-400 scale-125 animate-bounce shadow-lg shadow-yellow-400/50"
                  : ""
              }
            `}
          >
            {symbol}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

interface WinDisplayProps {
  amount: number;
}

function WinDisplay({ amount }: WinDisplayProps) {
  return (
    <AnimatePresence>
      {amount > 0 && (
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{
            scale: [1, 1.2, 1],
            y: 0,
            rotate: [-5, 5, -5, 5, 0],
          }}
          exit={{ scale: 0, y: 50 }}
          transition={{
            duration: 0.8,
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                     bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg z-30
                     shadow-lg text-xl"
        >
          <motion.span
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
            }}
          >
            WIN! {amount} credits
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
