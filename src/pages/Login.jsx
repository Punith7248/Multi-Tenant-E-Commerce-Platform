import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  setEmail,
  setPassword,
  toggleRememberMe,
  toggleShowPassword,
  loginStart,
  loginSuccess,
  loginFailure,
} from "../store/authSlice";
import BrandPanel from "../components/BrandPanel";
import { GoogleIcon, AppleIcon } from "../components/BrandIcons";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, password, rememberMe, showPassword, status, error } =
    useSelector((state) => state.auth);

  const [touched, setTouched] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);

    if (!email || !password) {
      dispatch(loginFailure("Please enter both your email and password."));
      return;
    }

    dispatch(loginStart());

    // Simulated auth call — swap this for a real API request.
    setTimeout(() => {
      dispatch(loginSuccess({ email }));
      navigate("/dashboard");
    }, 700);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-8">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <BrandPanel
          heading="For People Who Love Great Choices."
          subheading="Shop from thousands of independent stores in one place."
          // footer="Every purchase supports a bigger dream."
          footer={`Every purchase
supports a bigger dream.`}
        />

        <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-sm">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M6 8h12l1 13H5L6 8Z" />
                    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                  </svg>
                </span>
                <span className="text-lg font-bold text-gray-900">NovaCart</span>
              </div>
              <p className="text-sm text-gray-500">
                New here?{" "}
                <Link
                  to="/create-account"
                  className="font-medium text-brand-600 hover:text-brand-700"
                >
                  Create an account
                </Link>
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900">Customer Login</h2>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Glad to see you again.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    ✉️
                  </span>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => dispatch(setEmail(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    🔒
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => dispatch(setPassword(e.target.value))}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                  <button
                    type="button"
                    onClick={() => dispatch(toggleShowPassword())}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {touched && error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => dispatch(toggleRememberMe())}
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  Remember me
                </label>
                <a href="#" className="font-medium text-brand-600 hover:text-brand-700">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading" ? "Logging in..." : "Login →"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-gray-400">
              <div className="h-px flex-1 bg-gray-200" />
              or continue with
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <GoogleIcon className="h-5 w-5" /> Google
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <AppleIcon className="h-5 w-5" /> Apple
              </button>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-xl bg-brand-50 p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-lg">
                🎁
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  New to NovaCart?
                </p>
                <Link
                  to="/create-account"
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  Create your customer account
                </Link>
              </div>
              <span className="text-brand-600">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
