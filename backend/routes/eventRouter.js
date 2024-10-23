const express = require('express');
const router = express.Router();

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
    if (!Array.isArray(event.skill) || event.skill.length === 0) {
        errors.push('At least one skill is required.');
    }

    // Urgency 
    if (!event.urgency) {
        errors.push('Urgency level is required.');
    }

    // Date  
    if (!event.availability) {
        errors.push('Date of event is required.');
    }

    return errors;
};

// Create a new event 
router.post('/create', (req, res) => {
    const { name, description, location, skill, urgency, availability } = req.body;

    // Validate event data
    const newEvent = { name, description, location, skill, urgency, availability };
    const validationErrors = validateEvent(newEvent);

    if (validationErrors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    newEvent.id = events.length;  
    events.push(newEvent);

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
});

// Get all events
router.get('/', (req, res) => {
    res.json(events);
});

// Get an event by ID
router.get('/:id', (req, res) => {
    const event = events.find(p => p.id == req.params.id);  

    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
});

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

// Delete an event (DELETE /events/:id)
router.delete('/:id', (req, res) => {
    const eventIndex = events.findIndex(p => p.id == req.params.id);  

    if (eventIndex === -1) {
        return res.status(404).json({ message: 'Event not found' });
    }

    events.splice(eventIndex, 1);
    res.json({ message: 'Event deleted successfully' });
});

module.exports = router;
