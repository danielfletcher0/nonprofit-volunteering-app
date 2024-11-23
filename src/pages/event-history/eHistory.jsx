import { useState, useEffect } from "react";
import Papa from "papaparse"; // Import papaparse for CSV
import jsPDF from "jspdf"; // Import jsPDF for PDF
import 'jspdf-autotable'; // Import autoTable for jsPDF to work with tables
import "./eHistory.css";

const EventHistory = () => {
    const [historyDisplay, setHistoryDisplay] = useState("");
    const [events, setEvents] = useState([]); // To store the fetched event data
    const [showFormatDropdown, setShowFormatDropdown] = useState(false); // Toggle format selection
    const [fileFormat, setFileFormat] = useState("pdf"); // Default to PDF

    // Fetch event history data from the backend
    const fetchEventHistory = async () => {
        try {
            const response = await fetch("http://localhost:4000/event-history/history");
            if (!response.ok) {
                throw new Error("Failed to fetch event history");
            }
            const volunteerData = await response.json();
            setEvents(volunteerData); // Store event data for later use

            // Convert data into HTML table rows
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
            
            setHistoryDisplay(tableHTML); // Update state to display table
        } catch (error) {
            console.error("Error fetching event history:", error);
            alert("Could not load event history.");
        }
    };

    // Generate CSV
    const generateCSV = () => {
        const csvData = events.map(item => ({
            EventName: item.name,
            Description: item.description,
            Location: item.location,
            Skills: item.skills,
            Volunteer: item.volunteer,
            Date: item.date,
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "event_history.csv"; // The downloaded file will be named "event_history.csv"
        link.click();
    };

    // Generate PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Event History", 10, 10);

        // Prepare table data for PDF
        const tableData = events.map(item => [
            item.name, 
            item.description, 
            item.location, 
            item.skills, 
            item.volunteer, 
            item.date
        ]);

        doc.autoTable({
            head: [["Event Name", "Description", "Location", "Skills", "Volunteer", "Date"]],
            body: tableData
        });

        doc.save("event_history.pdf"); // The downloaded file will be named "event_history.pdf"
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

            {/* Once events are loaded, show options to generate the report */}
            {events.length > 0 && (
                <div>
                    <button onClick={() => setShowFormatDropdown(!showFormatDropdown)}>
                        Generate Report
                    </button>

                    {showFormatDropdown && (
                        <div>
                            <label htmlFor="file-format">Select File Format:</label>
                            <select
                                id="file-format"
                                value={fileFormat}
                                onChange={(e) => setFileFormat(e.target.value)}
                            >
                                <option value="pdf">PDF</option>
                                <option value="csv">CSV</option>
                            </select>

                            <button
                                onClick={() => {
                                    fileFormat === "pdf" ? generatePDF() : generateCSV();
                                }}
                            >
                                Download Report
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventHistory;