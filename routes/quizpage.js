const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get('/:link', (req, res) => {
    //console.log('Req session:', req.session);
    //console.log('Req params:', req.params)
    const link = req.params.link;
    console.log('We got here, req params', req.params);
    db.query(`SELECT * FROM quizzes WHERE link = $1`, [link])
      .then(quizData => {
        console.log('Data rows:', quizData.rows);
        const quizId = quizData.rows[0].id;
        db.query('SELECT * FROM questions WHERE quiz_id = $1', [quizId])
        .then(questionData => {
          console.log('Question data:', questionData.rows);
        })
      })
      .catch((err) => {
        res
          .status(500)
          .json({ err: err.message });
      })
  })
  return router;
}
