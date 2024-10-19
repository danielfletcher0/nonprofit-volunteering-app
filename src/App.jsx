import React from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./pages/auth/Login";
import UserRegistration from "./pages/auth/Register";
import EventCreation from "./pages/event/event";
import Profile from "./pages/auth/Profile";
import VolunteerHistory from "./pages/history/history";
import VolunteerMatching from "./pages/match/match";
import NotificationSystem from "./components/Notification";
import EventHistory from "./pages/history/ehistory";  
import './App.css';

const App = () => (
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
                        <NavLink to="/" activeClassName="active">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/about" activeClassName="active">About</NavLink>
                    </li>
                    <li>
                        <NavLink to="/login" activeClassName="active">Login</NavLink>
                    </li>
                    <li>
                        <NavLink to="/create" activeClassName="active">Create New Event</NavLink>
                    </li>
                    <li>
                        <NavLink to="/events" activeClassName="active">Event History</NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" activeClassName="active">Profile</NavLink>
                    </li>
                    <li>
                        <NavLink to="/history" activeClassName="active">Volunteer History</NavLink>
                    </li>
                    <li>
                        <NavLink to="/match" activeClassName="active">Volunteer Matching</NavLink>
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

export default App;
