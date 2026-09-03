import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";

export default function Verify() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/auth/verify/${token}`);

        setMessage(
          response.data.message || "Email verified successfully!"
        );
        setSuccess(true);
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Verification failed. The link may be invalid or expired."
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "100px auto",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1>
        {success ? "Email Verified 🎉" : "Email Verification"}
      </h1>

      <p>{message}</p>

      {success && (
        <Link to="/login">
          <button
            style={{
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Go to Login
          </button>
        </Link>
      )}
    </div>
  );
}