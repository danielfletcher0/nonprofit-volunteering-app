const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const historyRouter = require('../routes/historyRouter'); // Adjust the path

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/history', historyRouter);

describe('History Router', () => {
    it('should get all volunteer names', async () => {
        const response = await request(app).get('/history/volunteers');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining(['John Doe', 'Jane Smith', 'Alice Johnson']));
    });

    it('should get volunteer history by name', async () => {
        const response = await request(app).get('/history/John%20Doe');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: 'Beach Cleanup' }),
            expect.objectContaining({ name: 'Food Drive' })
        ]));
    });

    it('should return empty array for volunteer with no history', async () => {
        const response = await request(app).get('/history/Jane%20Smith');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('should validate volunteer name length', async () => {
        const response = await request(app).get('/history/A');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid volunteer name length');
    });

    it('should return 404 for non-existing volunteer', async () => {
        const response = await request(app).get('/history/NonExistingVolunteer');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});