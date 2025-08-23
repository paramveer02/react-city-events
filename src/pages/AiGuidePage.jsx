// src/pages/AIGuidePage.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CityGuidePanel from "../components/CityGuidePanel";

async function fetchGuideByCity(city) {
  const res = await fetch(" http://localhost:8000/api/ai/city-guide", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ city }),
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
    <section
      className="relative min-h-[calc(100svh-var(--header-h))] pb-24 text-white"
      style={{ paddingTop: "var(--header-h)" }}
    >
      {/* Full-page starry background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=2000&auto=format&fit=crop')",
        }}
        aria-hidden
      />

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
            {/* Parallax-ish header: subtle scale on scroll */}
            <motion.header
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] p-6 md:p-8 mt-4"
            >
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-2xl md:text-3xl font-extrabold mb-2"
              >
                Welcome to {guide.city}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="opacity-95 max-w-3xl"
              >
                {guide.summary}
              </motion.p>
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
