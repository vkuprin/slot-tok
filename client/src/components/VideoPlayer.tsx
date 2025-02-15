// src/components/VideoPlayer.tsx
import { useEffect, useRef, useState } from "react";
import { Video } from "@/types";
import { motion } from "framer-motion";

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
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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

      {/* Engagement Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLiked(!isLiked)}
          className={`p-2 rounded-full bg-gray-800/80 ${
            isLiked ? "text-red-500" : "text-white"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSaved(!isSaved)}
          className={`p-2 rounded-full bg-gray-800/80 ${
            isSaved ? "text-yellow-500" : "text-white"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill={isSaved ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            // Implement share functionality
            if (navigator.share) {
              navigator.share({
                title: "Check out this video!",
                url: video.url,
              });
            }
          }}
          className="p-2 rounded-full bg-gray-800/80 text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
