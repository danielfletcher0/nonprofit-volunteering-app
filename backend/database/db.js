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

const getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM login WHERE login_user = ?";
        con.query(sql, [username], (err, result) => {
            if (err) return reject(err);
            resolve(result.length > 0 ? result[0] : null);
        });
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

// EVENTS

// Create an Event
const createEvent = async (eventData) => {
    try {
        return new Promise((resolve, reject) => {
            const {
                admin_id,
                event_name,
                description,
                location,
                skills,
                date,
                urgency,
            } = eventData;
            const sql = `INSERT INTO event(admin_id, event_name, description, location, skills, date, urgency) 
                         VALUES (1, ?, ?, ?, ?, ?, ?)`;

            con.query(
                sql,
                [
                    admin_id,
                    event_name,
                    description,
                    location,
                    skills,
                    JSON.stringify(date),
                    urgency,
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

// Get list of All Events
const getAllEvents = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM event";
        con.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching events:", err); // Log the error
                return reject(err);
            }
            console.log("Fetched Events:", results); // Log the fetched results
            resolve(results);
        });
    });
};

const deleteEvent = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM event WHERE event_id = ?";
        con.query(sql, [id], (err, result) => {
            if (err) {
                console.log("No Event by this ID");
                return reject(err);
            }
            resolve(result);
        });
    });
};

// Gets all Events by a specific Volunteer ID
const getEventByVol = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM event WHERE vol_id = ?";
        con.query(sql, [id], (err, result) => {
            if (err) {
                console.log("No event for this Volunteer");
                return reject(err);
            }
            resolve(result);
        });
    });
};

// Get Event ID by name
const getEventID = (name) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT event_id FROM event WHERE event_name = ?";
        con.query(sql, [name], (err, result) => {
            if (err) {
                console.log("No event ID from this name");
                return reject(err);
            }
            resolve(result[0]);
        });
    });
};

// Get Event by Event_ID
const getEventbyID = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM event WHERE event_id = ?";
        con.query(sql, [id], (err, result) => {
            if (err) {
                console.log("No event ID from this name");
                return reject(err);
            }
            resolve(result[0]);
        });
    });
};

//////////////////////////////////////
// Get specific Volunteer ID
const getV_IDbyName = (name) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM volunteer WHERE full_name = ?";
        con.query(sql, [name], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

// Get All Volunteers
const getAllVol = () => {
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

const getAllVolHist = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM volunteer history";
        con.query(sql, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Function to retrieve volunteer history for a specific user ID
const getVolunteerHistoryByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT e.event_name, e.description, e.location, e.skills, e.date, vh.events_attended
            FROM volunteer_history vh
            JOIN Event e ON vh.event_id = e.event_id
            WHERE vh.vol_id = ?`  // Use vol_id to match your schema
        ;
        con.query(sql, [userId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Function to add a new entry to the volunteer history
const addVolunteerEntry = (volId, eventId) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO volunteer_history (vol_id, event_id, events_attended, events_ongoing) VALUES (?, ?, 1, 0)";
        con.query(sql, [volId, eventId], (err, result) => {
            if (err) return reject(err);
            resolve(result.insertId);
        });
    });
};

const matchVolunteerToEvent = (volId, eventId) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE event SET matched = TRUE, vol_id = ? WHERE event_id = ? AND matched = FALSE`;
        con.query(sql, [volId, eventId], (err, result) => {
            if (err) return reject(err);
            resolve(result.affectedRows > 0); // Returns true if the match was successful
        });
    });
};

// Function to update the event with volunteer's ID and change matched status
const updateEventWithVolunteer = (eventId, volId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE event 
            SET vol_id = ?, matched = 1 
            WHERE event_id = ?`;
        con.query(sql, [volId, eventId], (err, result) => {
            if (err) return reject(err);
            resolve(result.affectedRows > 0); // Returns true if the update was successful
        });
    });
};

module.exports = {
    getLoginIdByUsername,
    createUser,
    createProfile,
    getAllProfiles,
    getProfileById,
    getUserByUsername,
    getUserByUsernameAndPassword,
    updateProfile,
    deleteProfile,
    getVolunteerHistoryByUserId,
    addVolunteerEntry,
    //////////
    createEvent,
    getAllEvents,
    getEventbyID,
    deleteEvent,
    getEventByVol,
    getEventID,
    ///////////
    getV_IDbyName,
    getAllVol,
    getAllVolHist,
    ////////////////
    matchVolunteerToEvent,
    updateEventWithVolunteer
};
