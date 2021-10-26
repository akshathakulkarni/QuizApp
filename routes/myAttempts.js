const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    //console.log('Req session:', req.session);
    //console.log('Req params:', req.params)
    const userId = req.session.user_id;
    console.log('myAttempts route has been reached');
    console.log('author id = ', userId);
    db.query(`SELECT attempts.id as attemptid, attempts.user_id, attempts.quiz_id, attempts.score, attempts.link as attemptlink, x.name as attemptName, quizzes.title, y.name as authorName, quizzes.link as quizlink
    FROM attempts
    JOIN users x ON x.id = user_id
    JOIN quizzes ON quiz_id = quizzes.id
    JOIN users y ON y.id = quizzes.author_id
    WHERE x.id = $1;`, [userId])
      .then(data => {
        const attemptData = data.rows;
        db.query('SELECT name FROM users WHERE id = $1', [userId])
        .then(userData => {
          const name = userData.rows[0].name;
          res.render('myattempts', { 'attemptData': attemptData, 'name': name })
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
