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
            console.log(volunteers); // Debug log
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
            console.log("Selected Volunteer:", selectedVolunteer); // Debug log
            try {
                const response = await axios.get(`http://localhost:4000/history/${encodeURIComponent(selectedVolunteer)}`);
                const historyItems = response.data;

                console.log("History Items:", historyItems); // Debug log for history items

                if (historyItems.length === 0) {
                    setHistoryDisplay(`<h2>History for ${selectedVolunteer}</h2><p>No participation history found.</p>`);
                } else {
                    const tableRows = historyItems.map(item => `
                        <tr>
                            <td>${item.event_name}</td>
                            <td>${item.description}</td>
                            <td>${item.location}</td>
                            <td>${item.skills}</td>
                            <td>${new Date(item.date).toLocaleDateString()}</td>
                        </tr>
                    `).join('');
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
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    `);
                }
            } catch (error) {
                console.error("Error fetching history:", error); // Debug log
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