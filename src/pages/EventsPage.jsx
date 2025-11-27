import { useContext, useEffect, useState } from "react";
import EventCard from "../components/events/EventCard";
import { motion } from "framer-motion";
import getJSON from "../utils/api";
import { Link, useSearchParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Search, Plus, MapPin, Sparkles } from "lucide-react";
import Loader from "../components/Loader";
import confetti from "canvas-confetti";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("Detecting your location…");
  const [loading, setLoading] = useState(true);
  const { isAuth, user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  // Trigger confetti when event is created
  useEffect(() => {
    if (searchParams.get("created") === "1") {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [searchParams]);

  useEffect(() => {
    let ignore = false;

    const getPosition = () =>
      new Promise((resolve, reject) => {
        if (!("geolocation" in navigator)) {
          reject(new Error("Geolocation is not supported."));
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          (err) => reject(err),
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
        );
      });

    (async () => {
      try {
        setLoading(true);
        const coords = await getPosition();
        if (ignore) return;

        setStatus("Fetching nearby events…");
        const url = `https://events-server-wnax.onrender.com/api/v1/events/near?lat=${coords.latitude}&lng=${coords.longitude}`;
        const data = await getJSON(url);

        const list = Array.isArray(data?.events)
          ? data.events
          : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data)
          ? data
          : [];

        // pull organizer name if populated; mark as mine if matches
        const normalized = list.map((e) => ({
          id: e._id ?? e.id,
          title: e.title,
          location: e.location,
          date: e.date,
          organizerName: e.organizer?.name ?? e.organizerName, // works with populated or pre-shaped data
          mine:
            user?._id &&
            (e.organizer?._id === user._id || e.organizer === user._id),
        }));

        setEvents(normalized);
        setLoading(false);

        if (normalized.length === 0) {
          setStatus(
            data?.city
              ? `No nearby events in ${data.city} yet.`
              : "No nearby events found."
          );
        } else {
          setStatus(data?.city ? `Showing events in ${data.city}.` : "");
        }
      } catch (err) {
        if (ignore) return;
        setLoading(false);
        if (
          err?.code === 1 ||
          (err?.message || "").toLowerCase().includes("denied")
        ) {
          setStatus(
            "Location permission denied. Enable it to see nearby events."
          );
        } else {
          setStatus("Could not detect your location.");
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, [user?._id]);

  const filteredEvents = events.filter((e) =>
    (e.title ?? "").toLowerCase().includes(searchTerm)
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="relative min-h-screen pb-24 pt-32 sm:pt-36 px-4 sm:px-6 lg:px-8">
      {/* Animated Background - Fixed */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-black to-pink-950" />
        {/* Removed the odd background image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-dark rounded-2xl sm:rounded-3xl border-2 border-white/20 p-6 sm:p-8 lg:p-12 shadow-[0_20px_70px_rgba(168,85,247,0.2)]"
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text">
                  Events Near You
                </h2>
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400 animate-pulse" />
              </div>
              {status && (
                <p className="text-white/70 text-xs sm:text-sm flex items-center gap-2 mt-2">
                  {status}
                </p>
              )}
            </motion.div>

            {isAuth && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link to="/create">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-white text-sm sm:text-base
                               bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600
                               bg-[length:200%_100%] hover:bg-right
                               shadow-[0_0_30px_rgba(168,85,247,0.4)]
                               transition-all duration-500 overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Create Event</span>
                      <span className="sm:hidden">Create</span>
                    </span>
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                                    -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    />
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative mb-6 sm:mb-8"
          >
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search events by title..."
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl premium-input text-white
                         focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </motion.div>

          {/* Events Grid */}
          {events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center py-20"
            >
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
              <p className="text-xl text-white/70">No events found nearby.</p>
              <p className="text-sm text-white/50 mt-2">
                Try adjusting your location or check back later!
              </p>
            </motion.div>
          ) : filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Search className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
              <p className="text-xl text-white/70">No matching events found.</p>
              <p className="text-sm text-white/50 mt-2">
                Try a different search term.
              </p>
            </motion.div>
          ) : (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {filteredEvents
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((ev, index) => (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <EventCard {...ev} />
                  </motion.div>
                ))}
            </motion.ul>
          )}
        </motion.div>
      </div>
    </section>
  );
}
