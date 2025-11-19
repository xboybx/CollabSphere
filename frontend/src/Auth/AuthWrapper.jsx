import React, { Children } from "react";
import { useContext, useEffect } from "react";
import { userContext } from "../Context/UsercontextProvider.jsx";

const AuthWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = token !== null;
  const { user } = useContext(userContext);

  useEffect(() => {
    // Check if the user is authenticated
    if (!isAuthenticated) {
      // If not, redirect to the login page
      window.location.href = "/login";
      return null; // Prevent rendering the children
    }

    if (!user) {
      window.location.href = "/login";
      return null;
    }
  }, [isAuthenticated]);

  return <>{children}</>;
};

export default AuthWrapper;
