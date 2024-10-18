const express = require('express');
const router = express.Router();


let profiles = [];

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
router.post('/create', (req, res) => {
    const { fullName, address1, address2, city, state, zip, skills, preferences, availability } = req.body;

    // Validate profile data
    const newProfile = { fullName, address1, address2, city, state, zip, skills, preferences, availability };
    const validationErrors = validateProfile(newProfile);

    // If there are validation errors, return a 400 response with the errors
    if (validationErrors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    newProfile.id = profiles.length;  
    profiles.push(newProfile);

    res.status(201).json({ message: 'Profile created successfully', profile: newProfile });
});

router.get('/', (req, res) => {
    res.json(profiles);
});


router.get('/:id', (req, res) => {
    const profile = profiles.find(p => p.id == req.params.id);  

    if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
});

// Update a profile (PUT /profile/:id)
router.put('/:id', (req, res) => {
    const profile = profiles.find(p => p.id == req.params.id);  

    if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
    }

    const { fullName, address1, address2, city, state, zip, skills, preferences, availability } = req.body;

    // Update profile fields if they are provided
    profile.fullName = fullName || profile.fullName;
    profile.address1 = address1 || profile.address1;
    profile.address2 = address2 || profile.address2;
    profile.city = city || profile.city;
    profile.state = state || profile.state;
    profile.zip = zip || profile.zip;
    profile.skills = skills || profile.skills;
    profile.preferences = preferences || profile.preferences;
    profile.availability = availability || profile.availability;

    // Validate the updated profile data
    const validationErrors = validateProfile(profile);
    if (validationErrors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    res.json({ message: 'Profile updated successfully', profile });
});

// Delete a profile (DELETE /profile/:id)
router.delete('/:id', (req, res) => {
    const profileIndex = profiles.findIndex(p => p.id == req.params.id);  

    if (profileIndex === -1) {
        return res.status(404).json({ message: 'Profile not found' });
    }

    profiles.splice(profileIndex, 1);
    res.json({ message: 'Profile deleted successfully' });
});

module.exports = router;

