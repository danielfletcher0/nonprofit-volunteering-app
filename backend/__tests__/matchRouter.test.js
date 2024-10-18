const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const matchRouter = require('../routes/matchRouter'); // Adjust the path

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/match', matchRouter);

describe('Match Router', () => {
    it('should get volunteer suggestions by name', async () => {
        const response = await request(app).get('/match/suggestions/Alice');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2); // Alice and Alice Johnson
    });

    it('should return empty array for non-existing volunteer', async () => {
        const response = await request(app).get('/match/suggestions/NonExisting');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    it('should get matched events for a volunteer', async () => {
        const response = await request(app).get('/match/John%20Doe');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(0); // Adjust based on your mock data
    });

    it('should return 404 for a non-existing volunteer', async () => {
        const response = await request(app).get('/match/NonExistingVolunteer');
        expect(response.status).toBe(404);
        expect(response.body).toEqual([]);
    });

    it('should save a matched volunteer', async () => {
        const response = await request(app).post('/match/matched-volunteers').send({
            volunteerName: 'Alice',
            eventTitle: 'Beach Cleanup'
        });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Match saved successfully.');
    });

    it('should retrieve matched volunteers', async () => {
        await request(app).post('/match/matched-volunteers').send({
            volunteerName: 'Bob',
            eventTitle: 'Food Drive'
        });

        const response = await request(app).get('/match/matched-volunteers');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2); // Alice and Bob
    });
});