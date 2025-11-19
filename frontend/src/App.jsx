import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Screens.jsx/Register";
import Home from "./Screens.jsx/Home";
import Login from "./Screens.jsx/Login";
import NewCreatedProject from "./Screens.jsx/NewCreatedProject";
import AuthWrapper from "./Auth/AuthWrapper";
<<<<<<< HEAD
import Landing from "./Screens.jsx/Landing";
=======
>>>>>>> 6008d8b5cb79a54782c04c13138c2980ff9b795d

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
<<<<<<< HEAD
          path="/home"
=======
          path="/"
>>>>>>> 6008d8b5cb79a54782c04c13138c2980ff9b795d
          element={
            <AuthWrapper>
              <Home />
            </AuthWrapper>
          }
        />
        <Route
<<<<<<< HEAD
          path="/project/:projectId"
=======
          path="/newcreatedproject"
>>>>>>> 6008d8b5cb79a54782c04c13138c2980ff9b795d
          element={
            <AuthWrapper>
              <NewCreatedProject />
            </AuthWrapper>
          }
        />
<<<<<<< HEAD
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
=======
        <Route path="register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/logout" element={<Logout />} /> */}
>>>>>>> 6008d8b5cb79a54782c04c13138c2980ff9b795d
      </Routes>
    </BrowserRouter>
  );
};
export default App;
