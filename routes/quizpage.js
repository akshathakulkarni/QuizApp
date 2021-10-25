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
        const authorId = quizData.rows[0].author_id;
        db.query('SELECT * FROM questions WHERE quiz_id = $1', [quizId])
        .then(questionData => {
          console.log('Question data:', questionData.rows);
          db.query('SELECT name FROM users WHERE id = $1', [authorId])
          .then(authorData => {
            console.log('Author data:', authorData.rows);
            console.log('Just the name:', authorData.rows[0].name);
            res.render('quizpage', {
              'quizData': quizData.rows,
              'questionData': questionData.rows,
              'authorName': authorData.rows[0].name
            })
          })
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
