import React from "react";

import { createRoot } from "react-dom/client";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./styles.css";

import { AuthProvider } from "./context/AuthContext";

import Nav from "./components/Nav";

import Protected from "./components/Protected";

import Dashboard from "./pages/Dashboard";

import Auth from "./pages/Auth";

import Builder from "./pages/Builder";

import Summary from "./pages/Summary";

import MyOrders from "./pages/MyOrders";

import Admin from "./pages/Admin";

import AdminLogin from "./pages/AdminLogin";

import Verify from "./pages/Verify";

import {
  Forgot,
  Reset,
} from "./pages/ForgotReset";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Nav />

        <Routes>
          {/* User Authentication */}

          <Route
            path="/login"
            element={<Auth />}
          />

          <Route
            path="/register"
            element={<Auth register />}
          />

          {/* Separate Admin Login */}

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          {/* Email Verification */}

          <Route
            path="/verify/:token"
            element={<Verify />}
          />

          {/* Forgot Password */}

          <Route
            path="/forgot-password"
            element={<Forgot />}
          />

          {/* Reset Password */}

          <Route
            path="/reset/:token"
            element={<Reset />}
          />

          {/* User Dashboard */}

          <Route
            path="/"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />

          {/* Pizza Builder */}

          <Route
            path="/builder"
            element={
              <Protected>
                <Builder />
              </Protected>
            }
          />

          {/* Order Summary */}

          <Route
            path="/summary"
            element={
              <Protected>
                <Summary />
              </Protected>
            }
          />

          {/* My Orders */}

          <Route
            path="/orders"
            element={
              <Protected>
                <MyOrders />
              </Protected>
            }
          />

          {/* Admin Dashboard */}

          <Route
            path="/admin"
            element={
              <Protected admin>
                <Admin />
              </Protected>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

createRoot(
  document.getElementById("root")
).render(<App />);