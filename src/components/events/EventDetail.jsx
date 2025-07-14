import { useEffect, useState } from "react";
import { useParams } from "react-router";
import getJSON from "../../utils/api";
import { RingLoader } from "react-spinners";
import { sleep } from "../../utils/helper";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router";

export default function EventDetail() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuth } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvent = async function () {
      setIsLoading(true);
      await sleep(1000);

      try {
        const event = await getJSON(`http://localhost:3001/api/events/${id}`);

        setEvent(event);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formattedDate = event
    ? new Date(event.date).toLocaleString("en-US", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "";

  return (
    <>
      {isAuth ? (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat px-6 flex justify-center items-center">
          {isLoading ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="rounded-full p-6 shadow-[0_0_60px_#a855f766] animate-glow">
                <RingLoader color="#000000" size={300} />
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-black/60 backdrop-blur-lg p-10 rounded-xl shadow-2xl max-w-3xl w-full text-white border border-purple-500/20"
            >
              <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-400">
                {event.title}
              </h1>
              <p className="flex items-center mb-4 text-lg text-gray-300">
                <FaMapMarkerAlt className="mr-3 text-rose-400 text-xl" />
                {event.location}
              </p>
              <p className="flex items-center mb-6 text-lg text-gray-300">
                <FaRegCalendarAlt className="mr-3 text-sky-400 text-xl" />
                {formattedDate}
              </p>
              <p className="text-gray-200 leading-relaxed text-md">
                {event.description || "No description provided."}
              </p>
              {event.latitude && event.longitude && (
                <div className="mt-10 flex justify-center">
                  <div className="w-full max-w-2xl bg-gradient-to-br from-fuchsia-300 to-purple-700 p-4 rounded-2xl shadow-2xl">
                    <h3 className="text-white text-lg font-semibold mb-3 text-center">
                      📍 Event Location Map
                    </h3>

                    <iframe
                      title="Event Map"
                      width="100%"
                      height="300"
                      loading="lazy"
                      allowFullScreen
                      className="rounded-xl border-4 border-fuchsia-300 shadow-lg"
                      src={`https://www.google.com/maps?q=${event.latitude},${event.longitude}&output=embed`}
                    ></iframe>

                    <div className="text-center mt-4">
                      <a
                        href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block px-5 py-2 bg-white text-fuchsia-700 hover:bg-fuchsia-100 font-semibold rounded-lg shadow-md transition duration-300"
                      >
                        Open in Google Maps ↗
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl bg-white/5 backdrop-blur-md border border-purple-300/30 p-10 rounded-2xl shadow-xl"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500 mb-4">
              🔒 You’re not signed in
            </h2>
            <p className="text-lg text-gray-900 mb-8">
              Sign in to explore exciting events happening near you and get full
              access to detailed info, maps, and more!
            </p>
            <Link
              to="/signin"
              className="inline-block px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🚀 Sign In Now
            </Link>
          </motion.div>
        </div>
      )}
    </>
  );
}
