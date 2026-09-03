import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/client";

/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

export function Forgot() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setMsg("");
    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", {
        email: cleanEmail,
      });

      setSent(true);

      setMsg(
        response.data?.message ||
          "Reset link sent. Please check your email."
      );
    } catch (err) {
      console.error("Forgot password error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="center">
      <div className="auth-card">

        <h1>Forgot Password</h1>

        {!sent ? (
          <>
            <p className="auth-description">
              Enter your email address and we'll send you
              a link to reset your password.
            </p>

            <form onSubmit={submit}>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                disabled={loading}
                autoComplete="email"
                required
              />

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Sending..."
                  : "Send reset link"}
              </button>

            </form>

            {error && (
              <p className="auth-error">
                {error}
              </p>
            )}

            <p className="auth-link">
              Remember your password?{" "}
              <Link to="/login">
                Login
              </Link>
            </p>
          </>
        ) : (
          <div className="success-box">

            <div className="success-icon">
              ✓
            </div>

            <h2>Check your email</h2>

            <p>
              {msg}
            </p>

            <p className="small-text">
              We sent a password reset link to:
            </p>

            <strong>
              {email}
            </strong>

            <div className="success-actions">

              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setMsg("");
                }}
              >
                Send another link
              </button>

              <Link
                className="back-login"
                to="/login"
              >
                Back to Login
              </Link>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}


/* =========================================================
   RESET PASSWORD
   ========================================================= */

export function Reset() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setMsg("");
    setError("");

    /* -----------------------------------------
       Check token
    ----------------------------------------- */

    if (!token) {
      setError(
        "This reset link is invalid or expired."
      );
      return;
    }

    /* -----------------------------------------
       Password validation
    ----------------------------------------- */

    if (!password) {
      setError(
        "Please enter your new password."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        `/auth/reset-password/${token}`,
        {
          password,
        }
      );

      setSuccess(true);

      setMsg(
        response.data?.message ||
          "Password reset successfully!"
      );

      /*
       * Redirect only after successful
       * password reset.
       */
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error(
        "Reset password error:",
        err
      );

      /*
       * IMPORTANT:
       *
       * We only show "Invalid or expired"
       * AFTER the backend rejects the token.
       *
       * It will NOT appear when the page
       * initially opens.
       */
      setError(
        err.response?.data?.message ||
          "This reset link is invalid or has expired."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="center">
      <div className="auth-card">

        {!success ? (
          <>
            <h1>Reset Password</h1>

            <p className="auth-description">
              Enter and confirm your new password.
            </p>

            <form onSubmit={submit}>

              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={loading}
                autoComplete="new-password"
                required
              />

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(
                    e.target.value
                  );
                  setError("");
                }}
                disabled={loading}
                autoComplete="new-password"
                required
              />

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Resetting..."
                  : "Reset password"}
              </button>

            </form>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <p className="auth-link">
              <Link to="/login">
                ← Back to Login
              </Link>
            </p>
          </>
        ) : (
          <div className="success-box">

            <div className="success-icon">
              ✓
            </div>

            <h2>Password Reset!</h2>

            <p>
              {msg}
            </p>

            <p className="small-text">
              Redirecting you to the login page...
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>

          </div>
        )}

      </div>
    </main>
  );
}