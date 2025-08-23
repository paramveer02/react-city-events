import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "../components/events/EventCard";
import { AuthContext } from "../contexts/AuthContext";

export default function MyEvents() {
  const { isAuth } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchMyEvents = async () => {
      setLoading(true);
      setError("");

      try {
        const url =
          "https://events-server-wnax.onrender.com/api/v1/events/mine";
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          if (!ignore) {
            setError("You need to sign in to view your events.");
            setEvents([]);
          }
          return;
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Request failed (${res.status})`);
        }

        const data = await res.json();

        const list = Array.isArray(data?.events) ? data.events : [];
        if (!ignore) setEvents(list);
      } catch (e) {
        if (!ignore) setError(e.message || "Something went wrong.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchMyEvents();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section
      className="relative min-h-[calc(100vh-var(--header-h))] pb-24"
      style={{ paddingTop: "var(--header-h)" }}
    >
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-5.jpg')" }}
        aria-hidden
      />
      <div className="fixed inset-0 -z-10 bg-black/45" aria-hidden />

      <div className="mx-auto w-[min(96%,1100px)]">
        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] p-5 sm:p-7">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center">
            <span className="text-fuchsia-400">✨</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400">
              My <span className="text-fuchsia-400 drop-shadow">Events</span>
            </span>{" "}
            <span className="text-fuchsia-400">✨</span>
          </h2>

          {loading && <p className="text-white/90">Loading your events…</p>}

          {!loading && error && (
            <div className="rounded-xl bg-white/10 p-4 text-white/95">
              <p className="mb-3">{error}</p>
              {error.toLowerCase().includes("sign in") && (
                <Link
                  to="/signin"
                  className="inline-flex items-center rounded-xl px-4 py-2 font-semibold text-white
                             bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500
                             shadow-[0_10px_30px_rgba(99,102,241,0.35)]
                             hover:brightness-110 active:scale-[0.98] transition"
                >
                  Sign In
                </Link>
              )}
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <p className="text-white/90 text-center">
              Seems like you haven't created any events yet. Create an Event &
              Make it Happen.
            </p>
          )}

          {isAuth && (
            <div className="flex justify-center my-6">
              <Link
                to="/create"
                className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold
                 text-white border border-white/40 bg-white/10 hover:bg-white/15
                 backdrop-blur-md transition btn-pulse"
              >
                <span className="relative z-10">Create Event</span>
                <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                  <span className="btn-sheen" />
                </span>
              </Link>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <ul className="space-y-6">
              {events.map((ev) => (
                <EventCard
                  key={ev._id}
                  id={ev._id}
                  title={ev.title}
                  location={ev.location}
                  date={ev.date}
                  mine={true} // ⬅shows “Organized by You”
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
