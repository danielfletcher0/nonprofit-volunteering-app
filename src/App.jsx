import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    NavLink,
} from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./pages/auth/Login";
import UserRegistration from "./pages/auth/Register";
import EventCreation from "./pages/event/event";
import Profile from "./pages/auth/Profile";
import VolunteerHistory from "./pages/history/history";
import VolunteerMatching from "./pages/match/match";
import NotificationSystem from "./components/Notification";
import EventHistory from "./pages/event-history/eHistory";
import "./App.css";
import { useAuth } from "./pages/auth/AuthContext";

const App = () => {
    const { isLoggedIn } = useAuth();
    const { username } = useAuth("");

    return (
        <Router>
            <div className="page-container">
                <nav>
                    <img
                        src="/logo.png"
                        alt="CougarCare Logo"
                        className="logo"
                    />
                    <h1 className="header-title">CougarCare</h1>
                    <ul>
                        <li>
                            <NavLink to="/" activeclassname="active">
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about" activeclassname="active">
                                About
                            </NavLink>
                        </li>
                        <li
                            className={`auth-login-nav ${
                                isLoggedIn ? "hidden" : ""
                            }`}
                        >
                            <NavLink to="/login" activeclassname="active">
                                Login
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/create" activeclassname="active">
                                Create New Event
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/events" activeclassname="active">
                                Event History
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile" activeclassname="active">
                                Profile
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/history" activeclassname="active">
                                Volunteer History
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/match" activeclassname="active">
                                Volunteer Matching
                            </NavLink>
                        </li>
                        <li
                            className={`auth-login-nav ${
                                !isLoggedIn ? "hidden" : ""
                            }`}
                        >
                            <div className="username-display">
                                {username}
                                <br />
                                <a href="/" className={"logout-option"}>
                                    Log out
                                </a>
                            </div>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<UserRegistration />} />
                    <Route path="/create" element={<EventCreation />} />
                    <Route path="/events" element={<EventHistory />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/history" element={<VolunteerHistory />} />
                    <Route path="/match" element={<VolunteerMatching />} />
                </Routes>
                <NotificationSystem />
            </div>
        </Router>
    );
};

export default App;
