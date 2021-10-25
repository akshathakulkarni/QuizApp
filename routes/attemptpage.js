const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get('/:link', (req, res) => {
    //console.log('Req session:', req.session);
    //console.log('Req params:', req.params)
    const link = req.params.link;
    console.log('Cookie ID:', req.session.user_id);
    console.log('We got here, req params', req.params);
    db.query(`SELECT * FROM attempts WHERE link = $1`, [link])
      .then(data => {
        console.log('Got here in attempts', data.rows);
        const attemptObj = data.rows[0];
        db.query('SELECT name FROM users WHERE id = $1', [attemptObj.user_id])
        .then(nameData => {
          console.log('name data:', nameData.rows);
          const attemptName = nameData.rows[0].name;
          db.query('SELECT title FROM quizzes WHERE id = $1', [attemptObj.quiz_id])
          .then(quizData =>{
            console.log('Quiz data:', quizData.rows);
            const quizTitle = quizData.rows[0].title;
            db.query('SELECT count(*) FROM questions WHERE quiz_id = $1', [attemptObj.quiz_id])
            .then(questionCountData => {
              console.log('question count', questionCountData.rows);
              const questionCount = questionCountData.rows[0].count;
              db.query('SELECT name FROM users WHERE id = $1', [req.session.user_id])
              .then(userNameData => {
                const userName = userNameData.rows[0].name;
                res.render('attemptpage', {
                  'attemptObj': attemptObj,
                  'attemptName': attemptName,
                  'quizTitle': quizTitle,
                  'questionCount': questionCount,
                  'name': userName
                })
              })
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
