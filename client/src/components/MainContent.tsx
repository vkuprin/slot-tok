import { useState } from "react";
import { useVideos } from "@/hooks/useVideos";
import SlotMachine from "@/components/SlotMachine";
import VideoPlayer from "@/components/VideoPlayer";

export default function MainContent() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { data: videos, isLoading, error, refetch } = useVideos(10);

  const handleSpin = async () => {
    setIsSpinning(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (videos && currentVideoIndex >= videos.length - 3) {
      await refetch();
    }

    setIsSpinning(false);
    setCurrentVideoIndex((prev) =>
      videos ? (prev + 1) % videos.length : prev,
    );
  };

  const handleVideoError = (error: string) => {
    console.error("Video error:", error);
    handleSpin();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          Error loading videos. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3">
            <SlotMachine onSpin={handleSpin} isSpinning={isSpinning} />
          </div>
          <div className="w-full md:w-1/3">
            {videos && videos[currentVideoIndex] && (
              <VideoPlayer
                video={videos[currentVideoIndex]}
                isPlaying={!isSpinning}
                onError={handleVideoError}
                onVideoEnd={() => handleSpin()}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
