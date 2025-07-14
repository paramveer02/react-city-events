import { createContext, useState } from "react";
import getJSON from "../utils/api";
import { useEffect } from "react";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);

  const [authData, setAuthData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      setIsAuth(true);
    }
  }, []);

  function updateAuthData(e) {
    const { name, value } = e.target;
    setAuthData((prev) => ({ ...prev, [name]: value }));
  }

  function resetAuthData() {
    setAuthData({
      email: "",
      password: "",
    });
  }

  async function login() {
    const users = JSON.parse(localStorage.getItem("users"));

    // check if user exists
    const userExists = users.find((user) => user.email === authData.email);
    if (!userExists) alert("user not found!!");

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authData),
    };

    try {
      const { token } = await getJSON(
        `http://localhost:3001/api/auth/login`,
        options
      );

      localStorage.setItem("token", JSON.stringify(token));
      setIsAuth(true);
      resetAuthData();
    } catch (e) {
      console.error(e);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setIsAuth(false);
  }

  return (
    <AuthContext.Provider
      value={{ isAuth, login, logout, authData, updateAuthData, resetAuthData }}
    >
      {children}
    </AuthContext.Provider>
  );
}
