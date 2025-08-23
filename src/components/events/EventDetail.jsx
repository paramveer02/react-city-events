import { useMemo, useState } from "react";
import { useLoaderData, useNavigate, redirect } from "react-router-dom";
import { motion } from "framer-motion";
import { RingLoader } from "react-spinners";
import { FaMapMarkerAlt, FaRegCalendarAlt, FaTrash } from "react-icons/fa";

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

  // background layers shared with the rest of the app
  const Bg = (
    <>
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-2.jpg')" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/45" />
    </>
  );

  if (!event) {
    return (
      <section
        className="relative min-h-[calc(100vh-var(--header-h))] flex items-center justify-center"
        style={{ paddingTop: "var(--header-h)" }}
      >
        {Bg}
        <div className="rounded-full p-6 shadow-[0_0_60px_#a855f766] animate-glow">
          <RingLoader color="#ffffff" size={240} />
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative min-h-[calc(100vh-var(--header-h))] px-6 pb-24"
      style={{ paddingTop: "var(--header-h)" }}
    >
      {Bg}

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto w-[min(96%,1000px)]"
      >
        <div className="relative rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="p-7 sm:p-9">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-300 to-indigo-300 drop-shadow-[0_2px_12px_rgba(199,108,255,0.4)]">
                {event.title}
              </h1>

              {/* Delete (only if organizer) */}
              {isMine && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white
                             bg-gradient-to-r from-rose-600 to-fuchsia-600
                             shadow-[0_10px_30px_rgba(244,63,94,0.35)]
                             hover:brightness-110 active:scale-[0.98] transition cursor-pointer"
                  title="Delete this event"
                >
                  <FaTrash />
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              )}
            </div>

            <div className="mt-4 grid gap-6 md:grid-cols-5">
              <div className="md:col-span-3 space-y-3">
                <div className="inline-flex items-center gap-3 text-white/90">
                  <FaMapMarkerAlt className="text-rose-300 text-lg" />
                  <span className="leading-tight">{event.location}</span>
                </div>
                <div className="inline-flex items-center gap-3 text-white/90">
                  <FaRegCalendarAlt className="text-sky-300 text-lg" />
                  <span className="leading-tight">{formattedDate}</span>
                </div>

                <p className="mt-5 text-white/85 leading-relaxed">
                  {event.description || "No description provided."}
                </p>
              </div>

              <div className="md:col-span-2">
                <div className="rounded-2xl border border-white/15 bg-black/40 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
                  <h4 className="text-center text-sm font-semibold text-white/90 mb-3">
                    📍 Event Location
                  </h4>
                  {lat && lng ? (
                    <>
                      <iframe
                        title="Event Map"
                        width="100%"
                        height="280"
                        loading="lazy"
                        allowFullScreen
                        className="rounded-xl border border-white/15"
                        src={`https://www.google.com/maps?q=${lat},${lng}&output=embed`}
                      />
                      <div className="mt-3 text-center">
                        <a
                          href={`https://www.google.com/maps?q=${lat},${lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold text-white
                                     bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500
                                     shadow-[0_10px_25px_rgba(99,102,241,0.35)]
                                     hover:brightness-110 active:scale-[0.98] transition"
                        >
                          Open in Google Maps ↗
                        </a>
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-white/80">
                      Map unavailable for this event.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <a
            href="/myevents"
            className="group relative inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold text-white
                       bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500
                       shadow-[0_10px_30px_rgba(99,102,241,0.35)]
                       hover:brightness-110 active:scale-[0.98] transition"
          >
            Back to My Events
          </a>
        </div>
      </motion.div>
    </section>
  );
}
