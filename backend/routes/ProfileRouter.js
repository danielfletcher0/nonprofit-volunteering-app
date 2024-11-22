const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Import the database functions

// Validation function to check profile fields
const validateProfile = (profile) => {
    let errors = [];

    if (!profile.username) {
        errors.push('Username is required.');
      }
      if (!profile.fullName || profile.fullName.length > 50) {
        errors.push('Full Name is required and must be less than 50 characters.');
      }

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

router.post('/create', async (req, res) => {
    const { username, fullName, address1, address2, city, state, zip, skills, preferences, availability } = req.body;
  
    // Log the data being sent from the frontend
    console.log('Received profile data:', req.body);
  
    const newProfile = { username, fullName, address1, address2, city, state, zip, skills, preferences, availability };
    const validationErrors = validateProfile(newProfile);
  
    if (validationErrors.length > 0) {
      console.log('Validation errors:', validationErrors);
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }
  
    try {
      const profileId = await db.createProfile(newProfile);
      console.log('Profile created with ID:', profileId);
      res.status(201).json({ message: 'Profile created successfully', profileId });
    } catch (error) {
      console.error('Error adding profile to database:', error);
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

module.exports = router;
