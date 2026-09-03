import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Auth({ register = false }) {
  const [form, setForm] = useState({
    name: "",
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
      if (register) {
        const response = await api.post(
          "/auth/register",
          form
        );

        setMsg(
          response.data.message ||
            "Registration successful. Please verify your email."
        );
      } else {
        const response = await api.post(
          "/auth/login",
          {
            email: form.email,
            password: form.password,
          }
        );

        login(
          response.data.user,
          response.data.token
        );

        // Normal user login always goes to customer dashboard
        navigate("/");
      }
    } catch (error) {
      console.error(
        "Authentication error:",
        error.response?.data || error
      );

      setMsg(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="center">
      <h1>
        {register
          ? "Create Your Account"
          : "Welcome Back"}
      </h1>

      <form onSubmit={submit}>
        {register && (
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            required
          />
        )}

        <input
          placeholder="Email"
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
            ? "Please wait..."
            : register
            ? "Register"
            : "Login"}
        </button>
      </form>

      {!register && (
        <>
          <button
            className="link"
            type="button"
            onClick={() =>
              navigate("/forgot-password")
            }
          >
            Forgot password?
          </button>

          <button
            className="link"
            type="button"
            onClick={() =>
              navigate("/admin/login")
            }
          >
            Admin Login
          </button>
        </>
      )}

      {msg && (
        <p className="auth-message">
          {msg}
        </p>
      )}

      <button
        className="link"
        type="button"
        onClick={() =>
          navigate(
            register
              ? "/login"
              : "/register"
          )
        }
      >
        {register
          ? "Already have an account? Login"
          : "Need an account? Register"}
      </button>
    </main>
  );
}