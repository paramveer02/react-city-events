// src/components/CityGuidePanel.jsx
import { motion } from "framer-motion";

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

      <div className="relative p-5">
        <h3 className="text-xl font-extrabold mb-3 tracking-wide text-white drop-shadow-lg">
          {title}
        </h3>
        <ul className="space-y-3">
          {items?.map((it, idx) => (
            <motion.li
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur-md hover:bg-white/15 transition"
            >
              <p className="font-semibold text-white/95">{it.name}</p>
              {it.neighborhood && (
                <p className="text-sm text-white/80">{it.neighborhood}</p>
              )}
              <p className="text-sm text-white/90 font-light">{it.why}</p>
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
