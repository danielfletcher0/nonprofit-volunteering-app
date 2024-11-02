const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'nonprofitgroup.mysql.database.azure.com',
    user: 'volunteer_admin',
    password: 'rootRene10',
    database: 'vol-group'
});

con.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

module.exports = con;
