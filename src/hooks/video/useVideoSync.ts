import { useState, useEffect, useRef } from "react";
import { useInfiniteVideos } from "./useVideos";
import { Video } from "@/types";
import { GameError, GameErrorCode } from "@/utils/errors/GameError";

interface VideoSyncState {
  currentVideo: Video | null;
  isBuffering: boolean;
  isPreloading: boolean;
  progress: number;
}

export function useVideoSync() {
  const [state, setState] = useState<VideoSyncState>({
    currentVideo: null,
    isBuffering: true,
    isPreloading: false,
    progress: 0,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const preloadRef = useRef<HTMLVideoElement>(null);
  const currentIndexRef = useRef(0);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteVideos();

  const videos = data?.pages.flat() ?? [];

  useEffect(() => {
    if (videos.length > 0 && !state.currentVideo) {
      setState((prev) => ({ ...prev, currentVideo: videos[0] }));
    }
  }, [state.currentVideo, videos]);

  const preloadNextVideo = async () => {
    const nextIndex = currentIndexRef.current + 1;
    if (nextIndex < videos.length) {
      setState((prev) => ({ ...prev, isPreloading: true }));

      try {
        if (preloadRef.current) {
          preloadRef.current.src = videos[nextIndex].url;
          await preloadRef.current.load();
        }
      } catch (error) {
        console.error("Failed to preload video:", error);
      }

      setState((prev) => ({ ...prev, isPreloading: false }));
    }
  };

  const advanceToNextVideo = async () => {
    try {
      const nextIndex = currentIndexRef.current + 1;

      if (
        nextIndex >= videos.length - 3 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        await fetchNextPage();
      }

      if (nextIndex < videos.length) {
        currentIndexRef.current = nextIndex;
        setState((prev) => ({
          ...prev,
          currentVideo: videos[nextIndex],
          isBuffering: true,
          progress: 0,
        }));

        preloadNextVideo();
      } else {
        throw new GameError(
          "No more videos available",
          GameErrorCode.VIDEO_LOAD_ERROR,
        );
      }
    } catch {
      throw new GameError(
        "Failed to advance to next video",
        GameErrorCode.VIDEO_LOAD_ERROR,
      );
    }
  };

  const handleProgress = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setState((prev) => ({ ...prev, progress }));
    }
  };

  const handleCanPlay = () => {
    setState((prev) => ({ ...prev, isBuffering: false }));
  };

  return {
    videoRef,
    preloadRef,
    ...state,
    advanceToNextVideo,
    handleProgress,
    handleCanPlay,
  };
}
