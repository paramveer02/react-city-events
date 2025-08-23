// src/contexts/AuthContext.jsx
import { createContext, useEffect, useState, useMemo } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);

  async function fetchMe() {
    try {
      const res = await fetch(
        "http://localhost:8000/api/v1/users/current-user",
        {
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("not authed");
      const data = await res.json();
      const u = data.user ?? data;
      setUser(u);
      setIsAuth(true);
    } catch {
      setUser(null);
      setIsAuth(false);
    }
  }

  // boot once
  useEffect(() => {
    // local flag + cookie roundtrip
    if (localStorage.getItem("auth") === "1") {
      fetchMe();
    } else {
      // even if local flag is missing, try cookie (user could refresh)
      fetchMe();
    }
  }, []);

  // react to cross-tab + in-app auth changes
  useEffect(() => {
    const onChange = () => fetchMe();
    window.addEventListener("storage", onChange);
    window.addEventListener("authchange", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("authchange", onChange);
    };
  }, []);

  function login() {
    localStorage.setItem("auth", "1");
    window.dispatchEvent(new Event("authchange"));
  }

  async function logout() {
    try {
      await fetch("http://localhost:8000/api/v1/auth/logout", {
        method: "GET",
        credentials: "include",
      });
    } finally {
      localStorage.removeItem("auth");
      setUser(null);
      setIsAuth(false);
      window.dispatchEvent(new Event("authchange"));
    }
  }

  const value = useMemo(
    () => ({ isAuth, user, login, logout }),
    [isAuth, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
