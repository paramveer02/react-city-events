// src/components/CityGuidePanel.jsx
import { motion } from "framer-motion";
import { Landmark, Martini, Trees, ShoppingBag } from "lucide-react";

const SECTION_THEMES = {
  "History & Monuments":
    "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop')",
  "Clubs & Bars":
    "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1400&auto=format&fit=crop')",
  "Parks & Nature":
    "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop')",
  Shopping:
    "url('https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=1400&auto=format&fit=crop')", // new lively shopping bg
};

const container = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const card = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function CityGuidePanel({ data, variant = "card" }) {
  if (!data) return null;
  const { sections } = data;

  const icons = {
    "History & Monuments": <Landmark className="w-5 h-5 text-amber-300" />,
    "Clubs & Bars": <Martini className="w-5 h-5 text-pink-200" />,
    "Parks & Nature": <Trees className="w-5 h-5 text-emerald-200" />,
    Shopping: <ShoppingBag className="w-5 h-5 text-cyan-200" />,
  };

  const Section = ({ title, items }) => (
    <motion.div
      variants={card}
      whileHover={{ y: -3, scale: 1.01 }}
      className="relative rounded-2xl overflow-hidden border border-white/20 backdrop-blur-xl shadow-lg"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.85)),
          ${SECTION_THEMES[title] || "linear-gradient(#111,#222)"}
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* neon ring glow on hover */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-fuchsia-400/40 transition" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/30" />

      <div className="relative p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 backdrop-blur text-white ring-1 ring-white/15">
            {icons[title]}
          </div>
          <h3 className="text-xl font-extrabold tracking-wide text-white drop-shadow-lg">
            {title}
          </h3>
        </div>
        <ul className="space-y-3">
          {items?.map((it, idx) => (
            <motion.li
              key={idx}
              whileHover={{ scale: 1.02, translateY: -1 }}
              className="relative overflow-hidden rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur-md hover:bg-white/15 transition"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 hover:opacity-100 transition duration-300" />
              <p className="font-semibold text-white/95">{it.name}</p>
              {it.neighborhood && (
                <p className="text-sm text-white/80">{it.neighborhood}</p>
              )}
              <p className="text-sm text-white/90 font-light leading-relaxed">
                {it.why}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid md:grid-cols-2 xl:grid-cols-4 gap-6"
    >
      <Section title="History & Monuments" items={sections?.historyMonuments} />
      <Section title="Clubs & Bars" items={sections?.clubsBars} />
      <Section title="Parks & Nature" items={sections?.parksNature} />
      <Section title="Shopping" items={sections?.shopping} />
    </motion.div>
  );
}
