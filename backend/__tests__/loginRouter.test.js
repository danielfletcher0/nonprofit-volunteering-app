const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const loginRouter = require("../routes/LoginRouter"); // Adjust the path as needed

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/login", loginRouter); // Mount the login router

describe("Login Router", () => {
    it("should login successfully with valid credentials", async () => {
        const validCredentials = {
            username: "testUser",
            password: "validPassword",
        };

        const response = await request(app)
            .post("/login")
            .send(validCredentials);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Login successful");
    });

    it("should return 400 for missing fields", async () => {
        const incompleteCredentials = {
            username: "testUser",
            // Password is missing
        };

        const response = await request(app)
            .post("/login")
            .send(incompleteCredentials);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Missing required fields");
    });

    it("should return 401 for invalid credentials", async () => {
        const invalidCredentials = {
            username: "testUser",
            password: "wrongPassword",
        };

        const response = await request(app)
            .post("/login")
            .send(invalidCredentials);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid credentials");
    });
});
