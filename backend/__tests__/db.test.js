
const db = require('../database/db');
const con = require('../connection');


jest.mock('../connection', () => {
    return {
        query: jest.fn(),
    };
});

describe("Database functions", () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    test("createProfile should insert a profile and resolve with insertId", async () => {
        // Mock the getLoginIdByUsername query result
        con.query.mockImplementation((sql, values, callback) => {
            if (sql.includes("SELECT login_id FROM login WHERE login_user = ?")) {
                // Mock the result of finding a login_id
                callback(null, [{ login_id: 1 }]);
            } else if (sql.includes("SELECT vol_id FROM volunteer WHERE login_id = ?")) {
                // Mock that no existing profile is found for the login_id
                callback(null, []);
            } else if (sql.includes("INSERT INTO volunteer")) {
                // Mock the insert operation
                callback(null, { insertId: 1 });
            } else {
                callback(new Error("Unknown query"));
            }
        });

        const profileData = {
            username: 'test_user',
            fullName: 'Test User',
            address1: '123 Test St',
            address2: '',
            city: 'Test City',
            state: 'TS',
            zip: '12345',
            skills: ['coding'],
            preferences: 'none',
            availability: ['2024-11-01'],
        };

        const result = await db.createProfile(profileData);
        expect(result).toBe(1);
        expect(con.query).toHaveBeenCalledTimes(3); 
    });

    test("getAllProfiles should retrieve profiles", async () => {
        const mockProfiles = [{ id: 1, fullName: "John Doe" }];
        con.query.mockImplementation((query, callback) => {
            callback(null, mockProfiles); 
        });

        const profiles = await db.getAllProfiles();
        expect(profiles).toEqual(mockProfiles);
        expect(con.query).toHaveBeenCalledTimes(1);
    });

    test("getProfileById should retrieve profile by ID", async () => {
        const mockProfile = { id: 1, fullName: "John Doe" };
        con.query.mockImplementation((query, values, callback) => {
            callback(null, [mockProfile]);
        });

        const profile = await db.getProfileById(1);
        expect(profile).toEqual(mockProfile);
        expect(con.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });

    test("updateProfile should update profile by ID", async () => {
        con.query.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 1 }); 
        });

        const profileData = {
            fullName: 'Updated User',
            address1: '456 New St',
            address2: '',
            city: 'New City',
            state: 'NC',
            zip: '67890',
            skills: ['design'],
            preferences: 'night shifts',
            availability: ['2024-12-01'],
        };

        const result = await db.updateProfile(1, profileData);
        expect(result.affectedRows).toBe(1);
        expect(con.query).toHaveBeenCalledTimes(1);
    });

    test("deleteProfile should delete profile by ID", async () => {
        con.query.mockImplementation((query, values, callback) => {
            callback(null, { affectedRows: 1 }); 
        });

        const result = await db.deleteProfile(1);
        expect(result.affectedRows).toBe(1);
        expect(con.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });
});
