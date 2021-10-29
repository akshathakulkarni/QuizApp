const express = require('express');
const router  = express.Router();

const generateRandomString = function(length, chars) {
  let result = '';
  for (let i = length; i > 0; i--) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

const dataArray = (obj) => {
  let result = []
    for(let i = 0; i < obj["query"].length; i++){
        let tempObj = {}
        tempObj["query"] = obj["query"][i]
        tempObj["correct"] = obj["correct"][i]
        tempObj["wrong1"] = obj["wrong1"][i]
        tempObj["wrong2"] = obj["wrong2"][i]
        tempObj["wrong3"] = obj["wrong3"][i]
        result.push(tempObj)
    }
    return result
}

module.exports = (db) => {
  router.get('/', (req, res) => {
    author_id = req.session.user_id;
    db.query(`
    SELECT quizzes.*, users.name,
    (SELECT count(*) FROM attempts WHERE quiz_id = quizzes.id) as attempts,
    ROUND((SELECT avg(score) FROM attempts WHERE quiz_id = quizzes.id), 1) as avg,
    (SELECT count(*) FROM quizzes_questions WHERE quiz_id = quizzes.id) as count
    FROM quizzes
    JOIN users ON users.id = quizzes.author_id
    WHERE quizzes.author_id = $1;
    `, [author_id])
      .then(data => {
        const myQuizzes = data.rows;
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
    const link = req.params.link;
    db.query(`SELECT quizzes.*, questions.*, (SELECT name FROM users WHERE id = quizzes.author_id) as author
    FROM quizzes_questions
    JOIN quizzes ON quiz_id = quizzes.id
    JOIN questions ON question_id = questions.id
    WHERE quizzes.link = $1;`, [link])
    .then(data => {
      data.rows.sort((a, b) => a.id - b.id); // is this line necessary?
      const ansArr = [];
      for (const q of data.rows) {
        ansArr.push([q.correct_answer, q.wrong_1, q.wrong_2, q.wrong_3]);
      }
      ansArr.map(arr => arr.sort(() => Math.random() - 0.5));
      const refQuestion = data.rows[0];
      const quizObj = {
        'id': refQuestion.quiz_id,
        'title': refQuestion.title,
        'unlisted': refQuestion.unlisted,
        'link': link,
        'author': refQuestion.author
      }
      const outgoingArr = [];
      for (let i = 0; i < data.rows.length; i++) {
        outgoingArr.push({
          'id': data.rows[i].id,
          'query': data.rows[i].query,
          'ans1': ansArr[i][0],
          'ans2': ansArr[i][1],
          'ans3': ansArr[i][2],
          'ans4': ansArr[i][3]
        })
      }
      if (req.session.user_id) {
        db.query('SELECT name FROM users WHERE id = $1', [req.session.user_id])
        .then(nameData => {
          res.render('quizpage', {
            'quizData': quizObj,
            'questionData': outgoingArr,
            'name': nameData.rows[0].name
          })
          //res.render('quizpage', { 'quizData': data.rows, 'name': nameData.rows[0].name });
        })
      } else {
        res.render('quizpage', {
          'quizData': quizObj,
          'questionData': outgoingArr,
          'name': null
        })
        //res.render('quizpage', { 'quizData': data.rows, 'name': null });
      }
    })
    .catch(e=> console.log(e));
  })

  router.get('/new/quizform', (req, res) => {
    if (req.session.user_id) {
      db.query('SELECT name FROM users WHERE id = $1', [req.session.user_id])
      .then(nameData => {
        const userName = nameData.rows[0].name;
        res.render('CreateQuizForm', { 'name': userName });
      })
      .catch(e => console.log(e));
    } else {
      res.render('CreateQuizForm', { 'name': null });
    }
  });

  router.post('/', (req, res) => {
    const username = req.session.name;
    let obj = req.body;
    let dataResult = [];
    let dataObj = {};
    let question = '';
    let correct = '';
    let wrong1 = '';
    let wrong2 = '';
    let wrong3 = '';
    const title = req.body.title;
    const author_id = req.session.user_id;
    console.log('Req body unlisted', req.body.unlisted);
    let unlisted = false;
    console.log('unlisted var before it', unlisted);
    if (req.body.unlisted) {
      unlisted = true;
    }
    console.log('unlisted var after if', unlisted);
    const link = generateRandomString(6, '8qy3zi');
    const templateVars = {
      name : username,
      link : link
    };
    if (typeof(obj['query']) === 'string') {
        dataObj = {
        query: obj['query'],
        correct: obj['correct'],
        wrong1: obj['wrong1'],
        wrong2: obj['wrong2'],
        wrong3: obj['wrong3']
      };
      dataResult = [ dataObj ];
    } else {
      dataResult = dataArray(obj)
    }
    const query1 =`INSERT INTO quizzes (title, author_id, unlisted, link) VALUES ($1, $2, $3, $4) RETURNING *;`;
    const values1 = [title, author_id, unlisted, link];
    db.query(query1, values1)
      .then(data => {
        const newQuiz = data.rows;
        const quiz_id = data.rows[0].id;
        for (let eachObj of dataResult) {
          for (let eachItem in eachObj) {
            if (eachItem === 'query') {
              question = eachObj[eachItem];
            }
            if (eachItem === 'correct') {
              correct = eachObj[eachItem];
            }
            if (eachItem === 'wrong1') {
              wrong1 = eachObj[eachItem];
            }
            if (eachItem === 'wrong2') {
              wrong2 = eachObj[eachItem];
            }
            if (eachItem === 'wrong3') {
              wrong3 = eachObj[eachItem];
            }
          }
          const query2 = `INSERT INTO questions (quiz_id, query, correct_answer, wrong_1, wrong_2, wrong_3) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
          const values2 = [quiz_id, question, correct, wrong1, wrong2, wrong3];
          db.query(query2, values2)
            .then(data => {
              const quizQuestionAnswers = data.rows;
              const question_id = data.rows[0].id;
              const query3 = `INSERT INTO quizzes_questions (quiz_id, question_id) VALUES ($1, $2) RETURNING *;`;
              const values3 = [quiz_id, question_id];
              db.query(query3, values3)
                .then(data => {
                  const quiz_question_ids = data.rows;
                })

            })
        }
      })
      .catch((err) => {
        res
          .status(500)
          .json({ err: err.message });
      })
      res.render('postNewQuiz', templateVars);

  })
  return router;
};
