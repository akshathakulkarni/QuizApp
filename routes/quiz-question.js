const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    db.query(`SELECT * FROM quizzes_questions;`)
      .then(data => {
        const quiz_questionIds = data.rows;
        res.json({ quiz_questionIds });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: err.message });
      })
  })
  return router;
}
