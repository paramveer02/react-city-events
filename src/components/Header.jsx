// src/components/Header.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const baseLink =
  "relative px-3 py-2 text-sm font-medium text-white/90 hover:text-white transition";
const active =
  "after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-[2px] after:w-6 after:rounded-full after:bg-white/70";

export default function Header() {
  const { logout, isAuth, user } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/signin");
  }

  return (
    <header className="pointer-events-none fixed top-4 left-0 z-50 flex w-full justify-center">
      <nav className="relative pointer-events-auto w-[94%] max-w-6xl px-4 sm:px-6 py-3 rounded-2xl border border-white/20 bg-gradient-to-r from-black/35 via-black/25 to-black/35 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] flex items-center justify-between">
        <Link to="/" className="shrink-0">
          <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 via-pink-300 to-indigo-300 drop-shadow-[0_1px_8px_rgba(255,255,255,0.35)] cursor-pointer">
            ✨ EventSpark ✨
          </span>
        </Link>

        {/* Centered greeting */}
        {isAuth && user?.name && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <span className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-white/95 bg-white/10 border border-white/15 backdrop-blur-md bg-gradient-to-r from-rose-500 to-fuchsia-500 cursor-pointer hover:brightness-110 active:scale-[0.98] transition">
              Hello,<span className="font-bold">{user.name}</span>
            </span>
          </div>
        )}

        <ul className="flex items-center gap-1 sm:gap-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? active : ""}`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/myevents"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? active : ""}`
              }
            >
              My Events
            </NavLink>
          </li>

          {!isAuth && (
            <li className="hidden sm:block">
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? active : ""}`
                }
              >
                Sign Up
              </NavLink>
            </li>
          )}

          <li className="ml-1 sm:ml-3">
            {isAuth ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-sm bg-gradient-to-r from-rose-500 to-fuchsia-900 cursor-pointer hover:brightness-110 active:scale-[0.98] transition"
              >
                Sign Out
              </button>
            ) : (
              <NavLink
                to="/signin"
                className="inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-fuchsia-900 via-pink-300 to-indigo-900 hover:from-pink-500 hover:to-purple-500 shadow-md transition cursor-pointer animate-pulse"
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
