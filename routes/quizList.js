const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    console.log('inside get route');
    const userId = req.session.user_id;
    db.query('SELECT name FROM users WHERE id = $1', [userId])
    .then(userData => {
      console.log('name in home get:', userData.rows[0].name);
      const userName = userData.rows[0].name;
      db.query('SELECT quizzes.*, users.name FROM quizzes JOIN users ON users.id = quizzes.author_id WHERE unlisted = false')
      .then(quizData => {
        res.render('index', { 'publicQuizzes': quizData.rows, 'name': userName });
      })
    })
    .catch(e => console.log(e));
  })
  return router;
}
