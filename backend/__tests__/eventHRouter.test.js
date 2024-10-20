const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const eventHRouter = require('../routes/eventHRouter'); // Adjust the path as needed

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/event-history', eventHRouter);

describe('Event History Router', () => {
    it('should return event history', async () => {
        const response = await request(app).get('/event-history/history');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: 'Beach Cleanup' }),
            expect.objectContaining({ name: 'Food Drive' })
        ]));
    });

    it('should validate required fields', async () => {
        const invalidEvent = {}; // Missing required fields
        const response = await request(app)
            .post('/event-history/add')
            .send(invalidEvent);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Missing required fields');
    });

    it('should validate field types', async () => {
        const invalidEvent = {
            name: 'Beach Cleanup',
            description: 'A great cleanup',
            location: 'Beach',
            skills: 123, // Invalid type
            volunteer: 'John Doe',
            date: '2023-06-15'
        };
        const response = await request(app)
            .post('/event-history/add')
            .send(invalidEvent);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Skills must be a string');
    });

    it('should validate field lengths', async () => {
        const invalidEvent = {
            name: 'A', // Invalid length
            description: 'A great cleanup',
            location: 'Beach',
            skills: 'Teamwork',
            volunteer: 'John Doe',
            date: '2023-06-15'
        };
        const response = await request(app)
            .post('/event-history/add')
            .send(invalidEvent);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Event name must be between 2 and 50 characters');
    });

    it('should add an event successfully', async () => {
        const newEvent = {
            name: 'Park Renovation',
            description: 'Renovating the local park.',
            location: 'Central Park',
            skills: 'Landscaping',
            volunteer: 'Alice Johnson',
            date: '2023-08-10'
        };
        const response = await request(app)
            .post('/event-history/add')
            .send(newEvent);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Event added successfully');
    });
});