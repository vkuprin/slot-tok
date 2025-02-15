// src/components/MainContent.tsx
import { useState } from "react";
import { useVideos } from "@/hooks/useVideos";
import { useGame } from "@/providers/GameProvider";
import SlotMachine from "./SlotMachine";
import VideoPlayer from "./VideoPlayer";
import PowerUpBar from "./PowerUpBar";
import StatsBar from "./StatsBar";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function MainContent() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { data: videos, isLoading, error, refetch } = useVideos(10);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { state, dispatch } = useGame();

  // Add the missing handleVideoError function
  const handleVideoError = (error: string) => {
    console.error("Video error:", error);
    // Move to next video on error
    setCurrentVideoIndex((prev) =>
      videos ? (prev + 1) % videos.length : prev,
    );
  };

  const handleSpin = async () => {
    if (state.credits < 10) {
      alert("Not enough credits!");
      return;
    }

    setIsSpinning(true);
    dispatch({ type: "USE_CREDITS", payload: 10 });
    dispatch({ type: "INCREMENT_SPINS" });

    // Simulate slot spin
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check for video preload
    if (videos && currentVideoIndex >= videos.length - 3) {
      await refetch();
    }

    // Random win logic
    const isWin = Math.random() > 0.7;
    if (isWin) {
      const winAmount = state.currentPowerUp
        ? 20 * state.currentPowerUp.value
        : 20;
      dispatch({ type: "ADD_CREDITS", payload: winAmount });
      dispatch({ type: "INCREMENT_WINS" });
    }

    setIsSpinning(false);
    setCurrentVideoIndex((prev) =>
      videos ? (prev + 1) % videos.length : prev,
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white animate-pulse">Loading videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-red-500">
          Error loading videos. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <StatsBar />
      <main
        className={`max-w-7xl mx-auto p-4 ${isMobile ? "space-y-4" : "flex gap-6"}`}
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
          {videos && videos[currentVideoIndex] && (
            <VideoPlayer
              video={videos[currentVideoIndex]}
              isPlaying={!isSpinning}
              onError={handleVideoError}
              onVideoEnd={() => handleSpin()}
            />
          )}
        </div>
      </main>
    </div>
  );
}
