import { FaMapMarkerAlt, FaCalendarAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function EventCard({
  id,
  title,
  location,
  date,
  organizerName,
  mine = false,
}) {
  const formattedDate = new Date(date).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <Link to={`/events/${id}`}>
      <li className="relative border-l-4 border-purple-500 bg-black/60 text-white p-6 rounded-lg shadow-xl backdrop-blur-md hover:scale-[1.01] transition-all duration-300 mb-3">
        <div className="absolute -left-3 top-6 w-6 h-6 bg-purple-500 rounded-full shadow-md" />

        <h3 className="text-xl font-extrabold text-purple-300 mb-1 tracking-wide">
          {title}
        </h3>

        {(mine || organizerName) && (
          <p className="flex items-center text-xs text-white/80 mb-2">
            <FaUser className="mr-2 text-fuchsia-300" />
            Organized by{" "}
            <span className="ml-1 font-semibold">
              {mine ? "You" : organizerName}
            </span>
          </p>
        )}

        <p className="flex items-center text-sm text-zinc-300 mb-1">
          <FaMapMarkerAlt className="mr-2 text-rose-400" />
          {location}
        </p>

        <p className="flex items-center text-sm text-zinc-300">
          <FaCalendarAlt className="mr-2 text-sky-400" />
          {formattedDate}
        </p>
      </li>
    </Link>
  );
}
