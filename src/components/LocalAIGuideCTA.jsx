// src/components/LocalAIGuideCTA.jsx
import { motion } from "framer-motion";

export default function LocalAIGuideCTA({ onClick, disabled }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="
        relative px-8 py-4 rounded-2xl font-bold text-lg text-white
        bg-gradient-to-r from-purple-900 via-pink-500 to-indigo-900
        shadow-lg shadow-pink-500/40
        transition-all
        hover:brightness-110 active:scale-[0.97]
        overflow-hidden
      "
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Glow pulse */}
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-fuchsia-400/30 via-pink-400/30 to-indigo-400/30 animate-pulse"></span>

      {/* Animated sheen */}
      <span className="absolute inset-0 rounded-2xl overflow-hidden">
        <span className="absolute -left-1/2 top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shine_2.5s_linear_infinite]" />
      </span>

      <span className="relative z-10">✨ Explore with AI Guide ✨</span>
    </motion.button>
  );
}
