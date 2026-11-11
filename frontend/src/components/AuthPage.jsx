import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function getErrorMessage(error) {
    return error.response?.data?.detail
        || error.response?.data?.message
        || "Unable to connect. Check that the server is running and try again.";
}

function AuthPage() {
    const isRegister = useLocation().pathname === "/register";
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, login, register } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            if (isRegister) {
                await register({ username: username.trim(), email: email.trim(), password });
                navigate("/login", {
                    replace: true,
                    state: { message: "Account created. Sign in with your email and password." },
                });
            } else {
                await login({ email: email.trim(), password });
                navigate(location.state?.from?.pathname || "/", { replace: true });
            }
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-card" aria-labelledby="auth-title">
                <div className="auth-brand-mark" aria-hidden="true">JT</div>
                <p className="auth-eyebrow">JOB APPLICATION TRACKER</p>
                <h1 id="auth-title">{isRegister ? "Create your account" : "Welcome back"}</h1>
                <p className="auth-description">
                    {isRegister
                        ? "Sign up to start organizing your job search."
                        : "Sign in to continue to your applications."}
                </p>
                {!isRegister && location.state?.message && (
                    <p className="auth-success" role="status">{location.state.message}</p>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {isRegister && <>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            maxLength={100}
                            required
                        />
                    </>}

                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        maxLength={254}
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete={isRegister ? "new-password" : "current-password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        minLength={8}
                        maxLength={72}
                        required
                    />
                    {isRegister && <span className="auth-hint">Use at least 8 characters.</span>}

                    {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}

                    <button className="auth-submit" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
                    </button>
                </form>

                <p className="auth-switch">
                    {isRegister ? "Already have an account?" : "New to Job Application Tracker?"}{" "}
                    <Link to={isRegister ? "/login" : "/register"}>
                        {isRegister ? "Sign in" : "Create an account"}
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default AuthPage;
