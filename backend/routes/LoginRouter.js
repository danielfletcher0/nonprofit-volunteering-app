const express = require("express");
const router = express.Router();

// Mock data for users
const users = [
    { username: "testUser", password: "validPassword" },
    { username: "johnDoe", password: "john1234" },
];

// POST route to handle login
router.post("/", (req, res) => {
    const { username, password } = req.body;

    // Validate that username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the user exists
    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Successful login
    res.status(200).json({ message: "Login successful" });
});

module.exports = router;
