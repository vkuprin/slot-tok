import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVideoSync } from "@/hooks/useVideoSync";
import { LoadingSpinner } from "./LoadingSpinner";
import { useInView } from "react-intersection-observer";
import { VideoControls } from "@/components/VideoControls";
import { VideoOverlay } from "@/components/VideoOverlay";

interface EnhancedVideoPlayerProps {
  onVideoEnd?: () => Promise<void>;
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
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (videoRef.current) {
      if (autoPlay && inView) {
        videoRef.current.play().catch(onError);
      } else {
        videoRef.current.pause();
      }

      progressInterval.current = window.setInterval(handleProgress, 1000);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [autoPlay, currentVideo, handleProgress, inView, onError]);

  const handleVideoEnd = async () => {
    try {
      await advanceToNextVideo();
      await onVideoEnd?.();
    } catch (error) {
      onError?.(error as Error);
    }
  };

  if (!currentVideo) {
    return null;
  }

  return (
    <div
      ref={inViewRef}
      className="relative w-full aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden"
    >
      <AnimatePresence>
        {isBuffering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
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
        loop={false}
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

      <VideoOverlay isPlaying={inView && !isBuffering} />
      <VideoControls
        progress={progress}
        isBuffering={isBuffering}
        video={currentVideo}
        isPlaying={inView && !isBuffering}
      />
    </div>
  );
}
