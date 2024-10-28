import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // При завантаженні перевіряємо наявність збереженого користувача
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData, remember = false) => {
    setUser(userData);
    if (remember) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = (userData) => {
    setUser(userData);
    if (localStorage.getItem("user")) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  return { user, login, logout, updateUser };
};
