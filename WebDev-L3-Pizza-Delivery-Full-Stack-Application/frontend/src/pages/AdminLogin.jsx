import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();

    setMsg("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/admin/login",
        {
          email: form.email,
          password: form.password,
        }
      );

      login(
        response.data.user,
        response.data.token
      );

      navigate("/admin");

    } catch (error) {
      console.error(
        "Admin login error:",
        error.response?.data || error
      );

      setMsg(
        error.response?.data?.message ||
          "Unable to login as admin"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="center">
      <h1>Admin Login</h1>

      <p>
        Login with your administrator account
      </p>

      <form onSubmit={submit}>
        <input
          placeholder="Admin Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          required
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login as Admin"}
        </button>
      </form>

      {msg && (
        <p className="auth-message">
          {msg}
        </p>
      )}

      <button
        className="link"
        type="button"
        onClick={() =>
          navigate("/login")
        }
      >
        Back to User Login
      </button>
    </main>
  );
}