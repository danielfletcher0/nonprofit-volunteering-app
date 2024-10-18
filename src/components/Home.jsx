import React from "react";
import '../index.css'; // Ensure this is the correct path

const Home = () => (
    <div className="home-layout"> {/* Apply the new class here */}
        <h1 className="text-center">Home Page</h1>

        <div className="container">
            <h1>
                Welcome to the website's Home Page!
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

export default Home;
