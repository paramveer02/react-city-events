import {
  Form,
  useActionData,
  useNavigation,
  redirect,
  Link,
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";

export async function signinAction({ request }) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  const res = await fetch(
    "https://events-server-wnax.onrender.com/api/v1/auth/login",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { error: err.message || "Login failed" };
  }

  // mark authenticated locally so header flips immediately
  localStorage.setItem("auth", "1");
  window.dispatchEvent(new Event("authchange"));

  return redirect("/?signedin=1");
}

export default function SignIn() {
  const action = useActionData();
  const nav = useNavigation();
  const containerRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  // 3D Tilt Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  useEffect(() => {
    if (action?.error) toast.error(action.error);
  }, [action]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-pink-900 animate-gradient-shift" />
        <div className="absolute inset-0 bg-[url('/bg-2.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
        className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-md mx-4"
      >
        <Form
          method="post"
          className="relative p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl text-white glass-dark
                     shadow-[0_40px_100px_rgba(168,85,247,0.3)]
                     border-2 border-white/20 space-y-6 group"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-2 relative z-10"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>
            <h2 className="text-4xl font-extrabold gradient-text">
              Welcome Back
            </h2>
            <p className="text-white/60 text-sm">
              Sign in to continue your journey with EventSpark
            </p>
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative z-10"
          >
            <PremiumField
              label="Email Address"
              icon={<Mail className="w-5 h-5" />}
            >
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 pl-12 rounded-xl premium-input text-white
                           focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </PremiumField>
          </motion.div>

          {/* Demo Account Notice */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="relative z-10 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/20"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-300 font-semibold mb-1">
                  Try Demo Account
                </p>
                <p className="text-white/70 text-xs leading-relaxed">
                  <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded">
                    demo@eventspark.com
                  </span>
                  {" / "}
                  <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded">
                    Demo123!
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative z-10"
          >
            <PremiumField label="Password" icon={<Lock className="w-5 h-5" />}>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pl-12 pr-12 rounded-xl premium-input text-white
                             focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </PremiumField>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={nav.state === "submitting"}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative w-full py-4 rounded-xl font-bold text-white text-lg
                       bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600
                       bg-[length:200%_100%] hover:bg-right
                       shadow-[0_10px_40px_rgba(168,85,247,0.5)]
                       transition-all duration-500 overflow-hidden group/btn z-10"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {nav.state === "submitting" ? (
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
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          </motion.button>

          {/* Divider */}
          <div className="relative flex items-center gap-4 text-white/40 text-sm z-10">
            <div className="flex-1 h-px bg-white/10" />
            <span>New to EventSpark?</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center relative z-10"
          >
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                         font-semibold text-white border-2 border-white/20
                         hover:border-purple-500/50 hover:bg-white/5
                         transition-all duration-300 group/link"
            >
              <Sparkles className="w-4 h-4 group-hover/link:animate-spin" />
              Create Account
            </Link>
          </motion.div>
        </Form>

        {/* Decorative Elements */}
        <motion.div
          className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </section>
  );
}

function PremiumField({ label, icon, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-white/90 flex items-center gap-2">
        {icon}
        {label}
      </span>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
            {icon}
          </div>
        )}
        {children}
      </div>
    </label>
  );
}
