import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  CreditCard,
  Truck,
  Users,
} from "lucide-react";
import {
  setFullName,
  setEmail,
  setPhone,
  setPassword,
  setConfirmPassword,
  toggleShowPassword,
  toggleShowConfirmPassword,
  registerCustomer,
} from "../features/signup/signupSlice";
import signupBg from "../assets/signup-bg.jpeg";

const perks = [
  { icon: ShieldCheck, label: "Exclusive Deals" },
  { icon: CreditCard, label: "Secure Payments" },
  { icon: Truck, label: "Track Your Orders" },
  { icon: Users, label: "Support Small Businesses" },
];

function CustomerSignup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    fullName,
    email,
    phone,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    status,
    error,
  } = useSelector((state) => state.signup);

  const isLoading = status === "loading";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return; // a real app would surface a proper field-level error here
    }

    const result = await dispatch(
      registerCustomer({ fullName, email, phone, password })
    );
    if (registerCustomer.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  const passwordsDontMatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <main className="min-h-screen bg-gray-100 p-1 sm:p-2 md:h-screen md:overflow-hidden">
      <div className="grid min-h-[calc(100vh-0.5rem)] grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-sm md:h-[calc(100vh-1rem)] md:grid-cols-[42%_58%]">
        {/* LEFT PANEL */}
        <section
          className="relative flex min-h-[420px] flex-col justify-between overflow-hidden bg-cover bg-right px-9 py-9 md:h-full md:px-12 md:py-11"
          style={{
            backgroundImage: `url(${signupBg})`,
          }}
        >
          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
                <ShoppingBag size={18} strokeWidth={2.25} />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-ink">
                NovaCart
              </span>
            </div>

            <h1 className="max-w-xs text-[28px] font-bold leading-[1.2] tracking-tight text-ink sm:text-[32px]">
              Join a community that shops better.
            </h1>

            <div className="my-4 h-0.5 w-6 bg-ink" />

            <p className="max-w-[280px] text-[13px] leading-relaxed text-ink/70">
              Create your account and explore thousands of products from
              independent stores.
            </p>

            <ul className="mt-7 flex flex-col gap-3.5">
              {perks.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 text-[13px] font-medium text-ink/80"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand shadow-sm">
                    <Icon size={14} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="flex min-h-full flex-col overflow-y-auto bg-white px-6 py-7 sm:px-11 md:h-full md:px-14">
          <header className="flex w-full items-center justify-end gap-2 text-[11px] text-ink">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="font-medium text-brand underline underline-offset-2"
            >
              Login
            </Link>
          </header>

          <div className="mx-auto mt-6 w-full max-w-[430px] flex-1">
            <h2 className="text-[26px] font-bold tracking-tight text-ink">
              Create Customer Account
            </h2>
            <p className="mb-6 mt-2 text-[13px] text-gray-500">
              Join NovaCart and start your shopping journey.
            </p>

            {error && (
              <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-600">
                {error}
              </p>
            )}

            <form className="flex flex-col gap-2.5" onSubmit={handleSubmit}>
              <label className="flex h-11 items-center gap-2.5 rounded-md border border-gray-200 px-3 focus-within:border-brand">
                <User size={16} className="text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => dispatch(setFullName(e.target.value))}
                  className="w-full min-w-0 border-none bg-transparent text-[13px] text-ink outline-none placeholder:text-gray-400"
                />
              </label>

              <label className="flex h-11 items-center gap-2.5 rounded-md border border-gray-200 px-3 focus-within:border-brand">
                <Mail size={16} className="text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => dispatch(setEmail(e.target.value))}
                  className="w-full min-w-0 border-none bg-transparent text-[13px] text-ink outline-none placeholder:text-gray-400"
                />
              </label>

              <label className="flex h-11 items-center gap-2.5 rounded-md border border-gray-200 px-3 focus-within:border-brand">
                <Phone size={16} className="text-gray-400" />
                <input
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={phone}
                  onChange={(e) => dispatch(setPhone(e.target.value))}
                  className="w-full min-w-0 border-none bg-transparent text-[13px] text-ink outline-none placeholder:text-gray-400"
                />
              </label>

              <label className="flex h-11 items-center gap-2.5 rounded-md border border-gray-200 px-3 focus-within:border-brand">
                <Lock size={16} className="text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => dispatch(setPassword(e.target.value))}
                  className="w-full min-w-0 border-none bg-transparent text-[13px] text-ink outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => dispatch(toggleShowPassword())}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </label>

              <label
                className={`flex h-11 items-center gap-2.5 rounded-md border px-3 focus-within:border-brand ${passwordsDontMatch ? "border-red-300" : "border-gray-200"
                  }`}
              >
                <Lock size={16} className="text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) =>
                    dispatch(setConfirmPassword(e.target.value))
                  }
                  className="w-full min-w-0 border-none bg-transparent text-[13px] text-ink outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => dispatch(toggleShowConfirmPassword())}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </label>

              {passwordsDontMatch && (
                <p className="text-[11px] text-red-500">
                  Passwords don't match.
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 flex h-11 items-center justify-center gap-2 rounded-md bg-brand text-[13px] font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
              >
                {isLoading ? "Creating account..." : "Create Account"}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-[11px] text-gray-400">
              <span className="h-px flex-1 bg-gray-200" />
              or sign up with
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            {/* <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                className="flex h-11 items-center justify-center gap-2 rounded-md border border-gray-200 text-[13px] text-ink hover:bg-gray-50"
              >
                <span className="text-base font-bold text-[#4285f4]">G</span>
                Google
              </button>
              <button
                type="button"
                className="flex h-11 items-center justify-center gap-2 rounded-md border border-gray-200 text-[13px] text-ink hover:bg-gray-50"
              >
                <span className="text-base"></span>
                Apple
              </button>
            </div> */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                className="flex h-11 items-center justify-center gap-2 rounded-md border border-gray-200 text-[13px] text-ink hover:bg-gray-50"
              >
                <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.617z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex h-11 items-center justify-center gap-2 rounded-md border border-gray-200 text-[13px] text-ink hover:bg-gray-50"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 384 512"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
                Apple
              </button>
            </div>

            <p className="mt-5 text-center text-[11px] leading-relaxed text-gray-400">
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="text-brand underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-brand underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default CustomerSignup;