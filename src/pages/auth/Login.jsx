import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./style.css";
import axios from "axios";

function LoginPage() {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const { setIsLoggedIn, setUsername } = useAuth("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:4000/login",
                credentials
            );
            const { redirectTo, message } = response.data;
            setMessage(message);
            setIsSuccess(true);
            setUsername(credentials.username);
            setIsLoggedIn(true);
            navigate(redirectTo || "/");
        } catch (error) {
            setMessage("Invalid username or password");
            setIsSuccess(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="logo-section">
                <img src="logo.png" alt="CougarCare Logo" className="logo" />
                <h1>CougarCare</h1>
            </div>
            <h2>Log in to your account</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    className="input-field"
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="input-field"
                    required
                />
                <button type="submit" className="submit-button">
                    Sign in
                </button>
            </form>
            <p className="signup-prompt">
                Don't have an account?{" "}
                <a href="/signup" className="signup-link">
                    Sign up
                </a>
            </p>
            {message && (
                <p
                    className={
                        isSuccess
                            ? "auth-success-message"
                            : "auth-error-message"
                    }
                >
                    {message}
                </p>
            )}
        </div>
    );
}

export default LoginPage;
