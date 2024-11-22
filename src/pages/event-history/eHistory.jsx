import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./eHistory.css";

const EventHistory = () => {
    const [historyDisplay, setHistoryDisplay] = useState("");

    // Fetch event history data from the backend
    const fetchEventHistory = async () => {
        try {
            const response = await fetch("http://localhost:4000/event-history/history");
            if (!response.ok) {
                throw new Error("Failed to fetch event history");
            }
            const volunteerData = await response.json();
            // Convert data into HTML table rows
            let tableRows = volunteerData.map(item => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>${item.location}</td>
                    <td>${item.skills}</td>
                    <td>${item.volunteer}</td>
                    <td>${item.date}</td>
                    <td>${item.urgency}</td>
                </tr>
            `).join('');

            const tableHTML = `
                <h2>Event History</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Description</th>
                            <th>Location</th>
                            <th>Skills</th>
                            <th>Volunteer</th>
                            <th>Date</th>
                            <th>Urgency</th>
                        </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>
            `;
            
            setHistoryDisplay(tableHTML);
        } catch (error) {
            console.error("Error fetching event history:", error);
            alert("Could not load event history.");
        }
    };

    return (
        <div className="container">
            <div className="header-container">
                <h1 className="text-4xl font-bold">Event History</h1>
                <div className="eHistory-container">
                    <button
                        id="view-history"
                        onClick={fetchEventHistory} // Call fetchEventHistory on button click
                    >
                        Load Events
                    </button>
                </div>
            </div>
            <div
                id="history-display"
                style={{ marginTop: '2rem' }}
                dangerouslySetInnerHTML={{ __html: historyDisplay }}
            />
        </div>
    );
};

export default EventHistory;