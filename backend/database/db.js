const con = require('../connection'); 

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
            const { fullName, address1, address2, city, state, zip, skills, preferences, availability } = profileData;
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
                    JSON.stringify(availability)
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

// EVENTS

// Create an Event
const createEvent = async (eventData) => {
    try {

        return new Promise((resolve, reject) => {
            const {admin_id, event_name, description, location, skills, date, urgency} = eventData;
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
                return reject(err);
            }
            resolve(results);
        });
    });
};

const deleteEvent = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM event WHERE event_id = ?";
        con.query(sql, [id], (err, result) => {
            if (err) {
                console.log('No Event by this ID');
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
                console.log('No event for this Volunteer');
                return reject(err);
            }
            resolve(result)
        });
    });
};

// Get Event ID by name
const getEventID = (name) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT event_id FROM event WHERE event_name = ?";
        con.query(sql, [name], (err, result) => {
            if (err) {
                console.log('No event ID from this name');
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
                console.log('No event ID from this name');
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
        const sql = "SELECT vol_id FROM volunteer WHERE full_name = ?";
        con.query(sql, [name], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result)
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
////////////////////////////////////////////
// Authenticate function for Login User/Pass, If this doesn't work, edit or re-implement
function authenticateUser(username, password, callback) {
	const connection = mysql.createConnection(config);

	connection.connect((err) => {
		if (err) {
			console.error('error connecting: ' + err.stack);
			callback(err);
			return;
		}
		// console.log('connected as id ' + connection.threadId);

		connection.query(
			'SELECT * FROM login WHERE login_user = ? AND login_pass = ?',
			[username, password],
			(error, results, fields) => {
				// Release the connection
				connection.end();

				if (error) {
					console.error('Query Error: ' + error.stack);
					callback(error);
					return;
				}

				if (results.length === 0) {
					callback(null, null);
				} else {
					callback(null, results[0]);
				}
			}
		);
	});
}

module.exports = {
    getLoginIdByUsername,
    createProfile,
    getAllProfiles,
    getProfileById,
    updateProfile,
    deleteProfile,
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
    authenticateUser

};
