const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    db.query(`SELECT * FROM quizzes-questions;`)
      .then(data => {
        const quiz_question_ids = data.rows;
        res.json({ quiz_question_ids });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: err.message });
      })
  })
  return router;
}
