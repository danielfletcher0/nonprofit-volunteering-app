import { useState } from "react";
import axios from "axios";
import Papa from "papaparse"; // Import papaparse for CSV
import jsPDF from "jspdf"; // Import jsPDF for PDF
import 'jspdf-autotable'; // Import autoTable for jsPDF to work with tables
import "./history.css";

const VolunteerHistory = () => {
    const [selectedVolunteer, setSelectedVolunteer] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [historyDisplay, setHistoryDisplay] = useState("");
    const [historyData, setHistoryData] = useState([]);
    const [fileFormat, setFileFormat] = useState("pdf"); // Default format is PDF
    const [showFormatDropdown, setShowFormatDropdown] = useState(false); // To toggle the format dropdown
    const [historyViewed, setHistoryViewed] = useState(false); // Track if history has been viewed

    const showSuggestions = async (value) => {
        if (!value) {
            setSuggestions([]);
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
        setHistoryDisplay(""); // Clear previous history
        setHistoryData([]); // Clear previous history data
        setHistoryViewed(false); // Reset history viewed status
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
                        let circleColor = 'green';

                        if (eventDate > today) {
                            status = 'upcoming';
                            circleColor = 'orange';
                        } else if (eventDate.toDateString() === today.toDateString()) {
                            status = 'ongoing';
                            circleColor = 'blue';
                        }

                        return {
                            event_name: item.event_name,
                            description: item.description,
                            location: item.location,
                            skills: item.skills,
                            date: eventDate.toLocaleDateString(),
                            status,
                            circleColor
                        };
                    });

                    // Display the table
                    const tableRowsHTML = tableRows.map(item => {
                        return `
                            <tr>
                                <td>${item.event_name}</td>
                                <td>${item.description}</td>
                                <td>${item.location}</td>
                                <td>${item.skills}</td>
                                <td>${item.date}</td>
                                <td><span class="status-circle" style="background-color: ${item.circleColor};"></span> ${item.status}</td>
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
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRowsHTML}
                            </tbody>
                        </table>
                    `);

                    // Store the table rows for CSV/PDF generation
                    setHistoryData(tableRows);
                }

                setHistoryViewed(true); // Set historyViewed to true after viewing history
            } catch (error) {
                setHistoryDisplay(`<h2>Error retrieving history</h2>`);
            }
        }
    };

    // Generate CSV
    const generateCSV = () => {
        const csvData = historyData.map(item => ({
            EventName: item.event_name,
            Description: item.description,
            Location: item.location,
            Skills: item.skills,
            Date: item.date,
            Status: item.status,
        }));
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${selectedVolunteer}_history.csv`;
        link.click();
    };

    // Generate PDF
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text(`Volunteer History for ${selectedVolunteer}`, 10, 10);

        // Map the data into table-friendly format
        const tableData = historyData.map(item => [
            item.event_name,
            item.description,
            item.location,
            item.skills,
            item.date,
            item.status
        ]);

        // Generate the table in the PDF
        doc.autoTable({
            head: [['Event Name', 'Description', 'Location', 'Skills', 'Date', 'Status']],
            body: tableData
        });

        doc.save(`${selectedVolunteer}_history.pdf`);
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

            <div id="history-display" dangerouslySetInnerHTML={{ __html: historyDisplay }} />

            {historyViewed && !showFormatDropdown && (
                <button
                    id="generate-file"
                    onClick={() => setShowFormatDropdown(true)}
                >
                    Generate File
                </button>
            )}

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
                        id="download-file"
                        onClick={() => {
                            console.log(fileFormat);  // Log the selected file format
                            fileFormat === "pdf" ? generatePDF() : generateCSV();
                        }}
                        disabled={!historyData.length}
                    >
                        Download Report
                    </button>
                </div>
            )}
        </div>
    );
};

export default VolunteerHistory;