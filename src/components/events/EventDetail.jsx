import { useMemo, useState } from "react";
import { useLoaderData, useNavigate, redirect } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  User,
  Trash2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

/** -------- LOADER --------
 * Prefetch event and current user (cookie auth).
 */
export async function eventDetailLoader({ params }) {
  const id = params.id;

  // fire both requests together; cookies must be included
  const [evRes, meRes] = await Promise.all([
    fetch(`https://events-server-wnax.onrender.com/api/v1/events/${id}`, {
      credentials: "include",
    }),
    fetch(`https://events-server-wnax.onrender.com/api/v1/users/current-user`, {
      credentials: "include",
    }),
  ]);

  // Not logged in? send to sign-in
  if (evRes.status === 401 || meRes.status === 401) {
    return redirect("/signin?next=/myevents");
  }

  if (!evRes.ok) {
    const err = await evRes.json().catch(() => ({}));
    throw new Response(err.message || "Failed to load event", {
      status: evRes.status,
    });
  }

  if (!meRes.ok) {
    const err = await meRes.json().catch(() => ({}));
    throw new Response(err.message || "Failed to load user", {
      status: meRes.status,
    });
  }

  const evData = await evRes.json();
  const userData = await meRes.json();

  // normalize shapes
  const event = evData.event ?? evData;
  const user = userData.user ?? userData;

  return { event, user };
}

/** -------- COMPONENT -------- */
export default function EventDetail() {
  const navigate = useNavigate();
  const { event, user } = useLoaderData();

  const isMine = useMemo(() => {
    if (!event?.organizer || !user?._id) return false;
    // organizer is an ObjectId string; compare to logged-in user id
    return String(event.organizer) === String(user._id);
  }, [event, user]);

  const { lat, lng } = useMemo(() => {
    const coords = event?.geo?.coordinates;
    if (Array.isArray(coords) && coords.length === 2) {
      // GeoJSON is [lng, lat]
      return { lat: coords[1], lng: coords[0] };
    }
    return { lat: event?.latitude, lng: event?.longitude };
  }, [event]);

  const formattedDate = useMemo(() => {
    try {
      return new Date(event?.date).toLocaleString("en-US", {
        dateStyle: "long",
        timeStyle: "short",
      });
    } catch {
      return event?.date || "";
    }
  }, [event]);

  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    try {
      setDeleting(true);
      const res = await fetch(
        `https://events-server-wnax.onrender.com/api/v1/events/${event._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete");
      }
      // back to My Events after delete
      navigate("/myevents");
    } catch (e) {
      alert(e.message || "Delete failed.");
      setDeleting(false);
    }
  }

  // background layers
  const Bg = (
    <>
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-black to-pink-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>
      {/* Floating Orb */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
        }}
      />
    </>
  );

  if (!event) {
    return (
      <section className="relative min-h-screen flex items-center justify-center pt-32">
        {Bg}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </section>
    );
  }

  return (
    <section className="relative min-h-screen pb-24 pt-32 sm:pt-36 px-4 sm:px-6 lg:px-8">
      {Bg}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full max-w-6xl"
      >
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate("/myevents")}
          className="mb-4 sm:mb-6 inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-sm sm:text-base
                     glass-dark border border-white/20 text-white hover:border-purple-400/50
                     transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Back to My Events</span>
          <span className="sm:hidden">Back</span>
        </motion.button>

        <div
          className="glass-dark rounded-2xl sm:rounded-3xl border-2 border-white/20
                       shadow-[0_20px_70px_rgba(168,85,247,0.3)] overflow-hidden"
        >
          {/* Gradient Accents */}
          <div className="absolute -top-24 -left-24 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 bg-pink-500/20 rounded-full blur-3xl" />

          <div className="relative p-6 sm:p-8 lg:p-12">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex-1"
              >
                <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 animate-pulse flex-shrink-0 mt-1" />
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold gradient-text break-words">
                    {event.title}
                  </h1>
                </div>
              </motion.div>

              {/* Delete Button (only if organizer) */}
              {isMine && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-white text-sm sm:text-base
                             bg-gradient-to-r from-red-500 to-pink-600
                             shadow-[0_0_30px_rgba(239,68,68,0.4)]
                             hover:brightness-110 transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">
                    {deleting ? "Deleting..." : "Delete Event"}
                  </span>
                  <span className="sm:hidden">
                    {deleting ? "Delete..." : "Delete"}
                  </span>
                </motion.button>
              )}
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
              {/* Left Column - Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-2 space-y-4 sm:space-y-6"
              >
                {/* Location */}
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl glass-dark border border-white/10">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-white/70 mb-1">
                      Location
                    </h3>
                    <p className="text-white text-sm sm:text-base md:text-lg break-words">
                      {event.location}
                    </p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl glass-dark border border-white/10">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-white/70 mb-1">
                      Date & Time
                    </h3>
                    <p className="text-white text-sm sm:text-base md:text-lg break-words">
                      {formattedDate}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 sm:p-6 rounded-xl glass-dark border border-white/10">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    About This Event
                  </h3>
                  <p className="text-white/85 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                    {event.description || "No description provided."}
                  </p>
                </div>
              </motion.div>

              {/* Right Column - Map */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="lg:col-span-1"
              >
                <div className="lg:sticky lg:top-32 p-4 sm:p-6 rounded-xl glass-dark border border-white/10">
                  <h4 className="text-center text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    Event Location
                  </h4>
                  {lat && lng ? (
                    <>
                      <iframe
                        title="Event Map"
                        width="100%"
                        height="250"
                        loading="lazy"
                        allowFullScreen
                        className="rounded-xl border border-white/10 mb-3 sm:mb-4 sm:h-[300px]"
                        src={`https://www.google.com/maps?q=${lat},${lng}&output=embed`}
                      />
                      <a
                        href={`https://www.google.com/maps?q=${lat},${lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-white
                                   bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600
                                   shadow-[0_0_30px_rgba(168,85,247,0.4)]
                                   hover:brightness-110 transition-all duration-300"
                      >
                        <MapPin className="w-4 h-4" />
                        Open in Google Maps
                      </a>
                    </>
                  ) : (
                    <p className="text-center text-white/70 py-8">
                      Map unavailable for this event
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
