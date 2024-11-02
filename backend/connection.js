const mysql = require("mysql");
const con = mysql.createConnection({
    host: "nonprofitgroup.mysql.database.azure.com",
    user: "volunteer_admin",
    password: "rootRene10",
    database: "vol-group",
});

con.connect(function (err) {
    if (err) {
        console.error("Database connection error:", err); // Log connection errors
        throw err;
    }
    console.log("Connected to the database!");
});

module.exports = con;
