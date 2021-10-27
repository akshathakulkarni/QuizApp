const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    //console.log('Req session:', req.session);
    //console.log('Req params:', req.params)
    const userId = req.session.user_id;
    console.log('myAttempts route has been reached');
    console.log('author id = ', userId);
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
          db.query('SELECT title, link FROM quizzes WHERE id = $1', [attemptObj.quiz_id])
          .then(quizData =>{
            console.log('Quiz data:', quizData.rows);
            const quizTitle = quizData.rows[0].title;
            const quizLink = quizData.rows[0].link;
            db.query('SELECT count(*) FROM questions WHERE quiz_id = $1', [attemptObj.quiz_id])
            .then(questionCountData => {
              console.log('question count', questionCountData.rows);
              const questionCount = questionCountData.rows[0].count;
              if (req.session.user_id) {
                db.query('SELECT name FROM users WHERE id = $1', [req.session.user_id])
                .then(userNameData => {
                  const userName = userNameData.rows[0].name;
                  res.render('attemptpage', {
                    'attemptObj': attemptObj,
                    'attemptName': attemptName,
                    'quizTitle': quizTitle,
                    'questionCount': questionCount,
                    'quizLink': quizLink,
                    'name': userName
                  })
                })
              } else {
                res.render('attemptpage', {
                  'attemptObj': attemptObj,
                  'attemptName': attemptName,
                  'quizTitle': quizTitle,
                  'questionCount': questionCount,
                  'quizLink': quizLink,
                  'name': null
                })
              }
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
  router.post('/', (req, res) => {
    console.log(req.body);

  })
  return router;
}
