import { useState } from "react";
import axios from "axios"; 
import "./history.css";

const VolunteerHistory = () => {
    const [selectedVolunteer, setSelectedVolunteer] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [historyDisplay, setHistoryDisplay] = useState("");

    const showSuggestions = async (value) => {
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
        document.getElementById('view-history').disabled = false;
    };

    const viewHistory = async () => {
        if (selectedVolunteer) {
            try {
                const response = await axios.get(`http://localhost:4000/history/volunteers`);
                const historyItems = response.data;

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
            const inputValue = e.target.value;
            if (suggestions.includes(inputValue)) {
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
                <link rel="stylesheet" href="history.css" />
                <title>Volunteer History</title>
            </head>

            <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
                <h1 className="text-4xl font-bold">Volunteer History</h1>
            </div>

            <div className="form-group">
                <label htmlFor="volunteer-name">Volunteer Name:</label>
                <input
                    type="text"
                    id="volunteer-name"
                    onInput={(e) => showSuggestions(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a name"
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