const express = require('express');
const router = express.Router();

// Mock data for event history
let eventHistory = [
    { 
        name: "Beach Cleanup", 
        description: "Cleaning up the beach to promote a cleaner environment.", 
        location: "California Beach", 
        skills: "Leadership", 
        volunteer: "John Doe", 
        date: "2025-06-15",
        urgency: "L" 
    },
    { 
        name: "Food Drive", 
        description: "Collecting food donations for local shelters.", 
        location: "Community Center", 
        skills: "Communication", 
        volunteer: "Alice Johnson", 
        date: "2025-07-20",
        urgency: "M"
    },
    { 
        name: "Food Transport", 
        description: "Transporting and distributing food donations from the food bank.", 
        location: "Houston", 
        skills: "Logistics", 
        volunteer: "John Smith", 
        date: "2025-11-30",
        urgency: "H"
    }

];

// Route to get event history
router.get('/history', (req, res) => {
    res.json(eventHistory);
});

// Route to add an event
router.post('/add', (req, res) => {
    const { name, description, location, skills, volunteer, date, urgency} = req.body;

    // Validations
    if (!name || !description || !location || !skills || !volunteer || !date) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if (typeof skills !== 'string') {
        return res.status(400).json({ message: 'Skills must be a string' });
    }
    if (name.length < 2 || name.length > 50) {
        return res.status(400).json({ message: 'Event name must be between 2 and 50 characters' });
    }

    // Add the event to the mock data
    eventHistory.push({ name, description, location, skills, volunteer, date, urgency});
    res.status(201).json({ message: 'Event added successfully' });
});

module.exports = router;