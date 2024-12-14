const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require("bcrypt");

router.post('/', (req, res) => {
  const { email, password } = req.body;

  const selectClientQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(selectClientQuery, [email], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: 'Error fetching client' });
      return;
    }

    if (result.length === 0) {
      res.status(400).send({ message: 'User doesn\'t exist' });
      return;
    }

    const client = result[0];
    bcrypt.compare(password, client.password, (bcryptErr, validPassword) => {
      if (bcryptErr || !validPassword) {
        res.status(400).send({ message: 'Wrong email/password combination' });
        return;
      }

      res.status(200).send(client);
    });
  });
});

module.exports = router;