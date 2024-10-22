const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const registerRouter = require("../routes/registerRouter");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/register", registerRouter);

describe("Register Router", () => {
    it("should register a new user successfully", async () => {
        const newUser = {
            username: "newUser",
            password: "validPassword",
            email: "newuser@example.com",
        };

        const response = await request(app).post("/register").send(newUser);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User registered successfully");
    });

    it("should return a password error when password is missing", async () => {
        const incompleteUser = {
            username: "newUser",
            email: "newuser@example.com",
            // Missing password
        };

        const response = await request(app)
            .post("/register")
            .send(incompleteUser);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Password is required and must be at least 6 characters long."
        );
    });

    it("should return an email error when email is missing", async () => {
        const incompleteUser = {
            username: "newUser",
            password: "validPassword",
            // Missing email
        };

        const response = await request(app)
            .post("/register")
            .send(incompleteUser);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Missing required fields");
    });

    it("should return 400 for an invalid email format", async () => {
        const invalidEmailUser = {
            username: "newUser",
            password: "validPassword",
            email: "invalidEmail",
        };

        const response = await request(app)
            .post("/register")
            .send(invalidEmailUser);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid email format");
    });

    it("should return 409 for a duplicate username", async () => {
        const duplicateUser = {
            username: "existingUser",
            password: "validPassword",
            email: "duplicate@example.com",
        };

        // First registration
        await request(app).post("/register").send(duplicateUser);

        // Second registration attempt with the same username
        const response = await request(app)
            .post("/register")
            .send(duplicateUser);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe("Username already exists");
    });

    // Additional tests for full function coverage

    it("should return an error for a username that is too short", async () => {
        const shortUsernameUser = {
            username: "ab",
            password: "validPassword",
            email: "shortuser@example.com",
        };

        const response = await request(app)
            .post("/register")
            .send(shortUsernameUser);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Username is required and must be between 3 and 50 characters."
        );
    });

    it("should return an error for a username that is too long", async () => {
        const longUsername = "a".repeat(51); // A username with 51 characters
        const longUsernameUser = {
            username: longUsername,
            password: "validPassword",
            email: "longuser@example.com",
        };

        const response = await request(app)
            .post("/register")
            .send(longUsernameUser);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Username is required and must be between 3 and 50 characters."
        );
    });

    it("should return all registered users", async () => {
        // Create a test user
        const newUser = {
            username: "newUserForGet",
            password: "validPassword",
            email: "newuserforget@example.com",
        };

        // Register the new user
        await request(app).post("/register").send(newUser);

        // Test GET / to return all registered users
        const response = await request(app).get("/register");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toContainEqual(newUser);
    });
});
