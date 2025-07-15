import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { motion } from "framer-motion";

export default function SignIn() {
  const { updateAuthData, authData, login } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleChange(e) {
    updateAuthData(e);
  }

  function handleLogin(e) {
    e.preventDefault();
    login();
    navigate("/events");
  }

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={handleLogin}
        className="p-8 rounded-2xl backdrop-blur-md border border-purple-500/40 shadow-xl bg-white/10 text-white space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-fuchsia-900 tracking-wide">
          Sign In to Your Account
        </h2>

        <div>
          <label className="block text-sm font-semibold text-fuchsia-900 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={authData.email}
            placeholder="you@example.com"
            className="w-full px-4 py-2 rounded-lg bg-zinc-800/80 text-white placeholder:text-zinc-400 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-fuchsia-900 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={authData.password}
            placeholder="••••••••"
            className="w-full px-4 py-2 rounded-lg bg-zinc-800/80 text-white placeholder:text-zinc-400 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 transition-colors text-white font-semibold shadow-md"
        >
          Sign In
        </button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-zinc-300">
            🚀 Still not a member of{" "}
            <span className="text-fuchsia-400 font-semibold tracking-wide">
              EventSpark
            </span>
            ?
          </p>
          <Link
            to="/signup"
            className="mt-2 inline-block px-5 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            ✨ Join the Party Now
          </Link>
        </motion.div>
      </form>
    </div>
  );
}
