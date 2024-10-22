const express = require("express");
const router = express.Router();

// GET route for the home page
router.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the Home Page!" });
});

// GET route for a basic health check or status
router.get("/status", (req, res) => {
    res.status(200).json({ message: "Server is running fine", status: "UP" });
});

module.exports = router;
