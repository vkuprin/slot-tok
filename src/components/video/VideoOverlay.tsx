import { AnimatePresence, motion } from "framer-motion";

interface VideoOverlayProps {
  isPlaying: boolean;
}

export function VideoOverlay({ isPlaying }: VideoOverlayProps) {
  return (
    <AnimatePresence>
      {!isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="bg-white bg-opacity-20 rounded-full p-4"
          >
            <svg
              className="w-12 h-12 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
