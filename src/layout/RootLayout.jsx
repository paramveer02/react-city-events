import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootLayout() {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('events-bg-4.jpg')",
      }}
    >
      <Header />

      <main className="flex-grow pt-28 px-4 flex justify-center items-center">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
