const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    db.query(`
    SELECT quizzes.*, users.name,
    (SELECT count(*) FROM attempts WHERE quiz_id = quizzes.id) as attempts,
    ROUND((SELECT avg(score) FROM attempts WHERE quiz_id = quizzes.id), 1) as avg,
    (SELECT count(*) FROM quizzes_questions WHERE quiz_id = quizzes.id) as count
    FROM quizzes
    JOIN users ON users.id = quizzes.author_id
    WHERE unlisted = false;
    `)
    .then(quizData => {
      const publicQuizzes = quizData.rows;
      if (req.session.user_id) {
        db.query('SELECT name FROM users WHERE id = $1', [req.session.user_id])
        .then(userData => {
          const userName = userData.rows[0].name;
          res.render('index', { 'publicQuizzes': publicQuizzes, 'name': userName });
        })
      } else {
        res.render('index', { 'publicQuizzes': publicQuizzes, 'name': null })
      }
    })
    .catch(e => console.log(e));
  })
  return router;
}
