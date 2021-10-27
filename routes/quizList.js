const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    db.query('SELECT quizzes.*, users.name FROM quizzes JOIN users ON users.id = quizzes.author_id WHERE unlisted = false')
    .then(quizData => {
      const publicQuizzes = quizData.rows;
      if (req.session.user_id) {
        db.query('SELECT name FROM users WHERE id = $1', [req.session.user_id])
        .then(userData => {
          console.log('name in home get:', userData.rows[0].name);
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
