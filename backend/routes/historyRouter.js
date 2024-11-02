const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Import the database functions

// Route to get all volunteer names
router.get('/volunteers', async (req, res) => {
    try {
        const volunteers = await db.getAllVol(); // Fetch all volunteers from the database
        const volunteerNames = volunteers.map(volunteer => volunteer.full_name);
        res.json(volunteerNames);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving volunteer names' });
    }
});

// Route to get volunteer history by name
router.get('/:volunteerName', async (req, res) => {
    const volunteerName = req.params.volunteerName;

    // Validate volunteer name length
    if (volunteerName.length < 2 || volunteerName.length > 50) {
        return res.status(400).json({ message: 'Invalid volunteer name length' });
    }

    try {
        const volunteerIdResult = await db.getV_IDbyName(volunteerName);
        if (volunteerIdResult.length === 0) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }
        
        const volunteerId = volunteerIdResult[0].vol_id; // Get the volunteer ID
        const historyItems = await db.getVolunteerHistoryByUserId(volunteerId); // Fetch the history

        res.json(historyItems); // Return the history items
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving volunteer history' });
    }
});

module.exports = router;