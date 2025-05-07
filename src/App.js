import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Modeselection from "./Modeselection";
import SaviourMode from "./pages/SaviourMode";
import BotKnee from "./pages/BotKnee";
import Login from "./Login"; 
import Signup from "./Signup"; 
import PrivateRoute from "./components/PrivateRoute";
import WeeklyAssessment from "./pages/weekly-assesment";
import TherapyMode from "./pages/TherapyMode";

function App() {
  const isAuthenticated = !!localStorage.getItem("authToken");

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private Routes */}
        <Route
          path="/modeselection"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Modeselection />
            </PrivateRoute>
          }
        />
        <Route
          path="/saviour"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <SaviourMode />
            </PrivateRoute>
          }
        />
        <Route
          path="/therapy"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <TherapyMode />
            </PrivateRoute>
          }
        />
        <Route
          path="/botknee"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <BotKnee />
            </PrivateRoute>
          }
        />
        <Route
          path="/weekly-assessment"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <WeeklyAssessment />
            </PrivateRoute>
          }
        />

        {/* Default route */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/modeselection" /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
