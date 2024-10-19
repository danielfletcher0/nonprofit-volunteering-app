const express = require('express');
const router = express.Router();


let events = [];

// Validation
const validateEvent = (event) => {
    let errors = [];

    // Event Name 
    if (!event.eventName || event.fullName.length > 100) {
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
    if (!Array.isArray(event.skills) || event.skills.length === 0) {
        errors.push('At least one skill is required.');
    }

    // Urgency 
    if (!event.urgency) {
        errors.push('Urgence level is required.');
    }

    // Date  
    if (!event.date) {
        errors.push('Time of event is required.');
    }

    return errors;
};

// Create a new event 
router.post('/create', (req, res) => {
    const { eventName, description, location, skills, urgency, date } = req.body;

    // Validate event data
    const newEvent = { eventName, description, location, skills, urgency, date };
    const validationErrors = validateEvent(newEvent);

    if (validationErrors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    newEvent.id = events.length;  
    events.push(newEvent);

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
});

router.get('/', (req, res) => {
    res.json(events);
});


router.get('/:id', (req, res) => {
    const event = events.find(p => p.id == req.params.id);  

    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
});

// Update a event (PUT /event/:id)
router.put('/:id', (req, res) => {
    const event = events.find(p => p.id == req.params.id);  

    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    const { eventName, description, location, skills, urgency, date } = req.body;

    // Update event fields
    event.eventName = eventName || event.eventName;
    event.description = description || event.description;
    event.location = location || event.location;
    event.skills = skills || event.skills;
    event.urgency = urgency || event.urgency;
    event.date = date || event.date;

    // Validate the updated event data
    const validationErrors = validateEvent(event);
    if (validationErrors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    res.json({ message: 'Event updated successfully', event });
});

// Delete a event (DELETE /event/:id)
router.delete('/:id', (req, res) => {
    const eventIndex = events.findIndex(p => p.id == req.params.id);  

    if (eventIndex === -1) {
        return res.status(404).json({ message: 'Event not found' });
    }

    events.splice(eventIndex, 1);
    res.json({ message: 'Event deleted successfully' });
});

module.exports = router;
