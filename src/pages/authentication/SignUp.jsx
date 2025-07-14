import { useState } from "react";
import getJSON from "../../utils/api";
import { sleep } from "../../utils/helper";
import { useNavigate } from "react-router";
import Typewriter from "typewriter-effect";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router";
import { motion } from "framer-motion";

export default function SignUp() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { authData, updateAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleChange(e) {
    updateAuthData(e);
  }

  async function handleSignUp(e) {
    e.preventDefault();

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = [...existingUsers, authData];

    const userExists = existingUsers.find(
      (user) => user.email.toLowerCase() === authData.email.toLowerCase()
    );

    if (userExists) {
      alert("user exists already");
      return;
    }

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData),
    };

    await getJSON(`http://localhost:3001/api/users`, options);

    setIsSubmitted(true);
    await sleep(6000);
    navigate("/signin");
  }

  return (
    <div className="w-full max-w-md">
      {isSubmitted ? (
        <div className="text-center font-black text-5xl sm:text-6xl md:text-7xl text-fuchsia-500 drop-shadow-[0_2px_6px_rgba(255,0,255,0.8)] tracking-wide leading-snug">
          <Typewriter
            options={{
              strings: ["You're almost in!", "To Explore..."],
              autoStart: true,
              loop: false,
              delay: 50,
              deleteSpeed: 20,
            }}
          />
        </div>
      ) : (
        <form
          onSubmit={handleSignUp}
          className="p-8 rounded-2xl shadow-2xl w-full max-w-md border border-purple-700 bg-white/5 backdrop-blur-md"
        >
          <h2 className="text-3xl font-extrabold text-center mb-6 text-black tracking-wide">
            Create Your Account
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-black font-extrabold mb-1">
                Email
              </label>
              <input
                type="text"
                name="email"
                placeholder="you@example.com"
                value={authData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-black font-extrabold mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={authData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors"
            >
              Sign Up
            </button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-zinc-300">
              🚀 Already a member of{" "}
              <span className="text-fuchsia-400 font-semibold tracking-wide">
                EventSpark
              </span>
              ?
            </p>
            <Link
              to="/signin"
              className="mt-2 inline-block px-5 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            >
              ✨ Sign in Now & Explore Events
            </Link>
          </motion.div>
        </form>
      )}
    </div>
  );
}
