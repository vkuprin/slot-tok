import { useState } from "react";
import { useGame } from "@/providers/GameProvider";
import SlotMachine from "./SlotMachine";
import { EnhancedVideoPlayer } from "./EnhancedVideoPlayer";
import PowerUpBar from "./PowerUpBar";
import StatsBar from "./StatsBar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { handleGameError } from "@/utils/errors/errorHandling";

export default function MainContent() {
  const [isSpinning, setIsSpinning] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { state, dispatch } = useGame();

  const handleSpin = async () => {
    if (state.credits < 10) {
      alert("Not enough credits!");
      return;
    }

    try {
      setIsSpinning(true);
      dispatch({ type: "USE_CREDITS", payload: 10 });
      dispatch({ type: "INCREMENT_SPINS" });

      // Simulate slot spin
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Random win logic
      const isWin = Math.random() > 0.7;
      if (isWin) {
        const winAmount = state.currentPowerUp
          ? 20 * state.currentPowerUp.value
          : 20;
        dispatch({ type: "ADD_CREDITS", payload: winAmount });
        dispatch({ type: "INCREMENT_WINS" });
      }
    } catch (error) {
      const errorMessage = handleGameError(error);
      alert(errorMessage);
    } finally {
      setIsSpinning(false);
    }
  };

  const handleVideoError = (error: Error) => {
    const errorMessage = handleGameError(error);
    console.error("Video error:", errorMessage);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <StatsBar />
      <main
        className={`max-w-7xl mx-auto p-4 ${
          isMobile ? "space-y-4" : "flex gap-6"
        }`}
      >
        <div className={isMobile ? "w-full" : "w-2/3"}>
          <PowerUpBar />
          <SlotMachine
            onSpin={handleSpin}
            isSpinning={isSpinning}
            disabled={state.credits < 10}
          />
        </div>
        <div className={isMobile ? "w-full" : "w-1/3"}>
          <EnhancedVideoPlayer
            autoPlay
            muted
            onVideoEnd={() => handleSpin()}
            onError={handleVideoError}
          />
        </div>
      </main>
    </div>
  );
}
