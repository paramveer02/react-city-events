import {
  Form,
  useActionData,
  useNavigation,
  redirect,
  Link,
} from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

export async function signinAction({ request }) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  const res = await fetch(
    "https://events-server-wnax.onrender.com/api/v1/auth/login",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { error: err.message || "Login failed" };
  }

  // mark authenticated locally so header flips immediately
  localStorage.setItem("auth", "1");
  window.dispatchEvent(new Event("authchange"));

  return redirect("/?signedin=1");
}

export default function SignIn() {
  const action = useActionData();
  const nav = useNavigation();

  useEffect(() => {
    if (action?.error) toast.error(action.error);
  }, [action]);

  return (
    <section
      className="relative min-h-[calc(100vh-var(--header-h))] flex items-center justify-center"
      style={{ paddingTop: "var(--header-h)" }}
    >
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-2.jpg')" }}
        aria-hidden
      />
      <div className="fixed inset-0 -z-10 bg-black/40 backdrop-blur-[1px]" />

      <Form
        method="post"
        className="w-full max-w-md p-8 rounded-2xl text-white
                   bg-black/40 backdrop-blur-xl
                   border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.35)]
                   space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center">
          <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
            Sign In to EventSpark
          </span>
        </h2>

        <Field label="Email">
          <input
            name="email"
            type="email"
            required
            defaultValue="param@test.com"
            placeholder="you@example.com"
            className="w-full px-4 py-2 rounded-lg bg-zinc-900/70 border border-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
        </Field>

        <Field label="Password">
          <input
            name="password"
            type="password"
            defaultValue="user123!"
            required
            placeholder="••••••••"
            className="w-full px-4 py-2 rounded-lg bg-zinc-900/70 border border-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
        </Field>

        <button
          type="submit"
          disabled={nav.state === "submitting"}
          className="btn-gradient w-full py-3 rounded-xl font-semibold text-white
                     bg-gradient-to-r from-fuchsia-900 via-pink-300 to-indigo-900
                     shadow-[0_10px_30px_rgba(99,102,241,0.35)]
                     hover:brightness-110 active:scale-[0.98] transition
                     btn-pulse cursor-pointer"
        >
          {nav.state === "submitting" ? "Signing In..." : "Sign In 🚀"}
        </button>

        <p className="text-center text-sm text-white/80">
          New to{" "}
          <span className="text-fuchsia-300 font-semibold">EventSpark</span>?
        </p>
        <div className="flex justify-center">
          <Link
            to="/signup"
            className="btn-gradient inline-flex items-center justify-center px-6 py-2 rounded-xl
                       font-semibold text-white bg-gradient-to-r from-fuchsia-900 via-pink-300 to-indigo-900
                       shadow-[0_10px_30px_rgba(99,102,241,0.35)]
                       hover:brightness-110 active:scale-[0.98] transition
                       btn-pulse cursor-pointer"
          >
            ✨ Create Account
          </Link>
        </div>
      </Form>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-white/90">{label}</span>
      {children}
    </label>
  );
}
