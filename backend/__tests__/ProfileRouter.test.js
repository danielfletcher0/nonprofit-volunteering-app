const request = require('supertest');
const app = require('../app'); 

describe('POST /profile/create', () => {
    it('should create a new profile with valid data', (done) => {
        const profileData = {
            username: "test_user",
            fullName: "John Doe",
            address1: "123 Main St",
            address2: "Apt 4B",
            city: "New York",
            state: "NY",
            zip: "10001",
            skills: ["Leadership"],
            preferences: "Flexible hours",
            availability: ["2024-01-01"]
        };

        request(app)
            .post('/profile/create')
            .send(profileData)
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should return 400 for missing required fields', (done) => {
        request(app)
            .post('/profile/create')
            .send({
                username: "",
                fullName: "",  
                address1: "123 Main St",
                city: "New York",
                state: "NY",
                zip: "10001",
                skills: [],  
                availability: []  
            })
            .expect(400)
            .end(done);
    });
});

// Test suite for retrieving profiles
describe('GET /profile', () => {
    it('should return all profiles', (done) => {
        request(app)
            .get('/profile')
            .expect(200)
            .expect(res => {
                if (!Array.isArray(res.body)) {
                    throw new Error('Expected an array of profiles');
                }
            })
            .end(done);
    });
});

describe('GET /profile/:id', () => {
    it('should return a specific profile when given a valid ID', (done) => {
        request(app)
            .get('/profile/1')
            .expect(200)
            .end(done);
    });
});

// Test suite for updating a profile
describe('PUT /profile/:id', () => {
    it('should update a profile with valid data', (done) => {
        request(app)
            .put('/profile/1')
            .send({
                fullName: "John Smith",
                city: "Boston",
                username: "test_user"
            })
            .expect(200)
            .end(done);
    });
});

// Test suite for deleting a profile
describe('DELETE /profile/:id', () => {
    it('should delete a profile by ID', (done) => {
        request(app)
            .delete('/profile/1')
            .expect(200)
            .end(done);
    });
});
