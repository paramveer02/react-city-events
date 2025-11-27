import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import ImageTrail from "../components/animations/ImageTrail";

const eventImages = [
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=330&fit=crop", // Concert
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=330&fit=crop", // Music festival
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=330&fit=crop", // Conference
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=330&fit=crop", // DJ Party
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=330&fit=crop", // Crowd at event
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=300&h=330&fit=crop", // Theater performance
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=330&fit=crop", // Concert lights
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=330&fit=crop", // Music festival crowd
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=300&h=330&fit=crop", // Art gallery
  "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=300&h=330&fit=crop", // Stadium event
];

export default function RootLayout() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <ImageTrail items={eventImages} variant={2} />
      <Header />
      <main className="flex-1">
        {loading ? <Loader /> : <Outlet />}{" "}
        {/*  hide content until loader ends */}
      </main>
      <Footer />
    </div>
  );
}
