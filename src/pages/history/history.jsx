import { useState } from "react";
import axios from "axios";
import "./history.css";

const VolunteerHistory = () => {
    const [selectedVolunteer, setSelectedVolunteer] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [historyDisplay, setHistoryDisplay] = useState("");

    const showSuggestions = async (value) => {
        if (!value) {
            setSuggestions([]); // Clear suggestions if input is empty
            return;
        }

        try {
            const response = await axios.get('http://localhost:4000/history/volunteers');
            const volunteers = response.data;
            const matches = volunteers.filter(name => name.toLowerCase().includes(value.toLowerCase()));
            setSuggestions(matches);
        } catch (error) {
            console.error('Error fetching volunteer suggestions:', error);
        }
    };

    const selectVolunteer = (volunteer) => {
        setSelectedVolunteer(volunteer);
        document.getElementById('volunteer-name').value = volunteer;
        setSuggestions([]);
    };

    const viewHistory = async () => {
        if (selectedVolunteer) {
            try {
                const response = await axios.get(`http://localhost:4000/history/${encodeURIComponent(selectedVolunteer)}`);
                const historyItems = response.data;

                if (historyItems.length === 0) {
                    setHistoryDisplay(`<h2>History for ${selectedVolunteer}</h2><p>No participation history found.</p>`);
                } else {
                    const today = new Date();
                    const tableRows = historyItems.map(item => {
                        const eventDate = new Date(item.date);
                        let status = 'completed';
                        let circleColor = 'green'; // Default color for completed

                        if (eventDate > today) {
                            status = 'upcoming';
                            circleColor = 'orange'; // Color for upcoming
                        } else if (eventDate.toDateString() === today.toDateString()) {
                            status = 'ongoing';
                            circleColor = 'blue'; // Color for ongoing
                        }

                        return `
                            <tr>
                                <td>${item.event_name}</td>
                                <td>${item.description}</td>
                                <td>${item.location}</td>
                                <td>${item.skills}</td>
                                <td>${eventDate.toLocaleDateString()}</td>
                                <td>
                                    <span class="status-circle" style="background-color: ${circleColor};"></span> 
                                    ${status}
                                </td> <!-- Status column with colored circle -->
                            </tr>
                        `;
                    }).join('');
                    setHistoryDisplay(`
                        <h2>History for ${selectedVolunteer}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Location</th>
                                    <th>Skills</th>
                                    <th>Date</th>
                                    <th>Status</th> <!-- New header for status -->
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    `);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setHistoryDisplay(`<h2>Volunteer Not Found</h2>`);
                } else {
                    setHistoryDisplay(`<h2>Error retrieving history</h2>`);
                }
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const inputValue = e.target.value.trim();
            if (inputValue) {
                setSelectedVolunteer(inputValue);
                viewHistory();
            }
        }
    };

    return (
        <div className="container">
            <h1 className="text-4xl font-bold">Volunteer History</h1>
            <div className="form-group">
                <label htmlFor="volunteer-name">Volunteer Name:</label>
                <input
                    type="text"
                    id="volunteer-name"
                    onInput={(e) => showSuggestions(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a name (e.g., John Doe, Jane Smith, Alice Johnson)"
                />
                {suggestions.length > 0 && (
                    <ul className="suggestions-dropdown show">
                        {suggestions.map(name => (
                            <li key={name} className="suggestion-item" onClick={() => selectVolunteer(name)}>
                                {name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button
                id="view-history"
                onClick={viewHistory}
                disabled={!selectedVolunteer}
            >
                View History
            </button>

            <div
                id="history-display"
                dangerouslySetInnerHTML={{ __html: historyDisplay }}
            />
        </div>
    );
};

export default VolunteerHistory;