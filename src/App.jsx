import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./pages/auth/Login";
import UserRegistration from "./pages/auth/Register";
import EventCreation from "./pages/event/event";
import Profile from "./pages/auth/profile";
import VolunteerHistory from "./pages/history/history";
import VolunteerMatching from "./pages/match/match";

const App = () => (
    <Router>
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>

                    <li>
                        <Link to ='/create'>Create New Event</Link>
                    </li>

                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>

                    <li>
                        <Link to="/history">Volunteer History</Link>
                    </li>

                    <li>
                        <Link to="/match">Volunteer Matching</Link>
                    </li>

                </ul>
            </nav>
        </div>
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<UserRegistration />} />
            <Route path='/create' element={<EventCreation />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<VolunteerHistory />} />
            <Route path="/match" element={<VolunteerMatching />} />
        </Routes>
    </Router>
);

export default App;
