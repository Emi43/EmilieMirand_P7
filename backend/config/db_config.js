const mysql = require('mysql');

//connexion à MYSQL avec mysql//
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port : 3306,
    database : "groupomania"
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connecté à la base de données MySQL!");
});

module.exports = db;