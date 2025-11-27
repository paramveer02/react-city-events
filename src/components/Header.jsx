import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, LogOut, User, Menu, X, Home, Calendar } from "lucide-react";

const baseLink =
  "relative px-5 py-2.5 text-sm font-semibold text-white/90 hover:text-white transition-all duration-300 group overflow-hidden rounded-lg";
const active =
  "text-white bg-gradient-to-r from-purple-500/30 to-pink-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]";

export default function Header() {
  const { logout, isAuth, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/signin");
    setMobileMenuOpen(false);
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="pointer-events-none fixed top-0 left-0 z-50 flex w-full justify-center pt-2 sm:pt-4 px-2 sm:px-0"
    >
      <motion.nav
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="relative pointer-events-auto w-full max-w-7xl px-3 sm:px-6 md:px-8 py-3 sm:py-4 rounded-2xl sm:rounded-3xl glass-dark
                   border border-white/20 sm:border-2 sm:border-white/30 shadow-[0_20px_70px_rgba(168,85,247,0.3)]
                   flex items-center justify-between backdrop-blur-2xl"
      >
        {/* Animated Glow Background */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-2xl opacity-60 animate-pulse" />

        {/* Logo */}
        <Link to="/" className="shrink-0 relative z-10 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </motion.div>
            <span className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight gradient-text">
              EventSpark
            </span>
          </motion.div>
        </Link>

        {/* Centered greeting */}
        {isAuth && user?.name && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="hidden lg:block absolute left-1/2 -translate-x-1/2"
          >
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-white
                            bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/20
                            backdrop-blur-md shadow-lg"
            >
              <User className="w-4 h-4" />
              <span>Hello,</span>
              <span className="font-bold gradient-text">{user.name}</span>
            </div>
          </motion.div>
        )}

        {/* Navigation Links */}
        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-2 relative z-10">
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? active : ""}`
              }
            >
              Home
            </NavLink>
          </motion.li>
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <NavLink
              to="/myevents"
              className={({ isActive }) =>
                `${baseLink} ${isActive ? active : ""}`
              }
            >
              My Events
            </NavLink>
          </motion.li>

          {!isAuth && (
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `${baseLink} ${isActive ? active : ""}`
                }
              >
                Sign Up
              </NavLink>
            </motion.li>
          )}

          <motion.li
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-3"
          >
            {isAuth ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white
                           bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700
                           shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <NavLink
                to="/signin"
                className="relative inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold text-white
                           bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600
                           bg-[length:200%_100%] hover:bg-right
                           shadow-[0_0_30px_rgba(168,85,247,0.4)]
                           transition-all duration-500 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Sign In
                </span>
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                                -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                />
              </NavLink>
            )}
          </motion.li>
        </ul>

        {/* Mobile/Tablet Hamburger Menu Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden relative z-10 p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </motion.button>
      </motion.nav>

      {/* Mobile/Tablet Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden pointer-events-auto"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-gradient-to-b from-purple-900/95 via-black/95 to-pink-900/95 
                         backdrop-blur-xl border-l-2 border-white/20 shadow-[-20px_0_70px_rgba(168,85,247,0.3)] z-50 md:hidden
                         overflow-y-auto pointer-events-auto"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                    <span className="text-xl font-bold gradient-text">
                      Menu
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* User Greeting */}
                {isAuth && user?.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/20"
                  >
                    <div className="flex items-center gap-2 text-white">
                      <User className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-xs text-white/70">Welcome back,</p>
                        <p className="font-bold gradient-text">{user.name}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Links */}
                <nav className="space-y-2">
                  <NavLink
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-white font-semibold transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                          : "hover:bg-white/10"
                      }`
                    }
                  >
                    <Home className="w-5 h-5" />
                    Home
                  </NavLink>

                  <NavLink
                    to="/myevents"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-white font-semibold transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                          : "hover:bg-white/10"
                      }`
                    }
                  >
                    <Calendar className="w-5 h-5" />
                    My Events
                  </NavLink>

                  {!isAuth && (
                    <NavLink
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-white font-semibold transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                            : "hover:bg-white/10"
                        }`
                      }
                    >
                      <Sparkles className="w-5 h-5" />
                      Sign Up
                    </NavLink>
                  )}
                </nav>

                {/* Auth Buttons */}
                <div className="mt-8 space-y-3">
                  {isAuth ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-white
                                 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700
                                 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-300"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  ) : (
                    <Link
                      to="/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-white
                                 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600
                                 shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:brightness-110
                                 transition-all duration-300"
                    >
                      <Sparkles className="w-5 h-5" />
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
