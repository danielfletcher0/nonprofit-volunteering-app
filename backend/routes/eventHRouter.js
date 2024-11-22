const express = require('express');
const router = express.Router();

        //name: "Beach Cleanup", 
        //description: "Cleaning up the beach to promote a cleaner environment.", 
        //location: "California Beach", 
        //skills: "Teamwork, Physical fitness", 
        //volunteer: "John Doe", 
       //date: "2023-06-15" 
  

// Route to get event history
router.get('/', async (req, res) => {
    try {
        const events = await db.getAllEvents(); // Fetch all events from DB
        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving Event History' });
    }
});

/* Route to add an event
router.post('/add', (req, res) => {
    const { name, description, location, skills, volunteer, date } = req.body;

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
    eventHistory.push({ name, description, location, skills, volunteer, date });
    res.status(201).json({ message: 'Event added successfully' });
});*/

module.exports = router;