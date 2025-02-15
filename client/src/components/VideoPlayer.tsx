import { useEffect, useRef, useState } from "react";
import { Video } from "@/types";

interface Props {
  video: Video;
  isPlaying: boolean;
  onError?: (error: string) => void;
  onVideoEnd?: () => void;
}

export default function VideoPlayer({
  video,
  isPlaying,
  onError,
  onVideoEnd,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (isPlaying) {
        videoElement.play().catch((err) => {
          console.error("Video playback error:", err);
          onError?.(err.message);
        });
      } else {
        videoElement.pause();
      }
    }
  }, [isPlaying, onError]);

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const error = "Failed to load video";
    console.error(error, e);
    onError?.(error);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleEnded = () => {
    onVideoEnd?.();
  };

  return (
    <div className="relative w-full aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
        poster={video.thumbnail}
        onError={handleError}
        onLoadedData={handleLoad}
        onEnded={handleEnded}
      >
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
