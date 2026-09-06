import { useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/auth/me")
      .then((response) => {
        if (!cancelled) {
          setUser(response.data.user);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      setUser(response.data.user);

      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name,
    email,
    password,
    role = "customer"
  ) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      setUser(response.data.user);

      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};