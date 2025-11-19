import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Screens.jsx/Register";
import Home from "./Screens.jsx/Home";
import Login from "./Screens.jsx/Login";
import NewCreatedProject from "./Screens.jsx/NewCreatedProject";
import AuthWrapper from "./Auth/AuthWrapper";
import Landing from "./Screens.jsx/Landing";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/home"
          element={
            <AuthWrapper>
              <Home />
            </AuthWrapper>
          }
        />
        <Route
          path="/project/:projectId"
          element={
            <AuthWrapper>
              <NewCreatedProject />
            </AuthWrapper>
          }
        />
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
