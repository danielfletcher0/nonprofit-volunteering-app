const con = require('../connection'); // Adjust path if needed

// Function to create a new profile in the volunteer table
const createProfile = (profileData) => {
    return new Promise((resolve, reject) => {
        const { fullName, address1, address2, city, state, zip, skills, preferences, availability } = profileData;

        // Insert query with exact column names as in the volunteer table
        const sql = `INSERT INTO volunteer (full_name, address, address2, city, state, zipcode, skills, preferences, availability) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // Execute query with values passed in as an array
        con.query(
            sql,
            [
                fullName,            
                address1,           
                address2,            
                city,                
                state,               
                zip,                 
                JSON.stringify(skills), 
                preferences,         
                JSON.stringify(availability) 
            ],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.insertId); // Return the inserted profile ID
            }
        );
    });
};

// Function to retrieve all profiles from the volunteer table
const getAllProfiles = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM volunteer";
        con.query(sql, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Function to retrieve a profile by ID
const getProfileById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM volunteer WHERE vol_id = ?";
        con.query(sql, [id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result[0]);
        });
    });
};

// Function to update an existing profile by ID
const updateProfile = (id, profileData) => {
    return new Promise((resolve, reject) => {
        const { fullName, address1, address2, city, state, zip, skills, preferences, availability } = profileData;

        const sql = `UPDATE volunteer 
                     SET full_name = ?, address = ?, address2 = ?, city = ?, state = ?, zipcode = ?, skills = ?, preferences = ?, availability = ?
                     WHERE vol_id = ?`;

        con.query(
            sql,
            [
                fullName,            
                address1,            
                address2,           
                city,               
                state,               
                zip,                
                JSON.stringify(skills), 
                preferences,        
                JSON.stringify(availability), 
                id                   
            ],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            }
        );
    });
};

// Function to delete a profile by ID
const deleteProfile = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM volunteer WHERE vol_id = ?";
        con.query(sql, [id], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

module.exports = {
    createProfile,
    getAllProfiles,
    getProfileById,
    updateProfile,
    deleteProfile
};
