import React from "react";
import { useAuth } from "../pages/auth/AuthContext";
import "../index.css"; // Ensure this is the correct path

const Home = () => {
    const { username } = useAuth("");

    return (
        <div className="home-layout">
            <h1 className="text-center">Home Page</h1>

            <div className="container">
                <h1>
                    Welcome to the website's Home Page{" "}
                    <span className={username ? "username" : ""}>
                        {username || "Guest"}!
                    </span>
                    <br />
                    Edit main.jsx to edit HTML on the home page
                    <br />
                    Edit index.css to style this
                    <br />
                    Base Root is in SRC
                </h1>
            </div>
        </div>
    );
};

export default Home;
