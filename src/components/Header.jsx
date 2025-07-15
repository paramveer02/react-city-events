import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Header() {
  const { logout, isAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/signin");
  }

  return (
    <header className="fixed top-4 left-0 w-full z-50 flex justify-center">
      <nav
        className="max-w-6xl w-full mx-auto px-6 py-3
        bg-white/80 dark:bg-gray-900/80
        backdrop-blur-md rounded-2xl shadow-md flex items-center justify-between"
      >
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600 dark:text-indigo-300"
        >
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-2xl md:text-2xl font-extrabold text-center mb-2 
             text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 
             drop-shadow-[0_2px_12px_rgba(199,108,255,0.8)] tracking-wide"
          >
            ✨ EventSpark ✨
          </motion.h3>
        </Link>

        {/* LINKS */}
        <ul className="flex space-x-6 text-sm font-medium text-gray-700 dark:text-gray-500">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "underline" : "")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/events"
              className={({ isActive }) => (isActive ? "underline" : "")}
            >
              Events
            </NavLink>
          </li>
          {!isAuth && (
            <li>
              <NavLink
                to="/signup"
                className={({ isActive }) => (isActive ? "underline" : "")}
              >
                Sign Up
              </NavLink>
            </li>
          )}
          <li>
            {isAuth ? (
              <button
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 font-semibold"
              >
                Sign Out
              </button>
            ) : (
              <NavLink
                to="/signin"
                className={({ isActive }) => (isActive ? "underline" : "")}
              >
                Sign In
              </NavLink>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
