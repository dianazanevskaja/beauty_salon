const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1111',
  database: 'beauty_salon3',
});

module.exports = pool;
