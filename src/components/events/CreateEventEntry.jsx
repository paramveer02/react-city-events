import { useState } from "react";
import getJSON from "../../utils/api";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

export default function CreateEventEntry() {
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    latitude: "",
    longitude: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleEventCreation(e) {
    e.preventDefault();

    const isoDate = new Date(eventData.date).toISOString();

    const payload = {
      ...eventData,
      date: isoDate,
      latitude: +eventData.latitude,
      longitude: +eventData.longitude,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      body: JSON.stringify(payload),
    };

    await getJSON(`http://localhost:3001/api/events`, options);
    navigate("/events");
  }

  return (
    <form
      onSubmit={handleEventCreation}
      className="max-w-2xl mx-auto p-8 bg-black/40 backdrop-blur-lg rounded-2xl shadow-lg space-y-6 text-white border border-white/10"
    >
      <h2 className="text-2xl font-bold text-purple-400 text-center">
        ✨ Create a New Event ✨
      </h2>

      <div>
        <label className="block mb-1 text-sm font-semibold text-purple-200">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={eventData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-black/10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter event title"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-semibold text-purple-200">
          Description
        </label>
        <textarea
          name="description"
          value={eventData.description}
          onChange={handleChange}
          required
          rows="4"
          className="w-full px-4 py-2 rounded-lg bg-black/10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Describe your event..."
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-semibold text-purple-200">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={eventData.location}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-black/10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="e.g., Berlin, DE"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-semibold text-purple-200">
          Date & Time
        </label>
        <input
          type="datetime-local"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-black/10 text-white border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-semibold text-purple-200">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            name="latitude"
            value={eventData.latitude}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-black/10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., 52.52"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-purple-200">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            name="longitude"
            value={eventData.longitude}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-black/10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., 13.40"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-pink-500 hover:to-purple-700 transition-all text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:shadow-xl"
      >
        🚀 Create Event
      </button>
    </form>
  );
}
