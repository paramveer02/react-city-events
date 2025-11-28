import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CityGuidePanel from "../components/CityGuidePanel";
import { API_BASE } from "../utils/api";

async function fetchGuideByCity(city) {
  const qs = new URLSearchParams({ city });
  const res = await fetch(`${API_BASE}/api/ai/city-guide?${qs}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Failed to fetch guide");
  return json.data;
}

export default function AIGuidePage() {
  const { state } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();

  const [guide, setGuide] = useState(state?.guide || null);
  const [loading, setLoading] = useState(!state?.guide);
  const [error, setError] = useState("");

  const cityParam = useMemo(() => {
    const u = new URLSearchParams(location.search);
    return u.get("city")?.trim();
  }, [location.search]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (guide) return;
      if (!cityParam) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchGuideByCity(cityParam);
        if (!ignore) setGuide(data);
      } catch (e) {
        if (!ignore) setError(e.message || "Something went wrong.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [cityParam, guide]);

  return (
    <section className="relative min-h-screen pb-24 pt-32 sm:pt-36 px-4 sm:px-6 lg:px-8 text-white">
      {/* Soft aurora veil so the global video shows through */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-purple-900/40" />
        <motion.div
          aria-hidden
          className="absolute -left-24 top-10 w-80 h-80 bg-pink-500/15 blur-3xl rounded-full"
          animate={{ y: [0, 30, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute right-0 bottom-0 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full"
          animate={{ y: [0, -25, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto w-[min(96%,1100px)]">
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] p-8 mt-4"
          >
            <p className="opacity-95">Summoning your AI city guide…</p>
          </motion.div>
        )}

        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] p-8 mt-4"
          >
            <p className="mb-4">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-white font-semibold shadow-lg"
            >
              Back Home
            </button>
          </motion.div>
        )}

        {!loading && !error && guide && (
          <>
            {/* Hero card */}
            <motion.header
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] p-6 md:p-8 mt-4"
            >
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.2),transparent_45%)]" />
              <div className="relative flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-amber-400/70 to-pink-500/70 text-black shadow-lg">
                    AI Travel Passport
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-white border border-white/15">
                    {guide.city}
                  </span>
                </div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="text-3xl md:text-4xl font-extrabold tracking-tight"
                >
                  Welcome to {guide.city}! ✈️
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="opacity-95 max-w-3xl text-lg leading-relaxed"
                >
                  {guide.summary}
                </motion.p>
              </div>
            </motion.header>

            {/* Sections with staggered cards + hover lift */}
            <div className="mt-6">
              <CityGuidePanel data={guide} variant="page" />
            </div>
          </>
        )}

        {!loading && !guide && !cityParam && !error && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] p-8 mt-4"
          >
            <p className="mb-4 opacity-95">
              No city provided. Start from the homepage or add{" "}
              <code>?city=Paris</code> to the URL.
            </p>
            <button
              onClick={() => navigate("/")}
              className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-white font-semibold shadow-lg"
            >
              Back Home
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
