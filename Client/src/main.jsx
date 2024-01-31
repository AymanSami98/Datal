import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./middleware";
import { Login, Signup, Notfound, Dashboard, NewReport } from "./components";
import { DashboardLayout } from "./layouts";
import { ContentsPage, UserPage } from "./Pages";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Wrap your entire application with AuthProvider */}
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/user" element={<UserPage />} />
            <Route path="/dashboard/content" element={<ContentsPage />} />
            <Route path="/dashboard/new-report" element={<NewReport />} />
          </Route>
          <Route path="*" element={<Notfound />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
