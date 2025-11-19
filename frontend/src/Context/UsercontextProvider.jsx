import React, { useState, useEffect } from "react";
import { createContext } from "react";

export const userContext = createContext();

const UsercontextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <userContext.Provider value={{ user, setUser, theme, setTheme }}>
      <>{children}</>
    </userContext.Provider>
  );
};

export default UsercontextProvider;
