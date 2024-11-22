const express = require('express');
const router = express.Router();
const db = require('../database/db');

let events = [];

// Validation
const validateEvent = (event) => {
    let errors = [];

    // Event Name 
    if (!event.name || event.name.length > 100) {
        errors.push('Event Name is required and must be less than 100 characters.');
    }

    // Description  
    if (!event.description) {
        errors.push('Description is required.');
    }

    // Location 
    if (!event.location) {
        errors.push('Location is required.');
    }

    // Skills  
    if (event.skill.length === 0) {
        errors.push('At least one skill is required.');
    }

    // Urgency 
    if (!event.urgency) {
        errors.push('Urgency level is required.');
    }

    // Date  
    if (!event.date) {
        errors.push('Date of event is required.');
    }

    return errors;
};

// Create a new event 
router.post('/create', async(req, res) => {
    const { name, description, location, skill, urgency, date } = req.body;

    // Validate event data
    const newEvent = { name, description, location, skill, urgency, date };
    const validationErrors = validateEvent(newEvent);

    if (validationErrors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    try {
        const eventID = await db.createEvent(newEvent);
        console.log('Event created with ID:', eventID);
        res.status(201).json({ message: 'Event created successfully', eventID });
      } catch (error) {
        console.error('Error adding event to database:', error);
        res.status(500).json({ message: 'Error adding event to database', error: error.message });
      }
});

// Get all events
router.get('/', async(req, res) => {
    try {
        const events = await db.getAllEvents();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving events from database', error: error.message });
    }
});

// Get an event by ID
router.get('/:id', async (req, res) => {
    try {
        const profile = await db.getEventByVol(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving profile from database', error: error.message });
    }
});

/*

IMPLEMENTING LATER OR DECIDING TO MAYBE NOT ALLOW UPDATING EVENT IMPORTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANT

// Update an event (PUT /events/:id)
router.put('/:id', (req, res) => {
    const event = events.find(p => p.id == req.params.id);  

    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    const { name, description, location, skill, urgency, availability } = req.body;

    // Update event fields
    event.name = name || event.name;
    event.description = description || event.description;
    event.location = location || event.location;
    event.skill = skill || event.skill;
    event.urgency = urgency || event.urgency;
    event.availability = availability || event.availability;

    // Validate the updated event data
    const validationErrors = validateEvent(event);
    if (validationErrors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    res.json({ message: 'Event updated successfully', event });
});
*/ 

// Delete an event (DELETE /events/:id)
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.deleteEvent(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event from database', error: error.message });
    }
});

module.exports = router;
