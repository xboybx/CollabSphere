import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UsercontextProvider from "./Context/usercontextProvider.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <UsercontextProvider>
    <App />
  </UsercontextProvider>
  // </StrictMode>
);
