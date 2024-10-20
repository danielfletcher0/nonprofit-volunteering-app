const express = require('express');
const router = express.Router();

// Mock data for event history
const eventHistory = [
    { 
        name: "Beach Cleanup", 
        description: "Cleaning up the beach to promote a cleaner environment.", 
        location: "California Beach", 
        skills: "Teamwork, Physical fitness", 
        volunteer: "John Doe", 
        date: "2023-06-15" 
    },
    { 
        name: "Food Drive", 
        description: "Collecting food donations for local shelters.", 
        location: "Community Center", 
        skills: "Organizational skills, Communication", 
        volunteer: "Alice Johnson", 
        date: "2023-07-20" 
    }
];

// Route to get event history
router.get('/history', (req, res) => {
    console.log("Request for event history received");
    res.json(eventHistory); // Send the mock data as JSON
});

router.get('/', (req, res) => {
    res.send("Event History Router is working!");
});

module.exports = router;