// config/database.js
const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',     // Replace with your database host
  user: 'resadmin',     // Replace with your database user
  password: 'testme', // Replace with your database password
  database: 'vm_reservations' // Replace with your database name
});

db.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Too many database connections.');
    } else {
      console.error('Error connecting to database:', err);
    }
    return;
  }
  console.log('Connected to MySQL database!');
  connection.release();
});

module.exports = db.promise();

