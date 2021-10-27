const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    //console.log('Req session:', req.session);
    //console.log('Req params:', req.params)
    author_id = req.session.user_id;
    console.log('author id = ', author_id);
    db.query(`SELECT quizzes.*, users.name FROM quizzes JOIN users ON users.id = quizzes.author_id WHERE quizzes.author_id = $1`, [author_id])
      .then(data => {
        const myQuizzes = data.rows;
        console.log('myQuizzes:', myQuizzes);
        const userName = myQuizzes[0].name;
        res.render("myquizzes", {'myQuizzes': myQuizzes, 'name': userName});
      })
      .catch((err) => {
        res
          .status(500)
          .json({ err: err.message });
      })
  })
  router.get('/:link', (req, res) => {
    //console.log('Req session:', req.session);
    //console.log('Req params:', req.params)
    const link = req.params.link;
    console.log('Cookie ID:', req.session.user_id);
    console.log('We got here, req params', req.params);
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
};
