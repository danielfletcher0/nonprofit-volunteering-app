import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./style.css";
import axios from "axios";

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const { setIsLoggedIn, setUsername } = useAuth("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:4000/register",
                formData
            );
            const { redirectTo, message } = response.data;
            setMessage(message);
            setIsSuccess(true);
            setUsername(formData.username);
            setIsLoggedIn(true);
            navigate(redirectTo || "/");
        } catch (error) {
            setMessage(
                error.response
                    ? error.response.data.message[0]
                    : "Registration failed"
            );
            setIsSuccess(false);
            setIsLoggedIn(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="logo-section">
                <img src="logo.png" alt="CougarCare Logo" className="logo" />
                <h1>CougarCare</h1>
            </div>
            <h2>Register your account</h2>
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
                    Register
                </button>
            </form>
            <p className="signup-prompt">
                Already have an account?{" "}
                <a href="/login" className="signup-link">
                    Sign in
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

export default RegisterPage;
