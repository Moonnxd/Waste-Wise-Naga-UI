import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AdminDashboard from "./features/admin/AdminDashboard.jsx";
import "./index.css";

const isAdmin = window.location.pathname.replace(/\/$/, "") === "/admin";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>{isAdmin ? <AdminDashboard /> : <App />}</React.StrictMode>,
);
