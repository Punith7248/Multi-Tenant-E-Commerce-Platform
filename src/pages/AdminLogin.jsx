
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  LockKeyhole,
} from "lucide-react";
import "./AdminLogin.css";
import superAdminImage from "../assets/super admin.png";
import { api, setAuth } from "../api";


function AdminLogin() {
  const nav = useNavigate();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await api("/auth/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      setAuth(data);
      sessionStorage.setItem("novacart-super-admin", "true");
      nav("/super-admin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="admin-login-page">

      {/* ================= IMAGE SECTION ================= */}
      <section
        className="admin-login-image"
        style={{
          backgroundImage: `url(${superAdminImage})`,
        }}
        aria-label="Super Admin"
      >
        <div className="admin-image-overlay">

          <div className="admin-image-brand">
            <span className="admin-brand-icon">
              <ShieldCheck size={21} />
            </span>

            <span>
              Nova<span>Cart</span>
            </span>
          </div>

          <div className="admin-image-copy">
            <p>SECURE ADMINISTRATION</p>

            <h1>
              Manage your marketplace from one place.
            </h1>

            <span>
              Access customer and vendor information securely.
            </span>
          </div>

        </div>
      </section>

      {/* ================= LOGIN SECTION ================= */}
      <section className="admin-login-panel">

        <div className="admin-brand">
          <span className="admin-brand-icon">
            <ShieldCheck size={21} />
          </span>

          <span>
            Nova<span>Cart</span>
          </span>
        </div>

        <div className="admin-login-card">

          <div className="admin-lock-icon">
            <LockKeyhole size={23} />
          </div>

          <p className="admin-eyebrow">
            RESTRICTED ACCESS
          </p>

          <h1>
            Super Admin Login
          </h1>

          <p className="admin-subtitle">
            Sign in to manage customer and vendor information.
          </p>

          <form
            onSubmit={handleSubmit}
            className="admin-login-form"
          >

            {/* USERNAME */}
            <label>
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder="Enter super admin username"
              autoComplete="username"
              required
            />

            {/* PASSWORD */}
            <label>
              Password
            </label>

            <div className="admin-password-wrap">

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((value) => !value)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <p className="admin-error">
                {error}
              </p>
            )}

            {/* LOGIN BUTTON */}
            <button
              className="admin-login-btn"
              type="submit"
            >
              Sign in as Super Admin
            </button>

          </form>

        </div>

        <button
          className="admin-back-btn"
          onClick={() => nav("/")}
        >
          ← Back to NovaCart
        </button>

      </section>

    </main>
  );
}

export default AdminLogin;

