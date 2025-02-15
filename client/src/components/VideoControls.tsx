import { useState } from "react";
import { motion } from "framer-motion";
import { Video } from "@/types";

interface VideoControlsProps {
  progress: number;
  isBuffering: boolean;
  video: Video;
}

export function VideoControls({
  progress,
}: VideoControlsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-4">
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
        <motion.div
          className="h-full bg-red-500"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Control buttons */}
      <div className="absolute bottom-8 right-4 flex flex-col gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-full bg-gray-800/80 
            ${isLiked ? "text-red-500" : "text-white"}`}
          onClick={handleLike}
        >
          {/* Like icon */}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-full bg-gray-800/80 
            ${isSaved ? "text-yellow-500" : "text-white"}`}
          onClick={handleSave}
        >
          {/* Save icon */}
        </motion.button>
      </div>
    </div>
  );
}
