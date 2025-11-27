import { motion } from "framer-motion";
import { Sparkles, Heart, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-transparent to-black/50 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold gradient-text">
                EventSpark
              </span>
            </div>
            <p className="text-white/60 text-sm">
              Lighting up your city life with unforgettable events and
              experiences.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-purple-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="hover:text-purple-400 transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/myevents"
                  className="hover:text-purple-400 transition-colors"
                >
                  My Events
                </Link>
              </li>
              <li>
                <Link
                  to="/ai-guide"
                  className="hover:text-purple-400 transition-colors"
                >
                  AI Guide
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              {[
                { Icon: Github, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Linkedin, href: "#" },
              ].map(({ Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full glass-dark border border-white/20
                             flex items-center justify-center text-white/60
                             hover:text-purple-400 hover:border-purple-400/50
                             transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 pt-8 border-t border-white/10 text-center"
        >
          <p className="text-white/60 text-sm flex items-center justify-center gap-2">
            © {new Date().getFullYear()} EventSpark. Made with
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            by developers who love events
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
