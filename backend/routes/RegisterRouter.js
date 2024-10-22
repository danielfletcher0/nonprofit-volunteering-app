const express = require("express");
const router = express.Router();

// Mock data for registered users
let users = [];

// Validation function to check required fields
const validateRegistration = (user) => {
    let errors = [];

    // Username validation
    if (
        !user.username ||
        user.username.length < 3 ||
        user.username.length > 50
    ) {
        errors.push(
            "Username is required and must be between 3 and 50 characters."
        );
    }

    // Password validation
    if (!user.password || user.password.length < 6) {
        errors.push(
            "Password is required and must be at least 6 characters long."
        );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.email) {
        errors.push("Missing required fields");
    } else if (!emailRegex.test(user.email)) {
        errors.push("Invalid email format");
    }

    return errors;
};

// POST route to handle registration
router.post("/", (req, res) => {
    const { username, password, email } = req.body;

    // Validate registration data
    const newUser = { username, password, email };
    const validationErrors = validateRegistration(newUser);

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
        return res.status(400).json({ message: validationErrors[0] });
    }

    // Check if the username already exists
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Add new user to the mock database
    users.push(newUser);
    res.status(201).json({
        message: "User registered successfully",
        user: newUser,
    });
});

// GET route to return all registered users (for testing/demo purposes)
router.get("/", (req, res) => {
    res.json(users);
});

module.exports = router;
