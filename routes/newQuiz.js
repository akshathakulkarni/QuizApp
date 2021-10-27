const express = require('express');
const router = express.Router();


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
    console.log('inside get new')
    res.render('dummynew');
  })
  router.post('/', (req, res) => {
    console.log("inside newQuizPost")
    console.log('req = ', req.body)
    const username = req.session.name;
    console.log('username = ', username)
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
    let unlisted = false;
    if (req.body.unlisted === true) {
      unlisted = true;
    }
    console.log('author_id = ', author_id)
    console.log(title, author_id, unlisted)
    const link = generateRandomString(6, '8qy3zi');
    console.log('link = ', link)
    const templateVars = {
      name : username,
      link : link
    };
    console.log('t = ', templateVars)
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
      console.log(`dataResult: ${JSON.stringify(dataResult)}`)
      console.log('length = ', dataResult.length);
    }
    const query1 =`INSERT INTO quizzes (title, author_id, unlisted, link) VALUES ($1, $2, $3, $4) RETURNING *;`;
    const values1 = [title, author_id, unlisted, link];
    db.query(query1, values1)
      .then(data => {
        const newQuiz = data.rows;
        console.log('quizzes = ', data.rows)
        const quiz_id = data.rows[0].id;
        console.log('id = ', quiz_id);
        console.log('result = ', newQuiz);
        for (let eachObj of dataResult) {
          for (let eachItem in eachObj) {
            if (eachItem === 'query') {
              console.log('question = ', eachObj[eachItem]);
              question = eachObj[eachItem];
            }
            if (eachItem === 'correct') {
              console.log('correct = ', eachObj[eachItem]);
              correct = eachObj[eachItem];
            }
            if (eachItem === 'wrong1') {
              console.log('wrong1 = ', eachObj[eachItem]);
              wrong1 = eachObj[eachItem];
            }
            if (eachItem === 'wrong2') {
              console.log('wrong2 = ', eachObj[eachItem]);
              wrong2 = eachObj[eachItem];
            }
            if (eachItem === 'wrong3') {
              console.log('wrong3 = ', eachObj[eachItem]);
              wrong3 = eachObj[eachItem];
            }
          }
          const query2 = `INSERT INTO questions (quiz_id, query, correct_answer, wrong_1, wrong_2, wrong_3) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
          const values2 = [quiz_id, question, correct, wrong1, wrong2, wrong3];
          db.query(query2, values2)
            .then(data => {
              const quizQuestionAnswers = data.rows;
              const question_id = data.rows[0].id;
              console.log('2 = ', quizQuestionAnswers);
              const query3 = `INSERT INTO quizzes_questions (quiz_id, question_id) VALUES ($1, $2) RETURNING *;`;
              const values3 = [quiz_id, question_id];
              db.query(query3, values3)
                .then(data => {
                  const quiz_question_ids = data.rows;
                  console.log('ids 3 = ', quiz_question_ids)
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
}
