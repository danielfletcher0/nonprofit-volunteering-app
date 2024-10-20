const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const eventRouter = require('../routes/eventRouter'); // Adjust the path accordingly

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/events', eventRouter); // Mount the router

describe('Event Router', () => {
    it('should create a new event', async () => {
        const newEvent = {
            eventName: "Beach Cleanup",
            description: "A community effort to clean the beach.",
            location: "California Beach",
            skills: ["Teamwork"],
            urgency: "High",
            date: "2023-06-15"
        };

        const response = await request(app).post('/events/create').send(newEvent);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Event created successfully');
        expect(response.body.event).toEqual(expect.objectContaining(newEvent));
    });

    it('should return validation errors for missing fields', async () => {
        const response = await request(app).post('/events/create').send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Validation failed');
        expect(response.body.errors).toEqual(expect.arrayContaining([
            expect.stringContaining('Event Name is required and must be less than 100 characters.'),
            expect.stringContaining('Description is required.'),
            expect.stringContaining('Location is required.'),
            expect.stringContaining('At least one skill is required.'),
            expect.stringContaining('Urgence level is required.'),
            expect.stringContaining('Time of event is required.')
        ]));
    });

    it('should get all events', async () => {
        await request(app).post('/events/create').send({
            eventName: "Food Drive",
            description: "Collecting food donations for shelters.",
            location: "Community Center",
            skills: ["Organizational skills"],
            urgency: "Medium",
            date: "2023-07-20"
        });

        const response = await request(app).get('/events/');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get a single event by ID', async () => {
        const createResponse = await request(app).post('/events/create').send({
            eventName: "Park Renovation",
            description: "Renovating the local park.",
            location: "Central Park",
            skills: ["Landscaping"],
            urgency: "Low",
            date: "2023-08-10"
        });

        const eventId = createResponse.body.event.id; // Get the ID of the created event
        const response = await request(app).get(`/events/${eventId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({ eventName: "Park Renovation" }));
    });

    it('should return 404 for non-existing event', async () => {
        const response = await request(app).get('/events/999');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Event not found');
    });

    it('should update an existing event', async () => {
        const createResponse = await request(app).post('/events/create').send({
            eventName: "Old Event",
            description: "An outdated event.",
            location: "Old Place",
            skills: ["Old Skills"],
            urgency: "Low",
            date: "2023-01-01"
        });

        const eventId = createResponse.body.event.id; // Get the ID of the created event
        const updatedEvent = { eventName: "Updated Event" };

        const response = await request(app).put(`/events/${eventId}`).send(updatedEvent);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Event updated successfully');
        expect(response.body.event.eventName).toBe('Updated Event');
    });

    it('should delete an existing event', async () => {
        const createResponse = await request(app).post('/events/create').send({
            eventName: "To Be Deleted",
            description: "This event will be deleted.",
            location: "Somewhere",
            skills: ["None"],
            urgency: "None",
            date: "2023-01-01"
        });

        const eventId = createResponse.body.event.id; // Get the ID of the created event
        const response = await request(app).delete(`/events/${eventId}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Event deleted successfully');
    });
});