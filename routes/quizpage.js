const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get('/:link', (req, res) => {
    //console.log('Req session:', req.session);
    //console.log('Req params:', req.params)
    const link = req.params.link;
    console.log('Cookie ID:', req.session.user_id);
    console.log('We got here, req params', req.params);
    /*
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
            if (req.session.user_id) {
              db.query('SELECT name FROM users WHERE id = $1', [req.session.user_id])
              .then(loginData => {
                res.render('quizpage', {
                  'quizData': quizData.rows,
                  'questionData': questionData.rows,
                  'authorName': authorData.rows[0].name,
                  'name': loginData.rows[0].name
                })
              })
            } else {
              res.render('quizpage', {
                'quizData': quizData.rows,
                'questionData': questionData.rows,
                'authorName': authorData.rows[0].name,
                'name': null
              })
            }
          })
        })
      })
      .catch((err) => {
        res
          .status(500)
          .json({ err: err.message });
      })
      */
      db.query(`SELECT quizzes.*, questions.*, (SELECT name FROM users WHERE id = quizzes.author_id) as author
      FROM quizzes_questions
      JOIN quizzes ON quiz_id = quizzes.id
      JOIN questions ON question_id = questions.id
      WHERE quizzes.link = $1;`, [link])
      .then(data => {
        console.log(data.rows);
        if (req.session.user_id) {
          db.query('SELECT name FROM users WHERE id = $1', [req.session.user_id])
          .then(nameData => {
            res.render('quizpage', { 'quizData': data.rows, 'name': nameData.rows[0].name });
          })
        } else {
          res.render('quizpage', { 'quizData': data.rows, 'name': null });
        }
      })
      .catch(e=> console.log(e));
  })
  return router;
}
