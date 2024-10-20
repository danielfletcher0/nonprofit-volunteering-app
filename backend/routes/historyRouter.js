const express = require('express');
const router = express.Router();

// Mock data for volunteer history
const volunteerHistory = {
    "John Doe": [
        {
            name: "Beach Cleanup",
            description: "Cleaning up the beach to promote a cleaner environment.",
            location: "California Beach",
            skills: "Teamwork, Physical fitness",
            date: "2023-06-15"
        },
        {
            name: "Food Drive",
            description: "Collecting food donations for local shelters.",
            location: "Community Center",
            skills: "Organizational skills, Communication",
            date: "2023-07-20"
        }
    ],
    "Jane Smith": [], // No participation
    "Alice Johnson": [
        {
            name: "Park Renovation",
            description: "Renovating the local park with new facilities.",
            location: "Central Park",
            skills: "Landscaping, Painting",
            date: "2023-08-10"
        }
    ],
};

// Route to get all volunteer names
router.get('/volunteers', (req, res) => {
    console.log('Request received for volunteer names'); // Debug log
    const volunteerNames = Object.keys(volunteerHistory);
    console.log('Volunteer names:', volunteerNames); // Debug log
    res.json(volunteerNames);
});

// Route to get volunteer history by name
router.get('/:volunteerName', (req, res) => {
    const volunteerName = req.params.volunteerName;

    // Validate volunteer name length
    if (volunteerName.length < 2 || volunteerName.length > 50) {
        return res.status(400).json({ message: 'Invalid volunteer name length' });
    }

    const historyItems = volunteerHistory[volunteerName] || []; // Default to empty array

    res.json(historyItems); // Always return an array, even if empty
});

module.exports = router;