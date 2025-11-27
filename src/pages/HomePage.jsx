import Hero from "../components/Hero";
import Galaxy from "../components/effects/Galaxy";

export default function HomePage() {
  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <Galaxy density={1.5} glowIntensity={0.4} mouseRepulsion={true} />
      <Hero />
    </div>
  );
}
