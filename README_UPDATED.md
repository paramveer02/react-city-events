# 🎉 EventSpark - Premium Event Management Platform

A modern, full-stack event management application with premium UI/UX, built with React, Node.js, and MongoDB.

## ✨ Latest Updates (November 2025)

### 🎨 Premium UI Overhaul

- **Glass Morphism Design**: Beautiful frosted glass effects throughout
- **Smooth Animations**: Powered by Framer Motion for buttery smooth transitions
- **3D Card Effects**: Event cards with 3D transforms and hover interactions
- **WebGL Effects**:
  - Image Trail: Mouse-interactive event image trails
  - Galaxy Background: Animated star field with mouse repulsion
- **Gradient Text Animations**: Animated gradient text with React Bits components
- **Premium Components**: All pages redesigned with modern aesthetics

### 📄 Enhanced Pages

#### 🏠 Home Page

- Hero section with TypeAnimation
- Animated gradient text
- Galaxy background with interactive stars
- Floating orbs and particle effects
- AI City Guide integration with geolocation

#### 🎫 Events Page

- Premium card grid layout
- Advanced search functionality
- Location-based event discovery
- Staggered animations for smooth loading
- Custom background with animated orbs

#### ➕ Create Event Page

- Beautiful form with glass morphism
- Location autocomplete (Photon API)
- Icon-enhanced input fields
- Real-time validation
- Smooth transitions

#### 👁️ Event Detail Page

- Comprehensive event information
- Interactive Google Maps integration
- Premium layout with gradient accents
- Delete functionality for event organizers
- Back navigation with smooth transitions

#### 🤖 AI Guide Page

- AI-powered city recommendations
- Beautiful card layouts
- Smooth loading states
- Error handling with user-friendly messages

### 🔧 Technical Improvements

- Fixed AI Guide API endpoint (`/api/v1/ai/city-guide`)
- Enhanced error handling across all pages
- Improved mobile responsiveness
- Better loading states
- Optimized animations for performance

### 🎭 Demo Account

Test the platform with pre-configured credentials:

- **Email**: `demo@eventspark.com`
- **Password**: `Demo123!`

See `DEMO_ACCOUNT.md` for more details.

---

## 🚀 Features

### Core Functionality

- 🔐 **Authentication**: Secure login/signup with JWT tokens
- 📍 **Location-Based**: Discover events near you using geolocation
- 🎨 **Create Events**: Easy event creation with location autocomplete
- 🗺️ **Interactive Maps**: Google Maps integration for event locations
- 🤖 **AI City Guide**: Get AI-powered recommendations for any city
- 🔍 **Search & Filter**: Find events by title and location

### UI/UX Features

- 💎 **Premium Design**: Glass morphism, gradients, and modern aesthetics
- 🎬 **Smooth Animations**: Framer Motion powered transitions
- 🎨 **3D Effects**: Interactive 3D card transforms
- 🌌 **WebGL Backgrounds**: Galaxy stars and image trails
- 📱 **Fully Responsive**: Works beautifully on all devices
- ♿ **Accessible**: Keyboard navigation and screen reader support

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **React Router v6** - Client-side routing
- **Framer Motion** - Animation library
- **Tailwind CSS v4** - Utility-first styling
- **Lucide React** - Beautiful icon set
- **TypeAnimation** - Typing text animations
- **GSAP** - Advanced animations for image trail
- **Vite** - Lightning-fast build tool

### Backend (Deployed)

- **Node.js & Express** - RESTful API
- **MongoDB** - Database
- **JWT** - Authentication
- **OpenAI API** - AI city guide feature
- **Photon API** - Location autocomplete

---

## 📦 Installation

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd react-city-events
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 🌐 Backend Server

The backend is already deployed on Render:

```
https://events-server-wnax.onrender.com
```

**Note**: Server may take 30-60 seconds to wake up on first request (free tier).

### API Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/events/near` - Get nearby events
- `POST /api/v1/events` - Create event
- `GET /api/v1/events/:id` - Get event details
- `DELETE /api/v1/events/:id` - Delete event
- `POST /api/v1/ai/city-guide` - AI city recommendations

---

## 📁 Project Structure

