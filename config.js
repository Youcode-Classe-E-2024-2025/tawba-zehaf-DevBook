const mysql = require('mysql');

const connexion = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connexion.connect((err) => {
    if (err) return console.log(err.message);

    console.log('connected');
});

module.exports = connexion;