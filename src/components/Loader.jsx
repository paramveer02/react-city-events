import { RingLoader } from "react-spinners";

export default function Loader() {
  return (
    <div
      className="
        fixed inset-0 z-[9999] 
        flex items-center justify-center
        bg-black/70 
      "
      aria-live="polite"
      aria-busy="true"
    >
      <div className="rounded-full p-6 shadow-[0_0_60px_#03010466] animate-glow">
        <RingLoader color="#9439ef" size={240} />
      </div>
    </div>
  );
}
