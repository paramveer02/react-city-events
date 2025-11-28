import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const err = useRouteError();
  const message =
    err?.statusText ||
    err?.message ||
    "Something went wrong. Please try again.";

  return (
    <section className="min-h-screen flex items-center justify-center px-4 text-white">
      <div className="max-w-lg w-full rounded-3xl glass-dark border border-white/20 p-8 text-center space-y-4">
        <h1 className="text-3xl font-extrabold gradient-text">Oops!</h1>
        <p className="text-white/80">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
          >
            Back Home
          </Link>
          <Link
            to="/events"
            className="px-5 py-3 rounded-xl font-semibold text-white border border-white/30 glass-dark hover:border-purple-400/50 transition"
          >
            Browse Events
          </Link>
        </div>
      </div>
    </section>
  );
}
