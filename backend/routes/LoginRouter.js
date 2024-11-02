const db = require("../database/db");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        console.log("Login attempt with:", { username }); // Debug log
        const user = await db.getUserByUsernameAndPassword(username, password);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Error during login:", error); // Detailed log
        res.status(500).json({
            message: "Error during login",
            error: error.message,
        });
    }
});

module.exports = router;
