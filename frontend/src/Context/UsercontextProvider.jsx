import React, { useState, useEffect } from "react";
import { createContext } from "react";

export const userContext = createContext();

const UsercontextProvider = ({ children }) => {
  const [user, setUser] = useState({});
<<<<<<< HEAD
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
=======

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUser(user);
    }
  }, []);

  return (
    <userContext.Provider value={{ user, setUser }}>
>>>>>>> 6008d8b5cb79a54782c04c13138c2980ff9b795d
      <>{children}</>
    </userContext.Provider>
  );
};

export default UsercontextProvider;
