import { Link } from "react-router-dom";
import { useState } from "react";
import "./eHistory.css";

const EventHistory = () => {
    const [historyDisplay, setHistoryDisplay] = useState("");

    const volunteerData = [
        { 
            name: "Beach Cleanup", 
            description: "Cleaning up the beach to promote a cleaner environment.", 
            location: "California Beach", 
            skills: "Teamwork, Physical fitness", 
            volunteer: "John Doe", 
            date: "2023-06-15" 
        },
        { 
            name: "Food Drive", 
            description: "Collecting food donations for local shelters.", 
            location: "Community Center", 
            skills: "Organizational skills, Communication", 
            volunteer: "Alice Johnson", 
            date: "2023-07-20" 
        }
    ];

    const viewHistory = () => {
        let tableRows = volunteerData.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>${item.location}</td>
                <td>${item.skills}</td>
                <td>${item.volunteer}</td>
                <td>${item.date}</td>
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
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        `;
        
        setHistoryDisplay(tableHTML);
    };

    return (
        <div className="container">
            <div className="header-container">
                <h1 className="text-4xl font-bold">Event History</h1>
                <div className="eHistory-container">
                    <button
                        id="view-history"
                        onClick={viewHistory}
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