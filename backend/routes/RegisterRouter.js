const db = require("../database/db");
const express = require("express");
const router = express.Router();

// Validation function to check required fields
const validateRegistration = (user) => {
    let errors = [];

    // Username validation
    if (
        !user.username ||
        user.username.length < 3 ||
        user.username.length > 8
    ) {
        errors.push(
            "Username is required and must be between 3 and 8 characters."
        );
    }

    // Password validation
    if (!user.password || user.password.length < 6) {
        errors.push(
            "Password is required and must be at least 6 characters long."
        );
    }

    return errors;
};

// POST route to handle registration
router.post("/", async (req, res) => {
    const { username, password } = req.body;
    const newUser = { username, password };
    const validationErrors = validateRegistration(newUser);

    if (validationErrors.length > 0) {
        return res.status(400).json({ message: validationErrors[0] });
    }

    try {
        console.log("Received registration data:", newUser);
        const userId = await db.createUser(newUser);
        res.status(201).json({
            message: "User registered successfully",
            userId,
        });
    } catch (error) {
        console.error("Detailed error during registration:", error);
        res.status(500).json({
            message: "Error registering user",
            error: error.message,
        });
    }
});

module.exports = router;
