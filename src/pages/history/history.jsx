import { useState } from "react";
import { Link } from "react-router-dom";
import "./history.css";
import React from 'react';

const volunteerData = {
    "John Doe": [
        { name: "Beach Cleanup", description: "Cleaning up the beach to promote a cleaner environment.", location: "California Beach", skills: "Teamwork, Physical fitness", date: "2023-06-15" },
        { name: "Food Drive", description: "Collecting food donations for local shelters.", location: "Community Center", skills: "Organizational skills, Communication", date: "2023-07-20" }
    ],
    "Jane Smith": [], // No participation
    "Alice Johnson": [
        { name: "Park Renovation", description: "Renovating the local park with new facilities.", location: "Central Park", skills: "Landscaping, Painting", date: "2023-08-10" }
    ],
};

const VolunteerHistory = () => {
    const [selectedVolunteer, setSelectedVolunteer] = useState("");
    const [historyDisplay, setHistoryDisplay] = useState(null);

    const showSuggestions = (value) => {
        const matches = Object.keys(volunteerData).filter(name => name.toLowerCase().includes(value.toLowerCase()));
        const suggestions = matches.map(name => (
            <div key={name} className='suggestion-item' onClick={() => selectVolunteer(name)}>
                {name}
            </div>
        ));

        return suggestions.length > 0 ? suggestions : <div>No suggestions</div>;
    };

    const selectVolunteer = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setHistoryDisplay(null); // Reset history display
    };

    const viewHistory = () => {
        if (selectedVolunteer) {
            const historyItems = volunteerData[selectedVolunteer];

            if (historyItems.length === 0) {
                setHistoryDisplay(
                    <div>
                        <h2>History for {selectedVolunteer}</h2>
                        <p>No participation history found.</p>
                    </div>
                );
                return;
            }

            setHistoryDisplay(
                <div>
                    <h2>History for {selectedVolunteer}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Event Description</th>
                                <th>Location</th>
                                <th>Required Skills</th>
                                <th>Event Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyItems.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.location}</td>
                                    <td>{item.skills}</td>
                                    <td>{item.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
    };

    return (
        <div>
            <h1>View Volunteer History</h1>
            <div className="form-group">
                <label htmlFor="volunteer-name">Volunteer Name:</label>
                <input
                    type="text"
                    id="volunteer-name"
                    onInput={e => {
                        setHistoryDisplay(null); // Reset display
                        showSuggestions(e.target.value);
                    }}
                    placeholder="Type a name"
                />
                <div id="suggestions" className="suggestions">
                    {showSuggestions(document.getElementById('volunteer-name')?.value || "")}
                </div>
            </div>
            <button id="view-history" style={{ marginTop: '1rem' }} onClick={viewHistory} disabled={!selectedVolunteer}>
                View History
            </button>
            <div id="history-display" style={{ marginTop: '2rem' }}>
                {historyDisplay}
            </div>
        </div>
    );
};

export default VolunteerHistory;
