"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getRandomVideos } from "@/services/videoService";
import { Video } from "@/types";

export function useVideos(initialCount = 10) {
  return useQuery<Video[]>({
    queryKey: ["videos"],
    queryFn: () => getRandomVideos(initialCount),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useInfiniteVideos(initialCount = 10) {
  return useInfiniteQuery<Video[]>({
    queryKey: ["infiniteVideos"],
    queryFn: () => getRandomVideos(initialCount),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === initialCount ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
