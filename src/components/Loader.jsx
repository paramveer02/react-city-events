import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900 z-50">
      <div className="relative">
        {/* Animated Rings */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute inset-0 w-32 h-32 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
        />

        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute inset-0 w-32 h-32 border-4 border-pink-500/30 border-b-pink-500 rounded-full"
        />

        {/* Center Icon */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
        </div>

        {/* Pulsing Glow */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"
        />
      </div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-1/3 text-center"
      >
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl font-bold text-white gradient-text"
        >
          Loading EventSpark
        </motion.h2>
        <motion.div className="flex justify-center gap-1 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [-10, 10, -10],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="w-2 h-2 bg-purple-500 rounded-full"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
