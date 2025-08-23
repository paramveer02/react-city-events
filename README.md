# ✨ EventSpark Frontend

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Bundler-Vite-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-06B6D4?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Animations-Framer%20Motion-pink?logo=framer)
![React Router](https://img.shields.io/badge/Routing-React%20Router-red?logo=reactrouter)
![Maps](https://img.shields.io/badge/Maps-Leaflet%20%7C%20Google%20Maps-green?logo=googlemaps)
![AI](https://img.shields.io/badge/AI%20Integration-GenAI%20Guide-yellow?logo=google)
![Auth](https://img.shields.io/badge/Auth-Cookies%20%7C%20JWT-purple)
![Deploy](https://img.shields.io/badge/Deployed%20On-Render-blueviolet?logo=render)

Frontend client for **EventSpark** — a modern event discovery and management platform.  
Built with **React (Vite)** + **TailwindCSS**, it provides an interactive, beautiful, and mobile-friendly experience for browsing, creating, and managing events.

🌐 **Live App**: [https://eventspark-vjnm.onrender.com](https://eventspark-vjnm.onrender.com)  
🔗 **Backend API**: [https://events-server-wnax.onrender.com](https://events-server-wnax.onrender.com)


---

## 🚀 Features

- **Authentication**
  - Sign up, sign in, and logout with secure cookies
  - Context-based auth management with React

- **Events**
  - Explore nearby events (auto-detects location with browser Geolocation API)
  - Search events by title
  - Create events with smart location autocomplete (Nominatim API)
  - Delete events (only for events created by you)
  - “Interested” functionality to track attendees (WIP)

- **Event Detail**
  - Full event info with organizer, location, description, and map
  - Interactive Google Maps embed
  - Animated glowing UI with Framer Motion

- **AI Guide Integration**
  - From Hero section, users can launch AI-powered City Guide
  - Provides shopping, food, and sightseeing recommendations based on location

- **UI/UX**
  - TailwindCSS + custom gradients and animations
  - Framer Motion transitions
  - Dark glassmorphism style cards
  - Loading spinners with `react-spinners`
  - Confetti & Lottie animations for celebrations
  - Responsive design for mobile and desktop

---

## 📂 Pages

- `/` → Home + Hero with AI Guide CTA  
- `/events` → Explore nearby events  
- `/myevents` → View your created events  
- `/create` → Create event form with location autocomplete  
- `/events/:id` → Event detail with map & organizer info  
- `/signin` → Sign In  
- `/signup` → Sign Up  
- `/ai-guide` → AI City Guide results  

---

## 🛠️ Tech Stack

- **Frontend Framework**: React (Vite)  
- **Styling**: TailwindCSS, DaisyUI, clsx  
- **State/Data**: React Context, TanStack React Query  
- **Forms/Validation**: React Hook Form + Zod  
- **Animations**: Framer Motion, Lottie, Confetti  
- **Maps**: Leaflet + Google Maps embed  
- **APIs**: Nominatim (address autocomplete), custom Events API, AI Guide API  

---

## ⚙️ Installation

```bash
# Clone repo
git clone https://github.com/paramveer02/react-city-events.git
cd react-city-events

# Install dependencies
npm install

# Create .env file
VITE_API_URL=http://localhost:8000

# Run dev
npm run dev

# Build for prod
npm run build
