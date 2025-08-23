export default function Footer() {
  return (
    <footer className="bg-transparent text-white/80 py-8">
      <div className="mx-auto w-[min(96%,1100px)] text-center">
        <p>
          © {new Date().getFullYear()} EventSpark: Light up your city life ✨
        </p>
      </div>
    </footer>
  );
}
