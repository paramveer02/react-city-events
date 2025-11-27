// src/components/Hero.jsx
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import LocalAIGuideCTA from "./LocalAIGuideCTA";

export default function Hero() {
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // 3D tilt
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useTransform(rx, [-50, 50], [6, -6]);
  const rotateY = useTransform(ry, [-50, 50], [-6, 6]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [showCityPrompt, setShowCityPrompt] = useState(false);
  const [manualCity, setManualCity] = useState("");

  async function requestCityGuide() {
    setShowCityPrompt(false);

    if (!("geolocation" in navigator)) {
      setShowCityPrompt(true);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          // fetch here then navigate with state (fast)
          const res = await fetch(
            "https://events-server-wnax.onrender.com/api/ai/city-guide",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
              }),
            }
          );
          const json = await res.json();
          if (!res.ok)
            throw new Error(json?.message || "Failed to fetch guide");
          navigate("/ai-guide", { state: { guide: json.data } });
        } catch {
          //(fallback): navigate with coords query and let AI page fetch if you add that later
          setShowCityPrompt(true);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setShowCityPrompt(true);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }

  function handleManualSubmit(e) {
    e.preventDefault();
    const city = manualCity.trim();
    if (!city) return;
    // Let AIGuidePage fetch using the query param
    navigate(`/ai-guide?city=${encodeURIComponent(city)}`);
  }

  return (
    <>
      <section className="relative flex items-center justify-center min-h-screen bg-cover bg-center text-center">
        {/* backdrop */}
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg-4.jpg')" }}
          aria-hidden
        />
        <div className="fixed inset-0 -z-10 bg-black/40" aria-hidden />

        <motion.div
          style={{ rotateX, rotateY }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            ry.set(((e.clientX - r.left) / r.width) * 100 - 50);
            rx.set(((e.clientY - r.top) / r.height) * 100 - 50);
          }}
          onMouseLeave={() => {
            rx.set(0);
            ry.set(0);
          }}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-[min(92%,36rem)]
                     rounded-2xl border border-white/25
                     bg-white/12 backdrop-blur-xl
                     shadow-[0_25px_80px_rgba(0,0,0,0.35)]
                     px-6 sm:px-8 py-8 sm:py-10 text-center text-white"
        >
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white/95">
            🎟️ Events • 🎧 Music • 🎭 Culture • 👩‍💻 Tech
          </div>

          <h1 className="mb-4 text-[clamp(28px,4.2vw,42px)] font-extrabold leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
            Discover Events That{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-rose-300 bg-clip-text text-transparent">
              Spark Your Passion
            </span>
          </h1>

          <p className="mx-auto mb-6 max-w-xl text-[clamp(14px,2.2vw,18px)] text-white/90">
            From workshops to concerts — explore, create, and join memorable
            moments around you.
          </p>

          {/* CTA row */}
          <div className="flex flex-col items-center justify-center gap-3">
            <LocalAIGuideCTA onClick={requestCityGuide} disabled={loading} />

            <div className="flex items-center justify-center gap-3">
              <Link
                to="/events"
                className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white
                           bg-gradient-to-r from-fuchsia-900 via-pink-300 to-indigo-900
                           shadow-[0_10px_30px_rgba(99,102,241,0.35)]
                           hover:brightness-110 active:scale-[0.98] transition
                           btn-pulse"
              >
                <span className="relative z-10">Events Near me</span>
                <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/20" />
                <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                  <span className="btn-sheen" />
                </span>
              </Link>

              {isAuth && (
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
              )}
            </div>

            {/* Friendly manual-city prompt (only when needed) */}
            {showCityPrompt && (
              <div className="mt-4 w-full max-w-md rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-4 text-left">
                <p className="text-sm md:text-base text-white/95 mb-3">
                  We couldn’t get your coordinates. Tell us a city you’d love to
                  explore ✨
                </p>
                <form
                  onSubmit={handleManualSubmit}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    placeholder="e.g., Delhi"
                    className="w-full rounded-xl px-3 py-2 text-sm text-zinc-900"
                  />
                  <button
                    type="submit"
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500"
                  >
                    Explore
                  </button>
                </form>
              </div>
            )}

            {loading && (
              <p className="text-sm opacity-90">Summoning your AI guide…</p>
            )}
          </div>
        </motion.div>
      </section>
    </>
  );
}
