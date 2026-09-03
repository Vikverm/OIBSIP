import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  if (!user) return null;
  const active = path => location.pathname === path ? "active" : "";

  return (
    <header className="topbar">
      <Link className="brand" to={user.role === "admin" ? "/admin" : "/"}>
        <span className="brand-mark">🍕</span><span>Pizza<span>Flow</span></span>
      </Link>
      <nav className="topnav">
        {user.role !== "admin" && <><Link className={active("/")} to="/">Home</Link><Link className={active("/builder")} to="/builder">Menu</Link><Link className={active("/orders")} to="/orders">Orders</Link></>}
        {user.role === "admin" && <Link className={active("/admin")} to="/admin">Admin Dashboard</Link>}
      </nav>
      <div className="nav-actions">
        <span className="user-chip">{user.name?.charAt(0)?.toUpperCase() || "U"}</span>
        <button className="ghost-btn" onClick={() => { logout(); navigate("/login"); }}>Logout</button>
      </div>
    </header>
  );
}
