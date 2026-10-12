import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Store,
  User,
} from "lucide-react";
import "./VendorSignup.css";
import venderSign from "../assets/vendersign.png";
import { api, setAuth } from "../api";

const VendorSignup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.businessName ||
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!formData.terms) {
      alert("Please accept the terms and conditions.");
      return;
    }

    try {
      const data = await api("/auth/vendor/signup", {
        method: "POST",
        body: JSON.stringify({
          businessName: formData.businessName,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });
      setAuth(data);
      alert("Vendor account created. It is waiting for Super Admin approval.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="vendor-signup-page">

      <section
        className="vendor-signup-image"
        style={{
          backgroundImage: `url(${venderSign})`,
        }}
      >
        <div className="vendor-signup-image-content">

          <div className="vendor-signup-brand">
            <div className="vendor-signup-brand-icon">
              <Store size={22} />
            </div>

            <span>NovaCart</span>
          </div>

          <div className="vendor-signup-message">

            <span className="vendor-small-label">
              SELL WITH NOVACART
            </span>

            <h1>
              Turn your products into a growing business.
            </h1>

            <p>
              Create your vendor account and get everything you need
              to build, manage and grow your online store.
            </p>

            <div className="vendor-signup-benefits">

              <div>
                <span>
                  <Check size={14} />
                </span>
                <p>Launch your store quickly</p>
              </div>

              <div>
                <span>
                  <Check size={14} />
                </span>
                <p>Manage products and inventory</p>
              </div>

              <div>
                <span>
                  <Check size={14} />
                </span>
                <p>Track orders and business growth</p>
              </div>

            </div>

          </div>

        </div>
      </section>

      <section className="vendor-signup-form-section">

        <div className="vendor-signup-container">

          <div className="vendor-signup-header">

            <div className="vendor-signup-logo">
              <div className="vendor-signup-logo-icon">
                <Store size={22} />
              </div>

              <span>NovaCart</span>
            </div>

            <Link to="/login" className="vendor-login-top-link">
              Already a vendor?
              <strong>Sign in</strong>
            </Link>

          </div>

          <div className="vendor-signup-heading">

            <p>CREATE YOUR STORE</p>

            <h2>Start selling with NovaCart</h2>

            <span>
              Create your vendor account and start building your
              online business.
            </span>

          </div>

          <form
            className="vendor-signup-form"
            onSubmit={handleSubmit}
          >

            <div className="vendor-two-column">

              <div className="vendor-signup-input-group">
                <label>Business name</label>

                <div className="vendor-signup-input">

                  <Store size={18} />

                  <input
                    type="text"
                    name="businessName"
                    placeholder="Your business name"
                    value={formData.businessName}
                    onChange={handleChange}
                  />

                </div>
              </div>

              <div className="vendor-signup-input-group">
                <label>Your name</label>

                <div className="vendor-signup-input">

                  <User size={18} />

                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />

                </div>
              </div>

            </div>

            <div className="vendor-signup-input-group">

              <label>Email address</label>

              <div className="vendor-signup-input">

                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your business email"
                  value={formData.email}
                  onChange={handleChange}
                />

              </div>

            </div>

            <div className="vendor-signup-input-group">

              <label>Phone number</label>

              <div className="vendor-signup-input">

                <Phone size={18} />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />

              </div>

            </div>

            <div className="vendor-two-column">

              <div className="vendor-signup-input-group">

                <label>Password</label>

                <div className="vendor-signup-input">

                  <Lock size={18} />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="vendor-eye-button"
                    onClick={() =>
                      setShowPassword(!showPassword)
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

              <div className="vendor-signup-input-group">

                <label>Confirm password</label>

                <div className="vendor-signup-input">

                  <Lock size={18} />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="vendor-eye-button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

            </div>

            <label className="vendor-terms">

              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />

              <span>
                I agree to the{" "}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Privacy Policy
                </a>
              </span>

            </label>

            <button
              type="submit"
              className="vendor-create-button"
            >
              Create vendor account
              <ArrowRight size={18} />
            </button>

          </form>

          <div className="vendor-signup-divider">
            <span>or continue with</span>
          </div>

          <div className="vendor-signup-social">

            <button
              type="button"
              onClick={() =>
                alert("Google signup coming soon.")
              }
            >
              <svg viewBox="0 0 24 24" width="19" height="19">
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
                alert("Apple signup coming soon.")
              }
            >
              <svg viewBox="0 0 24 24" width="19" height="19">
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
            className="vendor-signup-back"
            onClick={() => navigate("/")}
          >
            ← Back to NovaCart
          </button>

        </div>

      </section>

    </div>
  );
};

export default VendorSignup;