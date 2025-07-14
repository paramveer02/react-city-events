import { Link } from "react-router";

export default function Hero() {
  return (
    <section className="w-full h-[90vh] flex items-center justify-center">
      <div
        className="relative z-10 max-w-2xl w-full bg-white/10 dark:bg-gray-900/30 
  backdrop-blur-md rounded-xl px-6 py-8 text-center text-white shadow-lg"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow text-shadow-indigo-500">
          Discover Events That Spark Your Passion
        </h1>
        <p className="text-lg md:text-xl mb-6 opacity-90">
          From workshops to concerts — explore, create, and join memorable
          moments around you.
        </p>
        <Link
          to="/events"
          className="inline-block bg-indigo-400 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300"
        >
          Upcoming Events
        </Link>
      </div>
    </section>
  );
}
