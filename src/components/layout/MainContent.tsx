import { useState, useCallback, useRef } from "react";
import { useGame } from "@/hooks/game/useGameProvider";
import SlotMachine from "../game/slot/SlotMachine";
import { VideoFeed } from "../video/VideoFeed";
import PowerUpBar from "../game/slot/PowerUpBar";
import StatsBar from "../game/stats/StatsBar";
import { useMediaQuery } from "@/hooks/video/useMediaQuery";
import { handleGameError } from "@/utils/errors/errorHandling";
import { slotMachine } from "@/utils/game/SlotLogic";

export default function MainContent() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { state, dispatch } = useGame();
  const videoFeedRef = useRef<{ advanceToNextVideo: () => Promise<void> }>(
    null,
  );

  const handleSpin = async () => {
    if (state.credits < state.currentBet || isSpinning || isVideoLoading) {
      alert("Not enough credits or action in progress!");
      return;
    }

    try {
      setIsSpinning(true);
      dispatch({ type: "USE_CREDITS", payload: state.currentBet });
      dispatch({ type: "INCREMENT_SPINS" });

      await Promise.all([
        new Promise((resolve) => setTimeout(resolve, 2000)),
        videoFeedRef.current?.advanceToNextVideo(),
      ]);

      const spinResult = slotMachine.generateSpinResult(
        state.currentPowerUp || undefined,
      );

      if (spinResult.isWin) {
        const winAmount = spinResult.winAmount || 0;
        dispatch({ type: "ADD_CREDITS", payload: winAmount });
        dispatch({ type: "INCREMENT_WINS" });
        dispatch({
          type: "ADD_WIN_HISTORY",
          payload: {
            amount: winAmount,
            timestamp: Date.now(),
          },
        });

        if (state.currentPowerUp?.duration) {
          const powerUpExpired = state.spins >= state.currentPowerUp.duration;
          if (powerUpExpired) {
            dispatch({ type: "DEACTIVATE_POWER_UP" });
          }
        }
      }
    } catch (error) {
      const errorMessage = handleGameError(error);
      console.error("Spin error:", error);
      alert(errorMessage);
    } finally {
      setIsSpinning(false);
    }
  };

  const handleVideoError = useCallback((error: Error) => {
    const errorMessage = handleGameError(error);
    console.error("Video error:", errorMessage);
  }, []);

  const handleVideoLoadStart = useCallback(() => {
    setIsVideoLoading(true);
  }, []);

  const handleVideoLoaded = useCallback(() => {
    setIsVideoLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <StatsBar />
      <div className="max-w-8xl mx-auto p-4">
        <div
          className={`${
            isMobile ? "flex flex-col gap-4" : "grid grid-cols-8 gap-6 h-[90vh]"
          }`}
        >
          <div className={`${isMobile ? "w-full" : "col-span-6 h-full"}`}>
            <div className="h-full flex flex-col">
              <PowerUpBar />
              <div className="flex-1 flex items-center">
                <SlotMachine
                  onSpin={handleSpin}
                  isSpinning={isSpinning || isVideoLoading}
                  disabled={state.credits < state.currentBet}
                />
              </div>
            </div>
          </div>

          <div
            className={`${isMobile ? "w-full h-[80vh]" : "col-span-2 h-full"}`}
          >
            <div className="w-full h-full rounded-lg overflow-hidden shadow-lg bg-gray-800">
              <VideoFeed
                ref={videoFeedRef}
                // TODO: auto triger spin on video end mode
                onVideoEnd={() => {}}
                onError={handleVideoError}
                onLoadStart={handleVideoLoadStart}
                onLoaded={handleVideoLoaded}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
