import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Sparkles, Calendar, MapPin, Zap, ArrowRight } from "lucide-react";
import { TypeAnimation } from "react-type-animation";

export default function Hero() {
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
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
    navigate(`/ai-guide?city=${encodeURIComponent(city)}`);
  }

  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-pink-900" />
        <div className="absolute inset-0 bg-[url('/bg-2.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-dark border border-white/20
                       shadow-[0_0_30px_rgba(168,85,247,0.3)]"
          >
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-white/90 font-semibold">
              Discover Events Like Never Before
            </span>
          </motion.div>

          {/* Main Heading with Typing Animation */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight"
          >
            <span className="block">Experience the</span>
            <span className="block gradient-text">
              <TypeAnimation
                sequence={[
                  "Magic",
                  2000,
                  "Energy",
                  2000,
                  "Excitement",
                  2000,
                  "Vibe",
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </span>
            <span className="block">of Live Events</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed"
          >
            Your ultimate destination for discovering, creating, and
            experiencing unforgettable events in your city
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          >
            {isAuth ? (
              <>
                <Link to="/events">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative px-8 py-4 rounded-xl font-bold text-white text-lg
                               bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600
                               bg-[length:200%_100%] hover:bg-right
                               shadow-[0_0_40px_rgba(168,85,247,0.5)]
                               transition-all duration-500 overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Explore Events
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                                    -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    />
                  </motion.button>
                </Link>
                <motion.button
                  onClick={requestCityGuide}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 py-4 rounded-xl font-bold text-white text-lg
                             border-2 border-white/30 glass-dark
                             hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]
                             transition-all duration-300 group"
                >
                  <span className="flex items-center gap-2">
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Locating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        AI City Guide
                      </>
                    )}
                  </span>
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative px-8 py-4 rounded-xl font-bold text-white text-lg
                               bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600
                               bg-[length:200%_100%] hover:bg-right
                               shadow-[0_0_40px_rgba(168,85,247,0.5)]
                               transition-all duration-500 overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Get Started Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                                    -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    />
                  </motion.button>
                </Link>
                <Link to="/events">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-xl font-bold text-white text-lg
                               border-2 border-white/30 glass-dark
                               hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]
                               transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Browse Events
                    </span>
                  </motion.button>
                </Link>
              </>
            )}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto"
          >
            {[
              {
                icon: Calendar,
                title: "Discover Events",
                desc: "Find amazing events happening near you",
              },
              {
                icon: Sparkles,
                title: "Create Events",
                desc: "Share your events with the community",
              },
              {
                icon: MapPin,
                title: "Local Insights",
                desc: "AI-powered city guides and recommendations",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.2 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl glass-dark border border-white/20 hover:border-purple-400/50
                           shadow-lg hover:shadow-[0_20px_60px_rgba(168,85,247,0.2)]
                           transition-all duration-300"
              >
                <feature.icon className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* City Prompt Modal */}
      {showCityPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowCityPrompt(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative p-8 rounded-3xl glass-dark border-2 border-white/20
                       shadow-[0_40px_100px_rgba(168,85,247,0.3)] max-w-md mx-4"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Enter Your City
            </h3>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <input
                type="text"
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                placeholder="e.g., New York"
                className="w-full px-4 py-3 rounded-xl premium-input text-white
                           focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold text-white
                             bg-gradient-to-r from-purple-600 to-pink-500
                             hover:brightness-110 transition-all"
                >
                  Get Guide
                </button>
                <button
                  type="button"
                  onClick={() => setShowCityPrompt(false)}
                  className="px-6 py-3 rounded-xl font-semibold text-white/80
                             border border-white/20 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
