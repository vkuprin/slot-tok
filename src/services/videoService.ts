import axios from "axios";
import { Video } from "@/types";

const pexelsClient = axios.create({
  baseURL: "https://api.pexels.com/videos",
  headers: {
    Authorization: import.meta.env.VITE_PUBLIC_PEXELS_API_KEY,
  },
});

interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  user: {
    id: number;
    name: string;
    url: string;
  };
  video_files: {
    id: number;
    fps: number;
    width: number;
    height: number;
    quality: string;
    file_type: string;
    link: string;
    size: number;
  }[];
  image: string;
}

interface PexelsResponse {
  page: number;
  per_page: number;
  total_results: number;
  videos: PexelsVideo[];
}

const transformPexelsVideo = (pexelsVideo: PexelsVideo): Video => {
  console.log(pexelsVideo);
  const videoFile =
    pexelsVideo.video_files.find(
      (file) => file.quality === "sd" && file.file_type === "video/mp4",
    ) || pexelsVideo.video_files[0];

  return {
    id: pexelsVideo.id.toString(),
    url: videoFile.link,
    thumbnail: pexelsVideo.image,
    duration: pexelsVideo.duration,
  };
};

export const getRandomVideos = async (count = 10): Promise<Video[]> => {
  try {
    const { data } = await pexelsClient.get<PexelsResponse>("/search", {
      params: {
        query: "nature,city,people,animals",
        per_page: count,
        orientation: "portrait",
      },
    });

    return data.videos.map(transformPexelsVideo);
  } catch (error) {
    console.error("Error fetching random videos:", error);
    throw new Error("Failed to fetch random videos");
  }
};
