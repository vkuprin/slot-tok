import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVideoSync } from "@/hooks/useVideoSync";
import { LoadingSpinner } from "./LoadingSpinner";
import { VideoControls } from "@/components/VideoControls";

interface EnhancedVideoPlayerProps {
  onVideoEnd?: () => void;
  onError?: (error: Error) => void;
  autoPlay?: boolean;
  muted?: boolean;
}

export function EnhancedVideoPlayer({
  onVideoEnd,
  onError,
  autoPlay = true,
  muted = true,
}: EnhancedVideoPlayerProps) {
  const {
    videoRef,
    preloadRef,
    currentVideo,
    isBuffering,
    progress,
    advanceToNextVideo,
    handleProgress,
    handleCanPlay,
  } = useVideoSync();

  const progressInterval = useRef<number>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (autoPlay) {
        videoRef.current.play().catch(onError);
      }

      progressInterval.current = window.setInterval(handleProgress, 1000);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [autoPlay, currentVideo, handleProgress, onError, videoRef]);

  const handleVideoEnd = async () => {
    try {
      await advanceToNextVideo();
      onVideoEnd?.();
    } catch (error) {
      onError?.(error as Error);
    }
  };

  if (!currentVideo) {
    return null;
  }

  return (
    <div className="relative w-full aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden">
      <AnimatePresence>
        {isBuffering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <LoadingSpinner />
          </motion.div>
        )}
      </AnimatePresence>

      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={currentVideo.url}
        poster={currentVideo.thumbnail}
        muted={muted}
        playsInline
        onCanPlay={handleCanPlay}
        onEnded={handleVideoEnd}
        onError={() => onError?.(new Error("Video playback error"))}
      />

      {/* Preload next video */}
      <video
        ref={preloadRef}
        className="hidden"
        preload="auto"
        muted
        playsInline
      />

      <VideoControls
        progress={progress}
        isBuffering={isBuffering}
        video={currentVideo}
      />
    </div>
  );
}
