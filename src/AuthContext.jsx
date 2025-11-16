import { createContext, useContext, useState } from "react";
import { useEffect } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setLocation("TABLET"); // jump user ahead
    }
  }, []);

  async function signup(formData) {
    setError(null); // clear old errors

    try {
      const username = formData.get("name")?.trim();
      if (!username) throw new Error("Please enter a name.");

      const response = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: username }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Signup failed.");
      }

      setToken(result.token);
      sessionStorage.setItem("token", result.token);
      setLocation("TABLET");
    } catch (err) {
      setError(err.message);
    }
  }

  async function authenticate() {
    setError(null);

    try {
      if (!token) throw new Error("No token found. Please sign up first.");

      const response = await fetch(`${API}/authenticate`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Authentication failed.");
      }

      setLocation("TUNNEL");
    } catch (err) {
      setError(err.message);
    }
  }

  const value = { location, signup, authenticate, error };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
