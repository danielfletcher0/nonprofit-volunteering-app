const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Import the database functions

// Validation function to check profile fields
const validateProfile = (profile) => {
    let errors = [];

    // Full Name Validation
    if (!profile.fullName || profile.fullName.length > 50) {
        errors.push('Full Name is required and must be less than 50 characters.');
    }

    // Address 1 Validation
    if (!profile.address1 || profile.address1.length > 100) {
        errors.push('Address 1 is required and must be less than 100 characters.');
    }

    // Address 2 Validation
    if (profile.address2 && profile.address2.length > 100) {
        errors.push('Address 2 must be less than 100 characters if provided.');
    }

    // City Validation
    if (!profile.city || profile.city.length > 50) {
        errors.push('City is required and must be less than 50 characters.');
    }

    // State Validation
    if (!profile.state || profile.state.length !== 2) {
        errors.push('State is required and must be exactly 2 characters.');
    }

    // Zip Code Validation
    if (!profile.zip || profile.zip.length < 5 || profile.zip.length > 9) {
        errors.push('Zip Code must be between 5 and 9 characters.');
    }

    // Skills Validation
    if (!Array.isArray(profile.skills) || profile.skills.length === 0) {
        errors.push('At least one skill is required.');
    }

    // Availability Validation
    if (!Array.isArray(profile.availability) || profile.availability.length === 0) {
        errors.push('At least one available date is required.');
    }

    return errors;
};

// Create a new profile
router.post('/create', async (req, res) => {
    const { fullName, address1, address2, city, state, zip, skills, preferences, availability } = req.body;

    // Validate profile data
    const newProfile = { fullName, address1, address2, city, state, zip, skills, preferences, availability };
    const validationErrors = validateProfile(newProfile);

    if (validationErrors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    try {
        // Call db function to add profile to the database
        const profileId = await db.createProfile(newProfile);
        res.status(201).json({ message: 'Profile created successfully', profileId });
    } catch (error) {
        res.status(500).json({ message: 'Error adding profile to database', error: error.message });
    }
});

// Get all profiles
router.get('/', async (req, res) => {
    try {
        const profiles = await db.getAllProfiles();
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving profiles from database', error: error.message });
    }
});

// Get a profile by ID
router.get('/:id', async (req, res) => {
    try {
        const profile = await db.getProfileById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving profile from database', error: error.message });
    }
});

// Update a profile
router.put('/:id', async (req, res) => {
    const { fullName, address1, address2, city, state, zip, skills, preferences, availability } = req.body;

    // Build profile object for update
    const updatedProfile = { fullName, address1, address2, city, state, zip, skills, preferences, availability };
    const validationErrors = validateProfile(updatedProfile);

    if (validationErrors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    try {
        const result = await db.updateProfile(req.params.id, updatedProfile);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile in database', error: error.message });
    }
});

// Delete a profile
router.delete('/:id', async (req, res) => {
    try {
        const result = await db.deleteProfile(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting profile from database', error: error.message });
    }
});

module.exports = router;
