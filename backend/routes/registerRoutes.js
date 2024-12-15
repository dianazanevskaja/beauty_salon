const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require("bcrypt");

router.post('/', async (req, res) => {
  const { firstName, lastName, phone_number, email, birthday, password } = req.body;
  
  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUserQuery, [email], async (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: 'Database error' });
      return;
    }

    if (result.length > 0) {
      res.status(400).send({ message: 'User with this email already exists' });
      return;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertClientQuery = 'INSERT INTO users (firstName, lastName, birthday, phone_number, email, password, role_id) VALUES (?, ?, ?, ?, ?, ?, 3)';
    db.query(
      insertClientQuery,
      [firstName, lastName, birthday, phone_number, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: 'Error registering client' });
          return;
        }
        res.status(200).send({ message: 'Registration successful' });
      }
    );
  });
});

module.exports = router;