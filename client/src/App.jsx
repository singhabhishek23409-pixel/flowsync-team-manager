import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import Login from "./pages/Login";

import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";

import Tasks from "./pages/Tasks";

import Teams from "./pages/Teams";

import TeamChat from "./pages/TeamChat";


function App() {

  const [token, setToken] =
    useState(
      localStorage.getItem("token")
    );

  // LISTEN FOR STORAGE CHANGES
  useEffect(() => {

    const checkAuth = () => {

      setToken(
        localStorage.getItem("token")
      );

    };

    window.addEventListener(
      "storage",
      checkAuth
    );

    checkAuth();

    return () => {

      window.removeEventListener(
        "storage",
        checkAuth
      );

    };

  }, []);

  return (
    <BrowserRouter>

      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            token
              ? (
                  <Navigate to="/dashboard" />
                )
              : (
                  <Login />
                )
          }
        />

        {/* SIGNUP */}
        <Route
          path="/signup"
          element={
            token
              ? (
                  <Navigate to="/dashboard" />
                )
              : (
                  <Signup />
                )
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            token
              ? (
                  <Dashboard />
                )
              : (
                  <Navigate to="/login" />
                )
          }
        />

        {/* TASKS */}
        <Route
          path="/tasks"
          element={
            token
              ? (
                  <Tasks />
                )
              : (
                  <Navigate to="/login" />
                )
          }
        />

        {/* TEAMS */}
        <Route
          path="/teams"
          element={
            token
              ? (
                  <Teams />
                )
              : (
                  <Navigate to="/login" />
                )
          }
        />

        {/* TEAM CHAT */}
        <Route
          path="/teams/:id/chat"
          element={
            token
              ? (
                  <TeamChat />
                )
              : (
                  <Navigate to="/login" />
                )
          }
        />

        {/* DEFAULT */}
        <Route
          path="*"
          element={
            token
              ? (
                  <Navigate to="/dashboard" />
                )
              : (
                  <Navigate to="/login" />
                )
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;