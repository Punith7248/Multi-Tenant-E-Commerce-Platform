import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

import signin from "../assets/signin.png";
import "./CustomerLogin.css";
import { api, setAuth } from "../api";

function CustomerLogin() {
    const nav = useNavigate();

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await api("/auth/customer/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            setAuth(data);
            nav("/customer");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="customer-login-page">

            {/* LEFT SIDE */}
            <section
                className="relative flex min-h-[420px] flex-col justify-between overflow-hidden bg-cover bg-right px-9 py-9 md:h-full md:px-12 md:py-11"
                style={{
                    backgroundImage: `url(${signin})`,
                }}
            >
                <div className="absolute inset-0 bg-black/20"></div>

                <div className="relative z-10 left-copy">
                    <h1>
                        For People
                        <br />
                        Who Love
                        <br />
                        Great Choices.
                    </h1>

                    <div className="left-line"></div>

                    <p>
                        Shop from thousands
                        <br />
                        of independent stores
                        <br />
                        in one place.
                    </p>
                </div>

                <div className="relative z-10 bottom">

                    <div className="left-line"></div>
                </div>
            </section>


            {/* RIGHT SIDE */}
            <section className="customer-login-right">

                {/* HEADER */}
                <header className="login-header">

                    {/* NOVACART LOGO */}
                    <div className="novacart-logo">

                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
                            <ShoppingBag
                                size={18}
                                strokeWidth={2.25}
                            />
                        </span>

                        <span className="logo-name">
                            NovaCart
                        </span>

                    </div>


                    {/* CREATE ACCOUNT */}
                    <p>
                        New here?{" "}

                        <button
                            type="button"
                            onClick={() => nav("/customer-signup")}
                            className="create-account-link"
                        >
                            Create an account
                        </button>
                    </p>

                </header>


                {/* LOGIN CONTENT */}
                <div className="login-content">

                    <h2>
                        Customer Login
                    </h2>

                    <p className="welcome-text">
                        Welcome back! Glad to see you again.
                    </p>


                    {/* LOGIN FORM */}
                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >

                        {/* EMAIL */}
                        <div className="input-box">

                            <span>✉</span>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />

                        </div>


                        {/* PASSWORD */}
                        <div className="input-box">

                            <span>♙</span>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />

                            <button
                                type="button"
                                className="password-button"
                            >
                                ◉
                            </button>

                        </div>


                        {error && <p style={{ color: "#c33c4d", fontSize: 12, margin: "4px 0" }}>{error}</p>}

                        {/* FORM OPTIONS */}
                        <div className="form-options">

                            <label>

                                <input
                                    type="checkbox"
                                />

                                <span>
                                    Remember me
                                </span>

                            </label>

                            <a href="#forgot-password">
                                Forgot password?
                            </a>

                        </div>


                        {/* LOGIN BUTTON */}
                        <button
                            type="submit"
                            className="login-button"
                        >
                            {loading ? "Signing in..." : "Login"}
                            <span>→</span>
                        </button>

                    </form>


                    {/* DIVIDER */}
                    <div className="continue-divider">

                        <span>
                            or continue with
                        </span>

                    </div>


                    {/* SOCIAL LOGIN */}
                    <div className="social-buttons">

                        {/* GOOGLE */}
                        <button type="button">

                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    fill="#4285F4"
                                    d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.45a5.5 5.5 0 0 1-2.39 3.61v3h3.87c2.27-2.09 3.56-5.17 3.56-8.64Z"
                                />

                                <path
                                    fill="#34A853"
                                    d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.87-3c-1.07.72-2.44 1.14-4.06 1.14-3.13 0-5.78-2.11-6.73-4.95H1.27v3.09A12 12 0 0 0 12 24Z"
                                />

                                <path
                                    fill="#FBBC05"
                                    d="M5.27 14.29A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.29V6.62H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.38l4-3.09Z"
                                />

                                <path
                                    fill="#EA4335"
                                    d="M12 4.76c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.94 1.14 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4 3.09C5.22 6.87 7.87 4.76 12 4.76Z"
                                />
                            </svg>

                            Google

                        </button>


                        {/* APPLE */}
                        <button type="button">

                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.31-1.33-3.14-2.57-1.71-2.48-3.02-7.01-1.26-10.05.87-1.52 2.34-2.48 3.96-2.51 1.27-.02 2.47.87 3.23.87.76 0 2.18-1.08 3.67-.92.62.03 2.36.25 3.48 1.9-.09.06-2.07 1.21-2.05 3.59.03 2.85 2.5 3.81 2.53 3.82-.02.07-.4 1.36-1.31 2.71ZM15.53 5.16c.68-.82 1.14-1.97 1.01-3.16-.98.04-2.17.65-2.88 1.47-.63.73-1.18 1.9-1.03 3.02 1.1.08 2.22-.56 2.9-1.33Z" />
                            </svg>

                            Apple

                        </button>

                    </div>

                    <Link to="/" className="customer-back-home bottom-back-home">← Back to NovaCart</Link>

                </div>

            </section>

        </main>
    );
}

export default CustomerLogin;