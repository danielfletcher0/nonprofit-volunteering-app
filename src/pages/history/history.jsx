import { Link } from "react-router-dom";
import { useState } from "react";
import "./history.css";

const VolunteerHistory = () => {
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

    const [selectedVolunteer, setSelectedVolunteer] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [historyDisplay, setHistoryDisplay] = useState("");

    const showSuggestions = (value) => {
        const matches = Object.keys(volunteerData).filter(name => name.toLowerCase().includes(value.toLowerCase()));
        setSuggestions(matches);
    };

    const selectVolunteer = (volunteer) => {
        setSelectedVolunteer(volunteer);
        document.getElementById('volunteer-name').value = volunteer; // Fill input with the selected name
        setSuggestions([]); // Clear suggestions
        document.getElementById('view-history').disabled = false;
    };

    const viewHistory = () => {
        if (selectedVolunteer) {
            const historyItems = volunteerData[selectedVolunteer];

            if (historyItems) {
                if (historyItems.length === 0) {
                    setHistoryDisplay(`<h2>History for ${selectedVolunteer}</h2><p>No participation history found.</p>`);
                } else {
                    let tableHTML = `<h2>History for ${selectedVolunteer}</h2><table>
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Event Description</th>
                                <th>Location</th>
                                <th>Required Skills</th>
                                <th>Event Date</th>
                            </tr>
                        </thead>
                        <tbody>`;

                    historyItems.forEach(item => {
                        tableHTML += `<tr>
                            <td>${item.name}</td>
                            <td>${item.description}</td>
                            <td>${item.location}</td>
                            <td>${item.skills}</td>
                            <td>${item.date}</td>
                        </tr>`;
                    });

                    tableHTML += `</tbody></table>`;
                    setHistoryDisplay(tableHTML);
                }
            } else {
                setHistoryDisplay(`<h2>Volunteer Not Found</h2>`);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const inputValue = e.target.value;
            if (inputValue in volunteerData) {
                selectVolunteer(inputValue);
                viewHistory();
            } else {
                setHistoryDisplay(`<h2>Volunteer Not Found</h2>`);
            }
        }
    };

    return (
        <div className="container">
            <head>
                <link rel="stylesheet" href="history.css"></link>
                <title>Volunteer History</title>
            </head>

            <div className="form-group">
                <label htmlFor="volunteer-name">Volunteer Name:</label>
                <input
                    type="text"
                    id="volunteer-name"
                    onInput={(e) => {
                        showSuggestions(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a name (e.g., John Doe, Jane Smith, Alice Johnson)"
                />
                <div id="suggestions" className="suggestions">
                    {suggestions.map((name) => (
                        <div key={name} className="suggestion-item" onClick={() => selectVolunteer(name)}>
                            {name}
                        </div>
                    ))}
                </div>
            </div>

            <button
                id="view-history"
                style={{ marginTop: '1rem' }}
                onClick={viewHistory}
                disabled={!selectedVolunteer}
            >
                View History
            </button>

            <div
                id="history-display"
                style={{ marginTop: '2rem' }}
                dangerouslySetInnerHTML={{ __html: historyDisplay }}
            />
        </div>
    );
};

export default VolunteerHistory;
