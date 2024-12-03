const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  const query = `
  SELECT a.id, u.email, u.firstName, u.lastName, a.date_signup, a.time_signup, m.firstName as masterFirstName, m.lastName as masterLastName, s.name as serviceName, s.price * we.coefficient as price
  FROM client_master_services a
  INNER JOIN users u ON a.client_id = u.id
  INNER JOIN master_services ms ON a.master_service_id = ms.id
  INNER JOIN master_workexpirience mw ON ms.master_workexpirience_id = mw.id
  INNER JOIN services s ON ms.service_id = s.id
  INNER JOIN workexpirience we ON mw.workexp_id = we.id
  INNER JOIN users m ON mw.master_id = m.id
  ORDER BY a.date_signup DESC, a.time_signup ASC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error retrieving appointments' });
    }

    res.json(results);
  });
});

module.exports = router;