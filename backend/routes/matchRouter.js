const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Import the database functions

// Route to get volunteer suggestions by name
router.get('/suggestions/:name', async (req, res) => {
    const name = req.params.name.toLowerCase();
    try {
        const availableVolunteers = await db.getAllVol(); // Fetch all volunteers
        const filteredVolunteers = availableVolunteers.filter(v => 
            v.full_name.toLowerCase().includes(name)
        );

        res.json(filteredVolunteers);
    } catch (err) {
        console.error("Error fetching volunteers:", err);
        res.status(500).json({ message: 'Error fetching volunteers' });
    }
});

// Route to get all events
router.get('/events', async (req, res) => {
    try {
        const events = await db.getAllEvents(); // Fetch all events
        res.json(events);
    } catch (err) {
        console.error("Error fetching all events:", err);
        res.status(500).json({ message: 'Error fetching all events' });
    }
});

// Route to get events for a specific volunteer by name
router.get('/events/:volunteerName', async (req, res) => {
    const volunteerName = req.params.volunteerName;
    try {
        const volunteer = await db.getV_IDbyName(volunteerName);
        if (!volunteer || volunteer.length === 0) {
            return res.status(404).json({ message: "Volunteer not found." });
        }

        const volunteerSkills = volunteer[0].skills; // Now this will contain the skills
        console.log("Volunteer Skills:", volunteerSkills); // Debug log

        if (!volunteerSkills) {
            return res.status(400).json({ message: "No skills defined for this volunteer." });
        }

        const skillsArray = volunteerSkills.split(',').map(skill => skill.trim());
        const events = await db.getAllEvents();

        const matchedEvents = events.filter(event =>
            !event.matched &&
            event.skills.split(',').map(skill => skill.trim()).every(skill => skillsArray.includes(skill))
        );

        res.json(matchedEvents);
    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(500).json({ message: 'Error fetching events', error: err.message });
    }
});

// Route to save matched volunteers
router.post('/matched-volunteers', async (req, res) => {
    const { volunteerName, eventId } = req.body;

    try {
        const event = await db.getEventbyID(eventId); // Get the event to check if it's already matched
        if (event && event.matched) {
            return res.status(400).json({ message: "Event is already matched to another volunteer." });
        }

        const volunteer = await db.getV_IDbyName(volunteerName); // Get volunteer ID
        if (!volunteer || volunteer.length === 0) {
            return res.status(404).json({ message: "Volunteer not found." });
        }

        // Match volunteer to event
        const matchResult = await db.matchVolunteerToEvent(volunteer[0].vol_id, eventId);
        if (matchResult) {
            res.status(201).json({ message: 'Match saved successfully.' });
        } else {
            res.status(500).json({ message: "Error saving the match." });
        }
    } catch (err) {
        console.error("Error processing the match:", err);
        res.status(500).json({ message: "Error processing the match." });
    }
});

module.exports = router;