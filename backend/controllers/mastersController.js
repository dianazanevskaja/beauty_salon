const db = require('../config/db');

function getAllMasters(req, res) {
  const mastersDataQuery = `SELECT mw.id, u.id AS master_id, u.firstName, u.lastName, u.birthday, mw.workexp_id as coefficient_id, we.coefficient
                            FROM users AS u 
                            JOIN master_workexpirience AS mw ON u.id = mw.master_id
                            JOIN workexpirience AS we ON mw.workexp_id = we.id;`;
  db.query(mastersDataQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error retrieving masters' });
    }
    res.json(results);
  });
}

function createMaster(req, res) {
  const { master_id, coefficient_id } = req.body;
  const insertMasterWorkExpQuery = `INSERT INTO master_workexpirience (master_id, workexp_id) VALUES (?, ?)`;

  db.query(insertMasterWorkExpQuery, [master_id, coefficient_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error adding master work experience' });
    }

    res.status(201).json({ id: result.insertId, message: 'Master work experience added successfully' });
  });
}

function updateMaster(req, res) {
  const masterExpId = req.params.id;
  const { master_id, coefficient_id } = req.body;
  const updateMasterWorkExpQuery = `UPDATE master_workexpirience SET master_id = ?, workexp_id = ? WHERE id = ?`;

  db.query(updateMasterWorkExpQuery, [master_id, coefficient_id, masterExpId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error updating master work experience' });
    }

    res.status(200).json({ message: 'Master work experience updated successfully' });
  });
}

function deleteMaster(req, res) {
  const masterId = req.params.id;
  const deleteMasterWorkExpQuery = 'DELETE FROM master_workexpirience WHERE id = ?';

  db.query(deleteMasterWorkExpQuery, [masterId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error deleting master work experience' });
    }

    res.status(200).json({ message: 'Master work experience deleted successfully' });
  });
}

function getMastersData(req, res) {
  const mastersDataQuery = `
  SELECT u.id, u.firstName, u.lastName, w.coefficient,
  JSON_ARRAYAGG(JSON_OBJECT('name', s.name, 'category', c.category)) AS services
  FROM master_services ms
  INNER JOIN master_workexpirience mw ON ms.master_workexpirience_id = mw.id
  INNER JOIN users u ON mw.master_id = u.id
  INNER JOIN services s ON ms.service_id = s.id
  INNER JOIN category c ON s.category_id = c.id
  INNER JOIN workexpirience w ON mw.workexp_id = w.id
  GROUP BY u.id, u.firstName, u.lastName, w.coefficient;
  `;
  db.query(mastersDataQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error retrieving masters' });
    }
    res.json(results);
  });
}

module.exports = {
  getAllMasters,
  createMaster,
  deleteMaster,
  updateMaster,
  getMastersData
}