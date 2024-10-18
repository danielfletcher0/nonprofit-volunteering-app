const express = require('express');
const router = express.Router();

// Mock data for volunteers and events
const volunteers = [
    { id: 1, name: 'Alice', skills: ['Catering', 'First Aid'], location: 'New York' },
    { id: 2, name: 'Bob', skills: ['Cleaning', 'Setup'], location: 'Los Angeles' },
    { id: 3, name: 'John Doe', skills: ['Teamwork', 'Communication'], location: 'California' },
    { id: 4, name: 'Jane Smith', skills: ['Organizational Skills', 'Public Speaking'], location: 'Chicago' },
    { id: 5, name: 'Alice Johnson', skills: ['Landscaping', 'Painting'], location: 'New York' }
];

const events = [
    { id: 1, title: 'Beach Cleanup', requiredSkills: ['Cleaning'], location: 'Los Angeles' },
    { id: 2, title: 'Food Drive', requiredSkills: ['Catering'], location: 'New York' },
    { id: 3, title: 'Park Renovation', requiredSkills: ['Landscaping', 'Painting'], location: 'Central Park' }
];

// Mock data for matched volunteers
let matchedVolunteers = [];

// Route to get volunteer suggestions by name
router.get('/suggestions/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    const availableVolunteers = volunteers.filter(v => 
        v.name.toLowerCase().includes(name) && 
        !matchedVolunteers.some(m => m.volunteerName === v.name)
    );
    res.json(availableVolunteers);
});

// Route to match volunteers to events by name
router.get('/:volunteerName', (req, res) => {
    const volunteerName = req.params.volunteerName;
    const volunteer = volunteers.find(v => v.name.toLowerCase() === volunteerName.toLowerCase());

    if (!volunteer) {
        return res.status(404).json([]); // No volunteer found
    }

    const matchedEvents = events.filter(event => 
        event.requiredSkills.every(skill => volunteer.skills.includes(skill)) &&
        event.location === volunteer.location
    );

    res.json(matchedEvents);
});

// Route to get matched volunteers
router.get('/matched-volunteers', (req, res) => {
    res.json(matchedVolunteers);
});

// Route to save matched volunteers
router.post('/matched-volunteers', (req, res) => {
    const { volunteerName, eventTitle } = req.body;
    matchedVolunteers.push({ volunteerName, eventTitle });
    res.status(201).json({ message: 'Match saved successfully.' });
});

module.exports = router; // Ensure this line is present
