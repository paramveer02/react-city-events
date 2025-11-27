import { MapPin, Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function EventCard({
  id,
  title,
  location,
  date,
  organizerName,
  mine = false,
}) {
  const formattedDate = new Date(date).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <Link to={`/events/${id}`}>
      <motion.li
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="group relative premium-card rounded-2xl overflow-hidden"
      >
        {/* Card Container with Gradient Background */}
        <div
          className="relative p-4 sm:p-6 glass-dark border border-white/20 rounded-2xl
                     hover:border-purple-400/50 hover:shadow-[0_20px_60px_rgba(168,85,247,0.4)]
                     transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(236,72,153,0.1) 50%, rgba(168,85,247,0.1) 100%)`,
          }}
        >
          {/* Gradient Glow */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20
                        opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
          />

          {/* Content */}
          <div className="relative z-10 space-y-3 sm:space-y-4">
            {/* Title */}
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white group-hover:gradient-text transition-all duration-300 flex-1 line-clamp-2">
                {title}
              </h3>
              <motion.div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0
                         group-hover:bg-purple-500/40 transition-colors"
                whileHover={{ rotate: 45 }}
              >
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
              </motion.div>
            </div>

            {/* Organizer */}
            {(mine || organizerName) && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 text-purple-400" />
                </div>
                <span className="truncate">
                  Organized by{" "}
                  <span className="font-semibold text-white">
                    {mine ? "You" : organizerName}
                  </span>
                </span>
              </div>
            )}

            {/* Location & Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3 h-3 text-pink-400" />
                </div>
                <span className="truncate">{location}</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-3 h-3 text-blue-400" />
                </div>
                <span className="truncate">{formattedDate}</span>
              </div>
            </div>

            {/* Hover Indicator */}
            <div
              className="flex items-center gap-2 text-purple-400 text-xs sm:text-sm font-semibold
                          opacity-0 group-hover:opacity-100 transition-opacity"
            >
              View Details
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </motion.li>
    </Link>
  );
}
