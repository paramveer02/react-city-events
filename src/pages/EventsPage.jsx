import { useContext, useEffect, useState } from "react";
import EventCard from "../components/events/EventCard";
import { motion } from "framer-motion";
import getJSON from "../utils/api";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("Detecting your location…");
  const { isAuth, user } = useContext(AuthContext);

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

  return (
    <section
      className="relative min-h-[calc(100vh-var(--header-h))] pb-24"
      style={{ paddingTop: "var(--header-h)" }}
    >
      {/* background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-2.jpg')" }}
        aria-hidden
      />
      <div className="fixed inset-0 -z-10 bg-black/45" aria-hidden />

      <div className="mx-auto w-[min(96%,1100px)]">
        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-lg p-5 sm:p-7">
          {/* heading */}
          <div className="mb-5 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
            <motion.h2
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="text-2xl sm:text-3xl font-extrabold"
            >
              <span className="text-fuchsia-400">✨</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400">
                Events <span className="text-fuchsia-400">Near Me</span>
              </span>{" "}
              <span className="text-fuchsia-400">✨</span>
            </motion.h2>

            {isAuth && (
              <Link
                to="/create"
                className="group relative inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold text-white
                           bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500
                           hover:brightness-110 active:scale-[0.98] transition"
              >
                ➕ Create New Event
              </Link>
            )}
          </div>

          {/* status (single place) */}
          {status && <div className="mb-3 text-sm text-white/80">{status}</div>}

          {/* search bar */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-5"
          >
            <input
              type="text"
              placeholder="🔍 Search events by title…"
              className="w-full rounded-full border border-white/30 bg-white/15 px-4 py-2 text-white placeholder-white/70
                         outline-none focus:ring-2 focus:ring-fuchsia-300/60 backdrop-blur-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </motion.div>

          {/* list */}
          {events.length === 0 ? (
            <p className="text-center text-white/90">No events found.</p>
          ) : filteredEvents.length === 0 ? (
            <p className="rounded-lg bg-white/10 px-4 py-3 text-center text-white/95">
              No matching events found.
            </p>
          ) : (
            <ul className="space-y-6">
              {filteredEvents
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((ev) => (
                  <EventCard key={ev.id} {...ev} />
                ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
