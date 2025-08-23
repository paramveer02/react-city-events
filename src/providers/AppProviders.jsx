import { Toaster } from "react-hot-toast";

export default function AppProviders({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#111827",
            color: "#fff",
            border: "1px solid #ffffff1a",
          },
          success: { iconTheme: { primary: "#a855f7", secondary: "#fff" } },
        }}
      />
    </>
  );
}
