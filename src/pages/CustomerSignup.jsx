import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ShoppingBag,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  PackageCheck,
  Headphones,
  Tag,
} from "lucide-react";

import signupBg from "../assets/sign2.png";
import { api, setAuth } from "../api";

const CustomerSignup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const perks = [
    {
      icon: Tag,
      label: "Exclusive Deals",
    },
    {
      icon: ShieldCheck,
      label: "Secure Payments",
    },
    {
      icon: PackageCheck,
      label: "Track Your Orders",
    },
    {
      icon: Headphones,
      label: "Support Small Businesses",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check empty fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all fields.");
      return;
    }

    // Check password
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const data = await api("/auth/customer/signup", {
        method: "POST",
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });
      setAuth(data);
      navigate("/customer");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-gray-100">
      <div
        className="
          grid
          h-full
          w-full
          grid-cols-1
          overflow-hidden
          rounded-none
          bg-white
          md:grid-cols-[50%_50%]
        "
      >
        {/* =====================================================
            LEFT IMAGE SECTION
        ====================================================== */}
      <section
          className="
            relative
            hidden
            h-full
            min-h-0
            flex-col
            justify-between
            overflow-hidden
            bg-cover
            bg-center
            px-9
            py-9
            md:flex
            md:px-12
            md:py-11
          "
          style={{
            backgroundImage: `url(${signupBg})`,
          }}
        >
          {/* LEFT TOP CONTENT */}
          <div className="relative z-10 -mt-2">
            <h1
              className="
                max-w-[360px]
                text-[28px]
                font-bold
                leading-[1.15]
                tracking-tight
                text-ink
                sm:text-[32px]
              "
            >
              Join a community that shops better.
            </h1>

            {/* SMALL LINE */}
            <div className="my-4 h-0.5 w-6 bg-ink" />

            {/* DESCRIPTION */}
            <p
              className="
                max-w-[300px]
                text-[13px]
                leading-relaxed
                text-ink/70
              "
            >
              Create your account and explore thousands
              of products from independent stores.
            </p>

            {/* PERKS */}
            <ul className="mt-7 flex flex-col gap-3.5">
              {perks.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="
                    flex
                    items-center
                    gap-2.5
                    text-[13px]
                    font-medium
                    text-ink/80
                  "
                >
                  <span
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-brand
                    "
                  >
                    <Icon size={14} />
                  </span>

                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* LEFT BOTTOM TEXT */}
          <div className="relative z-10">
            <div className="mb-3 h-0.5 w-6 bg-white" />

            <p
              className="
                max-w-[320px]
                text-[11px]
                leading-relaxed
                text-white
              "
            >
              Discover unique products, support local sellers,
              and enjoy a simple shopping experience.
            </p>
          </div>
        </section>

        {/* =====================================================
            RIGHT SIGNUP SECTION
        ====================================================== */}
        <section
          className="
            flex
            h-full
            min-h-0
            flex-col
            overflow-hidden
            bg-white
            px-6
            py-5
            sm:px-11
            md:px-14
          "
        >
          {/* =================================================
              HEADER
          ================================================== */}
          <header
            className="
              flex
              w-full
              items-center
              justify-between
              gap-4
              text-[11px]
              text-ink
            "
          >
            {/* NOVACART LOGO */}
            <div className="flex items-center gap-2.5">
              <span
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-brand
                  text-white
                "
              >
                <ShoppingBag
                  size={18}
                  strokeWidth={2.25}
                />
              </span>

              <span
                className="
                  text-lg
                  font-extrabold
                  tracking-tight
                  text-ink
                "
              >
                NovaCart
              </span>
            </div>

            {/* LOGIN */}
            <div className="flex items-center gap-1.5">
              <span>Already have an account?</span>

              <Link
                to="/customer-login"
                className="
                  font-semibold
                  text-brand
                  underline
                  underline-offset-2
                "
              >
                Login
              </Link>
            </div>
          </header>

          {/* =================================================
              SIGNUP CONTENT
          ================================================== */}
          <div
            className="
              mx-auto
              my-auto
              w-full
              max-w-[430px]
              py-4
            "
          >
            {/* TITLE */}
            <div className="mb-5">
              <h2
                className="
                  text-[26px]
                  font-bold
                  tracking-tight
                  text-ink
                "
              >
                Create Customer Account
              </h2>

              <p
                className="
                  mt-1.5
                  text-[11px]
                  leading-relaxed
                  text-gray-500
                "
              >
                Join NovaCart and start shopping from
                independent stores.
              </p>
            </div>

            {/* =================================================
                SIGNUP FORM
            ================================================== */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2.5"
            >
              {/* FULL NAME */}
              <div
                className="
                  flex
                  h-[39px]
                  items-center
                  gap-2.5
                  rounded-md
                  border
                  border-gray-200
                  bg-white
                  px-3
                  transition
                  focus-within:border-brand
                "
              >
                <User
                  size={15}
                  className="text-gray-500"
                />

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="
                    min-w-0
                    w-full
                    border-0
                    bg-transparent
                    text-[11px]
                    text-gray-800
                    outline-none
                    placeholder:text-gray-400
                  "
                />
              </div>

              {/* EMAIL */}
              <div
                className="
                  flex
                  h-[39px]
                  items-center
                  gap-2.5
                  rounded-md
                  border
                  border-gray-200
                  bg-white
                  px-3
                  transition
                  focus-within:border-brand
                "
              >
                <Mail
                  size={15}
                  className="text-gray-500"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="
                    min-w-0
                    w-full
                    border-0
                    bg-transparent
                    text-[11px]
                    text-gray-800
                    outline-none
                    placeholder:text-gray-400
                  "
                />
              </div>

              {/* PHONE */}
              <div
                className="
                  flex
                  h-[39px]
                  items-center
                  gap-2.5
                  rounded-md
                  border
                  border-gray-200
                  bg-white
                  px-3
                  transition
                  focus-within:border-brand
                "
              >
                <Phone
                  size={15}
                  className="text-gray-500"
                />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="
                    min-w-0
                    w-full
                    border-0
                    bg-transparent
                    text-[11px]
                    text-gray-800
                    outline-none
                    placeholder:text-gray-400
                  "
                />
              </div>

              {/* PASSWORD */}
              <div
                className="
                  flex
                  h-[39px]
                  items-center
                  gap-2.5
                  rounded-md
                  border
                  border-gray-200
                  bg-white
                  px-3
                  transition
                  focus-within:border-brand
                "
              >
                <Lock
                  size={15}
                  className="text-gray-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="
                    min-w-0
                    w-full
                    border-0
                    bg-transparent
                    text-[11px]
                    text-gray-800
                    outline-none
                    placeholder:text-gray-400
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <div
                className="
                  flex
                  h-[39px]
                  items-center
                  gap-2.5
                  rounded-md
                  border
                  border-gray-200
                  bg-white
                  px-3
                  transition
                  focus-within:border-brand
                "
              >
                <Lock
                  size={15}
                  className="text-gray-500"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="
                    min-w-0
                    w-full
                    border-0
                    bg-transparent
                    text-[11px]
                    text-gray-800
                    outline-none
                    placeholder:text-gray-400
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  className="text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>
              </div>

              {/* TERMS */}
              <label
                className="
                  mt-1
                  flex
                  items-start
                  gap-2
                  text-[10px]
                  leading-relaxed
                  text-gray-500
                "
              >
                <input
                  type="checkbox"
                  required
                  className="
                    mt-[2px]
                    h-3
                    w-3
                    accent-brand
                  "
                />

                <span>
                  I agree to the{" "}
                  <span className="font-medium text-brand">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="font-medium text-brand">
                    Privacy Policy
                  </span>
                  .
                </span>
              </label>

              {/* CREATE ACCOUNT */}
              <button
                type="submit"
                className="
                  mt-1
                  flex
                  h-[39px]
                  w-full
                  items-center
                  justify-center
                  rounded-md
                  bg-brand
                  text-[11px]
                  font-semibold
                  text-white
                  transition
                  hover:opacity-90
                "
              >
                Create Account

                <span className="ml-1.5 text-sm">
                  →
                </span>
              </button>
            </form>

            {/* =================================================
                DIVIDER
            ================================================== */}
            <div
              className="
                my-4
                flex
                items-center
                gap-3
                text-[10px]
                text-gray-400
              "
            >
              <span className="h-px flex-1 bg-gray-200" />

              <span>or continue with</span>

              <span className="h-px flex-1 bg-gray-200" />
            </div>

            {/* =================================================
                SOCIAL LOGIN
            ================================================== */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* GOOGLE */}
              <button
                type="button"
                className="
                  flex
                  h-[36px]
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  border
                  border-gray-200
                  bg-white
                  text-[10px]
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-50
                "
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4285F4"
                    d="M21.35 12.27c0-.71-.06-1.4-.18-2.06H12v3.9h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.92-4.18 2.92-7.2Z"
                  />

                  <path
                    fill="#34A853"
                    d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.43c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.71-5.46-4.01H3.3v2.5A9.74 9.74 0 0 0 12 21.6Z"
                  />

                  <path
                    fill="#FBBC05"
                    d="M6.54 13.74A5.86 5.86 0 0 1 6.24 12c0-.61.1-1.2.3-1.74v-2.5H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.24l3.24-2.5Z"
                  />

                  <path
                    fill="#EA4335"
                    d="M12 6.25c1.43 0 2.7.49 3.71 1.45l2.78-2.78C16.83 3.39 14.62 2.4 12 2.4a9.74 9.74 0 0 0-8.7 5.36l3.24 2.5c.77-2.3 2.92-4.01 5.46-4.01Z"
                  />
                </svg>

                Google
              </button>

              {/* APPLE */}
              <button
                type="button"
                className="
                  flex
                  h-[36px]
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  border
                  border-gray-200
                  bg-white
                  text-[10px]
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-50
                "
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.05 12.54c0-2.28 1.86-3.37 1.94-3.42a4.17 4.17 0 0 0-3.28-1.77c-1.38-.14-2.7.82-3.4.82-.7 0-1.78-.8-2.93-.78a4.31 4.31 0 0 0-3.63 2.21c-1.57 2.72-.4 6.73 1.1 8.93.74 1.07 1.62 2.27 2.77 2.23 1.1-.04 1.51-.71 2.84-.71 1.32 0 1.69.71 2.84.69 1.18-.02 1.94-1.08 2.67-2.16a8.86 8.86 0 0 0 1.22-2.5c-.03-.01-2.34-.9-2.34-3.54ZM14.8 5.88c.61-.74 1.02-1.77.91-2.8-.88.04-1.94.59-2.57 1.32-.56.65-1.05 1.69-.92 2.68.98.08 1.97-.5 2.58-1.2Z" />
                </svg>

                Apple
              </button>
            </div>

            {/* BOTTOM LOGIN */}
            <p
              className="
                mt-4
                text-center
                text-[10px]
                text-gray-500
              "
            >
              Already registered?{" "}

              <Link
                to="/customer-login"
                className="
                  font-semibold
                  text-brand
                  underline
                  underline-offset-2
                "
              >
                Login here
              </Link>
            </p>

            <Link
              to="/"
              className="customer-signup-back-home"
            >
              ← Back to NovaCart
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CustomerSignup;