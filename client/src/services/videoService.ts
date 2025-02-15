import axios from "axios";
import { Video } from "@/types";

/*
{
    "id": 30706354,
    "width": 1080,
    "height": 1920,
    "duration": 7,
    "full_res": null,
    "tags": [],
    "url": "https://www.pexels.com/video/copenhagen-nyhavn-harbor-scenic-view-30706354/",
    "image": "https://images.pexels.com/videos/30706354/2025-4-k-video-4k-4k-resolution-30706354.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=630",
    "avg_color": null,
    "user": {
        "id": 2786187,
        "name": "Efrem  Efre",
        "url": "https://www.pexels.com/@efrem-efre-2786187"
    },
    "video_files": [
        {
            "id": 13137910,
            "quality": null,
            "file_type": "video/mp4",
            "width": 360,
            "height": 640,
            "fps": 25,
            "link": "https://videos.pexels.com/video-files/30706354/13137910_360_640_25fps.mp4",
            "size": 1380359
        },
        {
            "id": 13137911,
            "quality": null,
            "file_type": "video/mp4",
            "width": 540,
            "height": 960,
            "fps": 25,
            "link": "https://videos.pexels.com/video-files/30706354/13137911_540_960_25fps.mp4",
            "size": 2835848
        },
        {
            "id": 13137912,
            "quality": null,
            "file_type": "video/mp4",
            "width": 720,
            "height": 1280,
            "fps": 25,
            "link": "https://videos.pexels.com/video-files/30706354/13137912_720_1280_25fps.mp4",
            "size": 4461115
        },
        {
            "id": 13137913,
            "quality": null,
            "file_type": "video/mp4",
            "width": 1080,
            "height": 1920,
            "fps": 25,
            "link": "https://videos.pexels.com/video-files/30706354/13137913_1080_1920_25fps.mp4",
            "size": 7328096
        }
    ],
    "video_pictures": [
        {
            "id": 25052823,
            "nr": 0,
            "picture": "https://images.pexels.com/videos/30706354/pictures/preview-0.jpg"
        },
        {
            "id": 25052824,
            "nr": 1,
            "picture": "https://images.pexels.com/videos/30706354/pictures/preview-1.jpg"
        },
        {
            "id": 25052825,
            "nr": 2,
            "picture": "https://images.pexels.com/videos/30706354/pictures/preview-2.jpg"
        },
        {
            "id": 25052826,
            "nr": 3,
            "picture": "https://images.pexels.com/videos/30706354/pictures/preview-3.jpg"
        },
        {
            "id": 25052827,
            "nr": 4,
            "picture": "https://images.pexels.com/videos/30706354/pictures/preview-4.jpg"
        },
        {
            "id": 25052828,
            "nr": 5,
            "picture": "https://images.pexels.com/videos/30706354/pictures/preview-5.jpg"
        }
    ]
}
 */

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
