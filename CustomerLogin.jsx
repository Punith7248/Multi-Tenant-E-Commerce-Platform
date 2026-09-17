import "./CustomerLogin.css";

function CustomerLogin() {
    return (
        <main className="customer-login-page">
            <section className="customer-login-left">
                <div className="left-copy">
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

                <div className="left-bottom">
                    <p>
                        Every purchase
                        <br />
                        supports a bigger dream.
                    </p>

                    <div className="left-line"></div>
                </div>
            </section>

            <section className="customer-login-right">
                <header className="login-header">
                    <div className="novacart-logo">
                        <img
                            src="https://i.pinimg.com/originals/f2/ee/cf/f2eecf362d25340b35ffc1a5d99262c7.png"
                            alt="NovaCart logo"
                            className="logo-image"
                        />


                        <span className="logo-name">NovaCart</span>
                    </div>

                    <p>
                        New here?{" "}
                        <a href="#create-account">Create an account</a>
                    </p>
                </header>

                <div className="login-content">
                    <h2>Customer Login</h2>

                    <p className="welcome-text">
                        Welcome back! Glad to see you again.
                    </p>

                    <form className="login-form">
                        <div className="input-box">
                            <span>✉</span>

                            <input
                                type="email"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="input-box">
                            <span>♙</span>

                            <input
                                type="password"
                                placeholder="Enter your password"
                            />

                            <button type="button" className="password-button">
                                ◉
                            </button>
                        </div>

                        <div className="form-options">
                            <label>
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>

                            <a href="#forgot-password">Forgot password?</a>
                        </div>

                        <button type="submit" className="login-button">
                            Login <span>→</span>
                        </button>
                    </form>

                    <div className="continue-divider">
                        <span>or continue with</span>
                    </div>

                    <div className="social-buttons">
                        <button type="button">
                            <span className="google-symbol">G</span>
                            Google
                        </button>

                        <button type="button">
                            <span className="apple-symbol">●</span>
                            Apple
                        </button>
                    </div>

                    <div className="signup-card" id="create-account">
                        <div className="gift-box">🎁</div>

                        <div className="signup-text">
                            <strong>New to NovaCart?</strong>
                            <p>Create your customer account</p>
                        </div>

                        <span className="signup-arrow">→</span>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default CustomerLogin;