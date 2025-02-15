import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  SyntheticEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVideoSync } from "@/hooks/video/useVideoSync";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useInView } from "react-intersection-observer";
import { VideoOverlay } from "./VideoOverlay";
import { Video } from "@/types";

interface EnhancedVideoPlayerProps {
  video?: Video;
  onVideoEnd?: () => Promise<void>;
  onError?: (error: Error) => void;
  autoPlay?: boolean;
  muted?: boolean;
  isActive?: boolean;
}

export interface VideoPlayerRef {
  advanceToNextVideo: () => Promise<void>;
  play: () => Promise<void>;
  pause: () => void;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, EnhancedVideoPlayerProps>(
  (
    {
      video,
      onVideoEnd,
      onError,
      autoPlay = true,
      muted = true,
      isActive = false,
    },
    ref,
  ) => {
    const {
      videoRef,
      preloadRef,
      currentVideo,
      isBuffering,
      advanceToNextVideo,
      handleProgress,
      handleCanPlay,
    } = useVideoSync();

    const [isPlaying, setIsPlaying] = useState(false);
    const playAttemptRef = useRef<Promise<void> | null>(null);
    const progressInterval = useRef<number | null>(null);

    const { ref: inViewRef, inView } = useInView({
      threshold: 0.7,
    });

    const videoToShow = video || currentVideo;

    useImperativeHandle(ref, () => ({
      advanceToNextVideo: async () => {
        try {
          await advanceToNextVideo();
        } catch (error) {
          onError?.(error as Error);
        }
      },
      play: async () => {
        if (!videoRef.current || isPlaying) return;

        try {
          if (playAttemptRef.current) {
            await playAttemptRef.current;
          }
          playAttemptRef.current = videoRef.current.play();
          await playAttemptRef.current;
          setIsPlaying(true);
        } catch (error) {
          if (error instanceof Error && error.name !== "AbortError") {
            onError?.(error);
          }
        } finally {
          playAttemptRef.current = null;
        }
      },
      pause: () => {
        if (!videoRef.current || !isPlaying) return;
        videoRef.current.pause();
        setIsPlaying(false);
      },
    }));

    useEffect(() => {
      if (!videoRef.current) return;

      const shouldPlay = autoPlay && inView && isActive;

      if (shouldPlay && !isPlaying) {
        const playVideo = async () => {
          try {
            if (playAttemptRef.current) {
              await playAttemptRef.current;
            }
            playAttemptRef.current = videoRef.current?.play() as Promise<void>;
            await playAttemptRef.current;
            setIsPlaying(true);
          } catch (error) {
            if (error instanceof Error && error.name !== "AbortError") {
              console.error("Video playback error:", error);
            }
          } finally {
            playAttemptRef.current = null;
          }
        };
        playVideo();
      } else if (!shouldPlay && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }

      return () => {
        if (videoRef.current && isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      };
    }, [autoPlay, inView, isActive, isPlaying, videoRef]);

    useEffect(() => {
      if (isPlaying) {
        progressInterval.current = window.setInterval(handleProgress, 1000);
      }

      return () => {
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      };
    }, [handleProgress, isPlaying]);

    const handleVideoEnd = async () => {
      setIsPlaying(false);
      try {
        await onVideoEnd?.();
      } catch (error) {
        onError?.(error as Error);
      }
    };

    const handleVideoError = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
      const error = e.currentTarget.error;
      if (!error) return;

      const errorMessages: Record<number, string> = {
        1: "Video loading aborted",
        2: "Network error while loading video",
        3: "Video decoding error",
        4: "Video format not supported",
      };

      const errorMessage = errorMessages[error.code] || "Unknown video error";

      if (error.code !== 1) {
        onError?.(new Error(errorMessage));
      }
    };

    if (!videoToShow) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <LoadingSpinner />
        </div>
      );
    }

    return (
      <div ref={inViewRef} className="absolute inset-0 bg-black">
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
          src={videoToShow.url}
          poster={videoToShow.thumbnail}
          muted={muted}
          playsInline
          loop={false}
          onCanPlay={handleCanPlay}
          onEnded={handleVideoEnd}
          onError={handleVideoError}
        />

        <video
          ref={preloadRef}
          className="hidden"
          preload="auto"
          muted
          playsInline
        />

        <VideoOverlay isPlaying={isPlaying && !isBuffering} />
      </div>
    );
  },
);
