const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', (req, res) => {
  const { firstName, lastName, phone_number, email, birthday, password } = req.body;

  const insertClientQuery = 'INSERT INTO users (firstName, lastName, birthday, phone_number, email, password, role_id) VALUES (?, ?, ?, ?, ?, ?, 3)';
  db.query(
    insertClientQuery,
    [firstName, lastName, birthday, phone_number, email, password],
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

module.exports = router;