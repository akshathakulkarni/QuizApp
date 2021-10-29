const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    const userId = req.session.user_id;
    db.query(`SELECT attempts.id as attemptid, attempts.user_id, attempts.quiz_id, attempts.score, attempts.link as attemptlink, x.name as attemptName, quizzes.title, y.name as authorName, quizzes.link as quizlink,
    (SELECT count(*) FROM quizzes_questions WHERE quiz_id = quizzes.id)
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
  router.get('/:link', (req, res) => {
    const link = req.params.link;
    db.query(`SELECT attempts.id as attemptid, attempts.user_id, attempts.quiz_id,
    attempts.score, attempts.link as attemptlink, x.name as attemptName, quizzes.title,
    y.name as authorName, quizzes.link as quizlink,
    (SELECT count(*) FROM quizzes_questions WHERE quiz_id = quizzes.id)
    FROM attempts
    JOIN users x ON x.id = user_id
    JOIN quizzes ON quiz_id = quizzes.id
    JOIN users y ON y.id = quizzes.author_id
    WHERE attempts.link = $1;`, [req.params.link])
    .then(attemptData => {
      const attemptObj = attemptData.rows;
      if (req.session.user_id) {
        db.query('SELECT name FROM users WHERE id = $1', [req.session.user_id])
        .then(nameData => {
          const userName = nameData.rows[0].name;
          res.render('attemptpage', { 'attemptData': attemptObj, 'name': userName });
        })
      } else {
        res.render('attemptpage', { 'attemptData': attemptObj, 'name': null });
      }
    })
    .catch(e => console.log(e));
  })
  const checkScore = function(arr, body) {
    let score = 0;
    for (let i = 0; i < arr.length; i++) {
      if (body[`q${i + 1}`] === arr[i].correct_answer) {
        score ++;
      }
    }
    return score;
  };
  const generateRandomString = function() {
    return Math.random().toString(36).substr(2, 6);
  };
  router.post('/', (req, res) => {
    const userId = req.session.user_id;
    const quizLink = req.headers.referer.split('/')[5];
    db.query(`SELECT quizzes.*, users.name,
    (SELECT count(*) FROM attempts WHERE quiz_id = quizzes.id) as attempts,
    ROUND((SELECT avg(score) FROM attempts WHERE quiz_id = quizzes.id), 1) as avg,
    (SELECT count(*) FROM quizzes_questions WHERE quiz_id = quizzes.id) as count
    FROM quizzes
    JOIN users ON users.id = quizzes.author_id
    WHERE quizzes.link = $1;`, [quizLink])
    .then(quizData => {
      const quizObj = quizData.rows[0];
      const quizId = quizObj.id;
      db.query('SELECT * FROM questions WHERE quiz_id = $1', [quizId])
      .then(questionData => {
        const score = checkScore(questionData.rows, req.body);
        if (userId) {
          const newLink = generateRandomString();
          db.query(`INSERT INTO attempts (user_id, quiz_id, score, link)
          VALUES ($1, $2, $3, $4)`,
          [userId, quizId, score, newLink])
          .then(() => {
            res.redirect(`/api/attempts/${newLink}`);
          })
        } else {
          res.render('tempattempt', {
            'quizData': quizObj,
            'score': score,
            'name': null
          })
        }
      })
    })
    .catch(e => console.log(e))
  })
  return router;
}
