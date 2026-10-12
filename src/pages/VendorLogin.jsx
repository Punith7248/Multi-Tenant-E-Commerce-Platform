import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Store,
} from "lucide-react";
import "./VendorLogin.css";
import venderBg from "../assets/vender.png";
import { api, setAuth } from "../api";

const VendorLogin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");

    try {
      const data = await api("/auth/vendor/login", {
        method: "POST",
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      setAuth(data);
      navigate("/vendor");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="vendor-login-page">
      <section
        className="vendor-login-left"
        style={{
          backgroundImage: `url(${venderBg})`,
        }}
      >
        <div className="vendor-left-logo">
          <div className="vendor-logo-box">
            <Store size={21} />
          </div>

          <span>
            Nova<span>Cart</span>
          </span>
        </div>

        <div className="vendor-left-content">
          <p className="vendor-eyebrow">
            NOVACART FOR BUSINESS
          </p>

          <h1>
            Build your store.
            <br />
            Grow your business.
          </h1>

          <p className="vendor-left-description">
            Manage your products, orders, customers and sales
            from one simple platform.
          </p>

          <div className="vendor-benefits">
            <div className="vendor-benefit">
              <div className="vendor-check">✓</div>
              <span>Manage your online store</span>
            </div>

            <div className="vendor-benefit">
              <div className="vendor-check">✓</div>
              <span>Track orders and sales</span>
            </div>

            <div className="vendor-benefit">
              <div className="vendor-check">✓</div>
              <span>Grow your customer base</span>
            </div>
          </div>
        </div>
      </section>

      <section className="vendor-login-right">
        <div className="vendor-top-account">
          <span>Don't have a vendor account?</span>
          <Link to="/vendor-signup">
            Create an account
          </Link>
        </div>

        <div className="vendor-login-container">
          <div className="vendor-mobile-logo">
            <div className="vendor-logo-box">
              <Store size={20} />
            </div>

            <span>
              Nova<span>Cart</span>
            </span>
          </div>

          <div className="vendor-login-heading">
            <p className="vendor-label">
              VENDOR PORTAL
            </p>

            <h2>Welcome back</h2>

            <p>
              Sign in to manage your store and continue
              growing your business.
            </p>
          </div>

          <form
            className="vendor-login-form"
            onSubmit={handleSubmit}
          >
            {error && <p style={{ color: "#c33c4d", fontSize: 12 }}>{error}</p>}
            <div className="vendor-field">
              <label>Email address</label>

              <div className="vendor-input">
                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="vendor-field">
              <div className="vendor-password-label">
                <label>Password</label>

                <button
                  type="button"
                  onClick={() =>
                    alert("Password reset coming soon.")
                  }
                >
                  Forgot password?
                </button>
              </div>

              <div className="vendor-input">
                <Lock size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="vendor-eye"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <label className="vendor-remember">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />

              <span>Remember me</span>
            </label>

            <button
              type="submit"
              className="vendor-submit"
            >
              Sign in
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="vendor-divider">
            <span>or continue with</span>
          </div>

          <div className="vendor-social">
            <button
              type="button"
              onClick={() =>
                alert("Google login coming soon.")
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.27c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
                />
                <path
                  fill="#34A853"
                  d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.75z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.53 13.83A5.86 5.86 0 0 1 6.22 12c0-.64.11-1.26.31-1.83V7.64H3.29A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.36l3.24-2.53z"
                />
                <path
                  fill="#EA4335"
                  d="M12 6.14c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.24 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.71 5.39l3.24 2.53C7.3 7.86 9.46 6.14 12 6.14z"
                />
              </svg>

              Google
            </button>

            <button
              type="button"
              onClick={() =>
                alert("Apple login coming soon.")
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.79 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3c.29 2.58-2.34 4.5-3.74 4.25z"
                />
              </svg>

              Apple
            </button>
          </div>

          <button
            type="button"
            className="vendor-back"
            onClick={() => navigate("/")}
          >
            ← Back to NovaCart
          </button>
        </div>
      </section>
    </main>
  );
};

export default VendorLogin;