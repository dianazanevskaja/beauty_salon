const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    const workexpirienceData = 'SELECT * FROM workexpirience';
    db.query(workexpirienceData, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error retrieving categories' });
      }
      res.json(results);
    });
});

module.exports = router;