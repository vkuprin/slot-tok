import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useInfiniteVideos } from "@/hooks/video/useVideos";
import { VideoPlayer } from "./VideoPlayer";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useInView } from "react-intersection-observer";

interface VideoFeedProps {
  onVideoEnd?: () => void;
  onError?: (error: Error) => void;
  onLoadStart?: () => void;
  onLoaded?: () => void;
}

export const VideoFeed = forwardRef<
  { advanceToNextVideo: () => Promise<void> },
  VideoFeedProps
>(({ onVideoEnd, onError, onLoadStart, onLoaded }, ref) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteVideos();

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastManualAdvanceRef = useRef<number>(0);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
  });

  useImperativeHandle(ref, () => ({
    advanceToNextVideo: async () => {
      try {
        onLoadStart?.();
        setIsVideoLoading(true);
        lastManualAdvanceRef.current = Date.now();

        if (currentVideoIndex >= (data?.pages.flat().length || 0) - 2) {
          await fetchNextPage();
        }

        setCurrentVideoIndex((prevIndex) => prevIndex + 1);

        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsVideoLoading(false);
        onLoaded?.();
      } catch (error) {
        setIsVideoLoading(false);
        onError?.(error as Error);
      }
    },
  }));

  useEffect(() => {
    const currentEl = containerRef.current?.querySelector(
      `[data-index="${currentVideoIndex}"]`,
    ) as HTMLElement | null;
    if (currentEl) {
      currentEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentVideoIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now();
        if (now - lastManualAdvanceRef.current < 600) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index)) {
              setCurrentVideoIndex(index);
            }
          }
        });
      },
      {
        threshold: 0.7,
        root: containerRef.current,
      },
    );

    const videos = containerRef.current?.querySelectorAll("[data-index]");
    videos?.forEach((video) => observer.observe(video));

    return () => observer.disconnect();
  }, [data?.pages]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  const allVideos = data?.pages.flat() ?? [];

  const handleVideoError = (error: Error) => {
    setIsVideoLoading(false);
    onError?.(error);
  };

  const handleVideoEnd = async () => {
    if (!isVideoLoading) {
      try {
        await onVideoEnd?.();
      } catch (error) {
        onError?.(error as Error);
      }
    }
  };

  return (
    <div className="relative h-full" ref={containerRef}>
      <div className="snap-y snap-mandatory h-full overflow-auto">
        {allVideos.map((video, index) => (
          <div
            key={`${video.id}-${index}`}
            className="snap-start h-full relative"
            data-index={index}
          >
            <VideoPlayer
              video={video}
              autoPlay={index === currentVideoIndex}
              isActive={index === currentVideoIndex}
              muted
              onVideoEnd={
                index === currentVideoIndex ? handleVideoEnd : undefined
              }
              onError={handleVideoError}
            />

            {isVideoLoading && index === currentVideoIndex && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
                <LoadingSpinner />
              </div>
            )}
          </div>
        ))}

        <div
          ref={loadMoreRef}
          className="h-20 flex items-center justify-center"
        >
          {isFetchingNextPage && <LoadingSpinner />}
        </div>
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
        {allVideos.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-4 rounded-full transition-colors duration-200 ${
              index === currentVideoIndex ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
});

VideoFeed.displayName = "VideoFeed";
