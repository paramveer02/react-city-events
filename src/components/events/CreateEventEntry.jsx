// src/pages/CreateEventEntry.jsx
import { Form, useActionData, useNavigation, redirect } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

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
    <section
      className="relative min-h-[calc(100vh-var(--header-h))] pb-24"
      style={{ paddingTop: "var(--header-h)" }}
    >
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-2.jpg')" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/45" />

      <div className="mx-auto w-[min(96%,900px)]">
        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] p-6 sm:p-8">
          <h2 className="mb-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400">
            ✨ Create a New Event ✨
          </h2>

          <Form method="post" className="space-y-5 text-white">
            <Field label="Title">
              <input
                type="text"
                name="title"
                required
                placeholder="Enter event title"
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 placeholder-white/60 outline-none focus:ring-2 focus:ring-fuchsia-400/60"
              />
            </Field>

            <Field label="Description">
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Describe your event..."
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 placeholder-white/60 outline-none focus:ring-2 focus:ring-fuchsia-400/60"
              />
            </Field>

            <Field label="Location">
              <div className="relative">
                <input
                  type="text"
                  name="location"
                  value={query}
                  onChange={onChangeLocation}
                  onKeyDown={onKeyDown}
                  autoComplete="off"
                  required
                  placeholder="Start typing an address…"
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 placeholder-white/60 outline-none focus:ring-2 focus:ring-fuchsia-400/60"
                />
                {open && suggestions.length > 0 && (
                  <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-white/20 bg-black/80 shadow-xl">
                    {suggestions.map((s, i) => (
                      <li
                        key={s.id ?? i}
                        onMouseDown={() => {
                          setQuery(s.label);
                          setOpen(false);
                        }}
                        className={`px-4 py-2 cursor-pointer ${
                          i === highlight
                            ? "bg-fuchsia-500/30"
                            : "hover:bg-white/10"
                        }`}
                      >
                        {s.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Field>

            <Field label="Date & Time">
              <input
                type="datetime-local"
                name="date"
                required
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-fuchsia-400/60"
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="group relative inline-flex w-full items-center justify-center rounded-xl px-4 py-3 font-semibold text-white
                         bg-gradient-to-r from-fuchsia-900 via-pink-300 to-indigo-900
                         shadow-[0_10px_30px_rgba(99,102,241,0.35)]
                         hover:brightness-110 active:scale-[0.98] transition"
            >
              {submitting ? "Creating…" : "🚀 Create Event"}
            </button>
          </Form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-white/90">
        {label}
      </span>
      {children}
    </label>
  );
}
