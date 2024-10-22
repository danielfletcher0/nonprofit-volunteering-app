const request = require("supertest");
const express = require("express");
const homeRouter = require("../routes/homeRouter"); // Adjust path as needed

const app = express();
app.use("/", homeRouter); // Mount the home router

describe("Home Router", () => {
    it("should return a welcome message on the home page", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Welcome to the Home Page!");
    });

    it("should return a server status message", async () => {
        const response = await request(app).get("/status");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Server is running fine");
        expect(response.body.status).toBe("UP");
    });
});