```
react-city-events/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── animations/    # Animation components
│   │   │   ├── GradientText.jsx
│   │   │   ├── ImageTrail.jsx
│   │   │   └── SplashCursor.jsx
│   │   ├── effects/       # Visual effects
│   │   │   └── Galaxy.jsx
│   │   ├── events/        # Event components
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   └── CreateEventEntry.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Loader.jsx
│   │   └── CityGuidePanel.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── layout/
│   │   └── RootLayout.jsx
│   ├── pages/
│   │   ├── authentication/
│   │   │   ├── SignIn.jsx
│   │   │   └── SignUp.jsx
│   │   ├── HomePage.jsx
│   │   ├── EventsPage.jsx
│   │   ├── MyEvents.jsx
│   │   ├── AiGuidePage.jsx
│   │   └── ErrorPage.jsx
│   ├── utils/
│   │   ├── api.js
│   │   └── helper.js
│   ├── App.jsx
│   ├── Router.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
├── package.json
├── DEMO_ACCOUNT.md         # Demo credentials
└── README.md
```

---

## 🎨 Key Components

### Animation Components

- **GradientText**: Animated gradient text with customizable colors
- **ImageTrail**: Mouse-interactive image trail with 8 variants
- **Galaxy**: WebGL star field with mouse interaction
- **SplashCursor**: Fluid simulation cursor effect (WebGL)

### Feature Components

- **EventCard**: 3D event card with hover effects
- **CreateEventEntry**: Premium form with location autocomplete
- **EventDetail**: Comprehensive event view with map
- **CityGuidePanel**: AI-powered city recommendations
- **Hero**: Landing page hero with TypeAnimation

---

## 🎯 Usage Guide

### Creating an Event

1. Sign in to your account
2. Click "Create Event" button
3. Fill in event details:
   - Title
   - Description
   - Location (with autocomplete)
   - Date & Time
4. Submit to publish

### Discovering Events

1. Allow location access when prompted
2. Browse nearby events on Events page
3. Use search to filter by title
4. Click any event card to view details

### Using AI City Guide

1. Click "AI City Guide" on homepage
2. Allow location access or enter city manually
3. Get AI-powered event recommendations
4. Explore attractions, dining, and activities

---

## 🔑 Environment Variables

The application uses hardcoded API endpoints pointing to the deployed backend. No environment variables needed for basic usage.

If you want to use a different backend:

1. Update API URLs in components:
   - `src/components/Hero.jsx`
   - `src/pages/AiGuidePage.jsx`
   - `src/components/events/CreateEventEntry.jsx`
   - `src/components/events/EventDetail.jsx`
   - `src/pages/EventsPage.jsx`

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
# Upload dist/ folder
```

### Backend (Already Deployed)

The backend is hosted on Render:

```
https://events-server-wnax.onrender.com
```

---

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#a855f7', // purple
      secondary: '#ec4899', // pink
    }
  }
}
```

### Animations

All animations are configured in:

- `tailwind.config.js` - Tailwind animations
- `src/index.css` - Custom keyframes
- Component files - Framer Motion variants

---

## 🐛 Known Issues & Solutions

### Server Wake-up Time

**Issue**: First request takes 30-60 seconds
**Solution**: Wait for server to wake up (Render free tier limitation)

### Location Permission Denied

**Issue**: Cannot get nearby events
**Solution**: Enable location services in browser settings

### AI Guide Not Working

**Issue**: AI recommendations fail
**Solution**: Ensure API endpoint is `/api/v1/ai/city-guide` (fixed in latest version)

---

## 📝 License

This project is created for portfolio purposes.

---

## 👨‍💻 Developer

**Paramveer Marwah**

- Portfolio: [Your Portfolio URL]
- GitHub: [@paramveer02](https://github.com/paramveer02)
- LinkedIn: [Your LinkedIn]

---

## 🙏 Acknowledgments

- Unsplash for event images
- Photon API for location autocomplete
- OpenAI for AI city guide
- Framer Motion for animations
- React Bits for gradient text component
- Codrops for image trail inspiration

---

## 📸 Screenshots

[Add screenshots of your application here]

---

## 🔮 Future Enhancements

- [ ] Event categories and tags
- [ ] User profiles with avatars
- [ ] Event comments and ratings
- [ ] Social sharing features
- [ ] Event ticketing system
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Dark/Light theme toggle
- [ ] Multi-language support

---

**Built with ❤️ and ✨ by Paramveer Marwah**
