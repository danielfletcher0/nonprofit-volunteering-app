import { Link } from "react-router-dom";
import { useState } from "react";
import "./history.css";

const EventHistory = () => 
{
    const volunteerData = {
        "Event List": [  
            { name: "Beach Cleanup", 
                description: "Cleaning up the beach to promote a cleaner environment.", 
                location: "California Beach", 
                skills: "Teamwork, Physical fitness", 
                volunteer: "John Doe", 
                date: "2023-06-15" },
            { name: "Food Drive", 
                description: "Collecting food donations for local shelters.", 
                location: "Community Center", 
                skills: "Organizational skills, Communication", 
                volunteer: "Alice Johnson", 
                date: "2023-07-20" }
        ],
    };

    const viewHistory = () =>{;

                    let tableHTML = `<h2>Ongoing Events</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Event Description</th>
                                <th>Location</th>
                                <th>Skills</th>
                                <th>Volunteer</th>
                                <th>Event Date</th>
                            </tr>
                        </thead>
                        <tbody>`;

                    volunteerData.forEach(item => {
                        tableHTML += `<tr>
                            <td>${item.name}</td>
                            <td>${item.description}</td>
                            <td>${item.location}</td>
                            <td>${item.skills}</td>
                            <td>${item.volunteer}</td>
                            <td>${item.date}</td>
                        </tr>`;
                    });

                    tableHTML += `</tbody></table>`;
                    setHistoryDisplay(tableHTML);
                };
    return (
        <div className="container">
            <head>
                <link rel="stylesheet" href="history.css"></link>
                <title>Event History</title>
            </head>

            {/* Title Section */}
            <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
                <h1 className="text-4xl font-bold">Event History</h1>
            </div>

            <button
                id="view-history"
                style={{ marginTop: '1rem' }}
                onClick={viewHistory}
                disabled={!selectedVolunteer}
            >
                Load Events
            </button>

            <div
                id="history-display"
                style={{ marginTop: '2rem' }}
                dangerouslySetInnerHTML={{ __html: historyDisplay }}
            />
        </div>
    );
};

export default EventHistory;
