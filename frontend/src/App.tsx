import React, { Fragment } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard";
import Profiles from "./pages/Profiles";
import Wallets from "./pages/Wallets";
import Workers from "./pages/Workers";
import WorkerPage from "./pages/Worker";
import ErrorPage from "./pages/Error";
import { Settings } from "./pages/Settings";

function App() {
  var location = useLocation();
  if (location.pathname === "/") {
    window.location.replace("/dashboard");
  }
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="workers" element={<Workers />} />
          <Route path="workers/:workerId" element={<WorkerPage />} />
          <Route path="wallets" element={<Wallets />} />
          <Route path="profiles" element={<Profiles />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
