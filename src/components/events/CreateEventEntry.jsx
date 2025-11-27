import {
  Form,
  useActionData,
  useNavigation,
  redirect,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Calendar, MapPin, FileText, Sparkles, Plus } from "lucide-react";
import confetti from "canvas-confetti";

/* ---------------- ACTION ---------------- */
export async function createEventAction({ request }) {
  const form = await request.formData();
  const title = form.get("title")?.trim();
  const description = form.get("description")?.trim();
  const location = form.get("location")?.trim();
  const dateRaw = form.get("date");

  // convert <input type="datetime-local"> to ISO
  const dateISO = new Date(dateRaw).toISOString();

  const res = await fetch(
    "https://events-server-wnax.onrender.com/api/v1/events",
    {
      method: "POST",
      credentials: "include", // send auth cookie
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, date: dateISO, location }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { error: err.message || `Create failed (${res.status})` };
  }
  return redirect("/events?created=1");
}

/* -------------- COMPONENT --------------- */
export default function CreateEventEntry() {
  const nav = useNavigation();
  const submitting = nav.state === "submitting";
  const action = useActionData();

  // --- location autocomplete (Photon) ---
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (action?.error) toast.error(action.error);
  }, [action]);

  async function fetchSuggestions(q) {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
      q
    )}&limit=6&lang=en`;
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.features || []).map((f) => {
      const parts = [
        f.properties.street && f.properties.housenumber
          ? `${f.properties.street} ${f.properties.housenumber}`
          : f.properties.street || f.properties.name,
        f.properties.city,
        f.properties.state,
        f.properties.country,
      ].filter(Boolean);
      return {
        id: f.properties.osm_id ?? `${f.geometry.coordinates.join(",")}`,
        label: parts.join(", "),
      };
    });
  }

  function onChangeLocation(e) {
    const val = e.target.value;
    setQuery(val);
    setOpen(val.length >= 3);
    setHighlight(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length < 3) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const list = await fetchSuggestions(val);
        setSuggestions(list);
        setOpen(true);
      } catch {}
    }, 300);
  }

  function onKeyDown(e) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h <= 0 ? suggestions.length - 1 : h - 1));
    } else if (e.key === "Enter" && highlight >= 0) {
      e.preventDefault();
      setQuery(suggestions[highlight].label);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <section className="relative min-h-screen pb-24 pt-32 sm:pt-36 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-black to-pink-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
        }}
      />

      <div className="mx-auto w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-dark rounded-2xl sm:rounded-3xl border-2 border-white/20 p-6 sm:p-8 lg:p-12
                     shadow-[0_20px_70px_rgba(168,85,247,0.3)]"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8 sm:mb-10"
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 animate-pulse" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold gradient-text">
                Create New Event
              </h2>
              <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400" />
            </div>
            <p className="text-white/70 text-sm sm:text-base md:text-lg">
              Share your amazing event with the community
            </p>
          </motion.div>

          <Form method="post" className="space-y-5 sm:space-y-6 text-white">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Field
                label="Event Title"
                icon={<FileText className="w-5 h-5 text-purple-400" />}
              >
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., Summer Music Festival 2025"
                  className="w-full rounded-xl premium-input px-4 py-3 text-white
                           focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </Field>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Field
                label="Description"
                icon={<FileText className="w-5 h-5 text-pink-400" />}
              >
                <textarea
                  name="description"
                  required
                  rows={5}
                  placeholder="Tell everyone what makes your event special..."
                  className="w-full rounded-xl premium-input px-4 py-3 text-white
                           focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                />
              </Field>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Field
                label="Location"
                icon={<MapPin className="w-5 h-5 text-blue-400" />}
              >
                <div className="relative">
                  <input
                    type="text"
                    name="location"
                    value={query}
                    onChange={onChangeLocation}
                    onKeyDown={onKeyDown}
                    autoComplete="off"
                    required
                    placeholder="Start typing an address..."
                    className="w-full rounded-xl premium-input px-4 py-3 text-white
                             focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  />
                  {open && suggestions.length > 0 && (
                    <ul
                      className="absolute z-50 mt-2 max-h-56 w-full overflow-y-auto rounded-xl
                                   glass-dark border border-white/20 shadow-2xl"
                    >
                      {suggestions.map((s, i) => (
                        <li
                          key={s.id ?? i}
                          onMouseDown={() => {
                            setQuery(s.label);
                            setOpen(false);
                          }}
                          className={`px-4 py-3 cursor-pointer transition-colors ${
                            i === highlight
                              ? "bg-purple-500/30"
                              : "hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-purple-400" />
                            <span className="text-sm">{s.label}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Field>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Field
                label="Date & Time"
                icon={<Calendar className="w-5 h-5 text-green-400" />}
              >
                <div className="relative">
                  <input
                    type="datetime-local"
                    name="date"
                    required
                    className="w-full rounded-xl premium-input px-4 py-3 pr-12 text-white
                             focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all
                             [color-scheme:dark]"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400 pointer-events-none" />
                </div>
              </Field>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <button
                type="submit"
                disabled={submitting}
                className="relative w-full px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-white text-base sm:text-lg
                           bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600
                           bg-[length:200%_100%] hover:bg-right
                           shadow-[0_0_40px_rgba(168,85,247,0.5)]
                           transition-all duration-500 overflow-hidden group
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {submitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span className="text-sm sm:text-base">Creating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                      Create Event
                    </>
                  )}
                </span>
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                                -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                />
              </button>
            </motion.div>
          </Form>
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, icon, children }) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs sm:text-sm font-semibold text-white/90">
          {label}
        </span>
      </div>
      {children}
    </label>
  );
}
