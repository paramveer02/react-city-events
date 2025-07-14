import { useContext, useEffect, useState } from "react";
import { RingLoader } from "react-spinners";
import EventCard from "../components/events/EventCard";
import { motion } from "framer-motion";
import getJSON from "../utils/api";
import { sleep } from "../utils/helper";
import { Link } from "react-router";
import { AuthContext } from "../contexts/AuthContext";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuth } = useContext(AuthContext);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().trim().includes(searchTerm)
  );

  useEffect(() => {
    let ignore = false;

    const fetchEvents = async function () {
      setIsLoading(true);
      await sleep(1000);

      try {
        const data = await getJSON(`http://localhost:3001/api/events/`);
        if (!ignore) {
          setEvents(data.results);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchEvents();

    return () => (ignore = true);
  }, []);

  return (
    <div className="w-full pb-32 px-4 flex flex-col items-center">
      {isLoading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="rounded-full p-6 shadow-[0_0_60px_#a855f766] animate-glow">
            <RingLoader color="#000000" size={300} />
          </div>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Search Input with motion */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.03 }}
            className="w-full max-w-3xl px-4 mb-6"
          >
            <input
              type="text"
              placeholder="🔍 Search events by title..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-extrabold text-center mb-10 
            text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 
            drop-shadow-[0_2px_12px_rgba(199,108,255,0.8)] tracking-wide"
          >
            ✨ Explore All Events ✨
          </motion.h2>

          {/* Create Button */}
          {isAuth && (
            <div className="flex justify-end w-full max-w-6xl px-4 mb-6">
              <Link
                to="/create"
                className="inline-block bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500
                text-white font-semibold py-2 px-6 rounded-full shadow-md
                hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                ➕ Create New Event
              </Link>
            </div>
          )}

          {/* Conditional Rendering */}
          {events.length === 0 ? (
            <p className="text-center text-gray-900">No events found.</p>
          ) : filteredEvents.length === 0 ? (
            <p
              className="text-xl md:text-4xl font-semibold text-center text-blue-900
             px-6 py-4 rounded-lg backdrop-blur-md bg-white/10 shadow-md"
            >
              No matching events found.
            </p>
          ) : (
            <ul className="space-y-6 w-full px-4 sm:px-8 md:px-16 lg:px-28 xl:px-40 2xl:px-60">
              {filteredEvents
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
