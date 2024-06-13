import "./App.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from "./components/Navigation";
import Booking from "./components/Booking";
import Movies from "./components/Movies";
import Login from "./components/loginsignup"; // Import Login component
import React, { useState, useEffect } from 'react';
import Admin from "./components/Admin";
import Slider from "./components/Slider"
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(loggedIn);
  }, []);

  const handleLogin = (username, userRole) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("username", username);
    localStorage.setItem("role", userRole); // Lưu role vào localStorage
    setIsAuthenticated(true); // Đặt isAuthenticated sau khi lưu vào localStorage
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("role"); // Xóa role khỏi localStorage
    setIsAuthenticated(false); // Đặt isAuthenticated sau khi xóa khỏi localStorage
  };

  return (
    <div>

      <Navigation isAuthenticated={isAuthenticated} onLogout={handleLogout} onLogin={handleLogin} />
      <Slider />
      <Routes>
        <Route path="/" element={<Movies />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/booking/:id" element={isAuthenticated ? <Booking /> : <Navigate to="/login" />} />

        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/admin" element={<ProtectedAdminRoute isAuthenticated={isAuthenticated} />} />
      </Routes>
    </div>
  );
}

const ProtectedAdminRoute = ({ isAuthenticated }) => {
  const role = localStorage.getItem("role");
  console.log("Role:", role);
  console.log("isAuthenticated:", isAuthenticated);
  return localStorage.getItem("isAuthenticated") === "true" && role === "admin" ? <Admin /> : <Navigate to="/movies" />;
};

export default App;
