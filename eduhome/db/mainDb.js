const mysql = require("mysql2")
require("dotenv").config()
const db = mysql.createPool({
  host: "localhost", 
  user: "root", 
  password: "Pleaseworkplease1!", 
  database: "eduhome",  
  port: "3306",
    waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

db.getConnection((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
    createTable(); // Call function to create table
});

// Function to create the table if it doesn't exist
function createTable() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS questions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            question VARCHAR(255),
            answerA VARCHAR(255),
            answerB VARCHAR(255),
            answerC VARCHAR(255),
            answerD VARCHAR(255),
            trueAnswer VARCHAR(255),
            topic VARCHAR(255),
            dateAdded VARCHAR(255),
            unit VARCHAR(255)
        )
    `;

    db.query(createTableQuery, (err, result) => {
        if (err) throw err;
        console.log('Connected to table');
    });

    const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255),
        password VARCHAR(255),
        email VARCHAR(255),
        verification_token VARCHAR(255),
        email_verified BOOLEAN DEFAULT false,
        cookie VARCHAR(5000),
        role VARCHAR(255),
        teachingTopic VARCHAR(255),
        grade VARCHAR(255),
        letter VARCHAR(255)
        )
    `

    db.query(createUserTable, (err,results) => {
        if(err) throw err;
        console.log("Connected to users table")
    })

    const createClassTable = `
    CREATE TABLE IF NOT EXISTS classes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        grade VARCHAR(255),
        letter VARCHAR(255),
        leader VARCHAR(255)
        )
    `

    db.query(createClassTable, (err,results) => {
        if(err) throw err;
        console.log("Connected to classes table")
    })

    function createUser(){
        const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
        const insertUser = `
          INSERT INTO users (username, password, email, verification_token, email_verified, cookie, role, teachingTopic, grade, letter)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
      
        const values = [
          'aradleir',
          'Pleaseworkplease1!',
          'aradleiryasin@gmail.com',
          '123456789',
          true,
          'EDUHOME-ahdghsdgfkuyagtskdfgy8723659134',
          'admin',
          'none',
          "un",
          "un"
        ];
      
        db.query(checkUserQuery, [values[2]], (err, results) => {
          if (err) throw err;
      
          if (results.length > 0) {
            console.log("User already exists");
          } else {
            db.query(insertUser, values, (err, results) => {
              if (err) throw err;
              console.log("User created successfully");
            });
          }
        });
      };
      
   createUser()

  const createTrackingTable = `
    CREATE TABLE IF NOT EXISTS tracking (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(255),
        topic VARCHAR(255),
        dateAdded VARCHAR(255),
        chapter VARCHAR(255)
    )`

    db.query(createTrackingTable, (err, results) => {
        if(err) throw err;
        console.log("Connected to tracking table")
    })
    const createUnitTable = `
    CREATE TABLE IF NOT EXISTS unit (
        id INT AUTO_INCREMENT PRIMARY KEY,
        topic VARCHAR(255),
        name VARCHAR(255),
        number VARCHAR(255)
    )`
    db.query(createUnitTable, (err, results) => {
        if(err) throw err;
        console.log("Connected to units table")
    })
    const createAnnouncementTable = `
    CREATE TABLE IF NOT EXISTS announcements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      content VARCHAR(760),
      topic VARCHAR(255),
      sender VARCHAR(255),
      date VARCHAR(255)
    )`
    db.query(createAnnouncementTable, (err, results) => {
      if(err) throw err;
      console.log("Connected to announcement table")
    })
}



module.exports = db;
