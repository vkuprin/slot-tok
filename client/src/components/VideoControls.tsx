import { useState } from "react";
import { Video } from "@/types";
import { AnimatePresence, motion } from "framer-motion";

interface VideoControlsProps {
  progress: number;
  isBuffering: boolean;
  video: Video;
  isPlaying: boolean;
}

export function VideoControls({ progress, isPlaying }: VideoControlsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <motion.div
      className="absolute inset-0"
      onHoverStart={() => setShowControls(true)}
      onHoverEnd={() => setShowControls(false)}
      onTapStart={() => setShowControls(true)}
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
        <motion.div
          className="h-full bg-red-500"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"
          >
            {/* Control buttons */}
            <div className="absolute bottom-8 right-4 flex flex-col gap-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-full bg-gray-800/80 
                  ${isLiked ? "text-red-500" : "text-white"}`}
                onClick={handleLike}
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
                className={`p-3 rounded-full bg-gray-800/80 
                  ${isSaved ? "text-yellow-500" : "text-white"}`}
                onClick={handleSave}
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

              {/* Play/Pause button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-full bg-gray-800/80 text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isPlaying ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                  )}
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
