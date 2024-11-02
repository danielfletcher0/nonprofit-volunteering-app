const con = require("../connection");

const getLoginIdByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT login_id FROM login WHERE login_user = ?";
        con.query(sql, [username], (err, result) => {
            if (err) return reject(err);
            if (result.length > 0) {
                resolve(result[0].login_id);
            } else {
                reject(new Error("Username not found"));
            }
        });
    });
};

const createUser = (userData) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO login (login_user, login_pass) VALUES (?, ?)`;
        con.query(
            sql,
            [userData.username, userData.password],
            (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
            }
        );
    });
};

const getUserByUsernameAndPassword = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM login WHERE login_user = ? AND login_pass = ?`;
        con.query(sql, [username, password], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
};

const profileExistsForUsername = (loginId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT vol_id FROM volunteer WHERE login_id = ?";
        con.query(sql, [loginId], (err, result) => {
            if (err) return reject(err);
            resolve(result.length > 0);
        });
    });
};

const createProfile = async (profileData) => {
    try {
        const loginId = await getLoginIdByUsername(profileData.username);

        // Check if a profile already exists for this login_id
        const profileExists = await profileExistsForUsername(loginId);
        if (profileExists) {
            throw new Error("A profile already exists for this username.");
        }

        return new Promise((resolve, reject) => {
            const {
                fullName,
                address1,
                address2,
                city,
                state,
                zip,
                skills,
                preferences,
                availability,
            } = profileData;
            const sql = `INSERT INTO volunteer (login_id, full_name, address, address2, city, state, zipcode, skills, preferences, availability) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            con.query(
                sql,
                [
                    loginId,
                    fullName,
                    address1,
                    address2,
                    city,
                    state,
                    zip,
                    JSON.stringify(skills),
                    preferences,
                    JSON.stringify(availability),
                ],
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result.insertId);
                }
            );
        });
    } catch (err) {
        throw err;
    }
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
        const {
            fullName,
            address1,
            address2,
            city,
            state,
            zip,
            skills,
            preferences,
            availability,
        } = profileData;

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
                id,
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
    getLoginIdByUsername,
    createUser,
    createProfile,
    getAllProfiles,
    getProfileById,
    getUserByUsernameAndPassword,
    updateProfile,
    deleteProfile,
};
