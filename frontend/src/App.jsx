import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Screens.jsx/Register";
import Home from "./Screens.jsx/Home";
import Login from "./Screens.jsx/Login";
import NewCreatedProject from "./Screens.jsx/NewCreatedProject";
import AuthWrapper from "./Auth/AuthWrapper";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthWrapper>
              <Home />
            </AuthWrapper>
          }
        />
        <Route
          path="/newcreatedproject"
          element={
            <AuthWrapper>
              <NewCreatedProject />
            </AuthWrapper>
          }
        />
        <Route path="register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/logout" element={<Logout />} /> */}
      </Routes>
    </BrowserRouter>
  );
};
export default App;
