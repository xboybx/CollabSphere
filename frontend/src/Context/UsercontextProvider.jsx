import React, { useState, useEffect } from "react";
import { createContext } from "react";

export const userContext = createContext();

const UsercontextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUser(user);
    }
  }, []);

  return (
    <userContext.Provider value={{ user, setUser }}>
      <>{children}</>
    </userContext.Provider>
  );
};

export default UsercontextProvider;
