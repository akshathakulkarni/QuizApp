const express = require('express');
const router = express.Router();



const makeNewQuiz = function(data, user) {
  const title = data.title;
  const unlisted = data.unlisted;
  const userID = user.id;
  const link = generateRandomString();
  return pool
  .query(`INSERT INTO quizzes (title, author_id, unlisted, link) VALUES ($1, $2, $3, $4) RETURNING *`,
  [title, userID, unlisted, link])
  .catch(e => console.log(e));
}

const makeNewQuestion = function(data) {
  const quizID = data.quiz_id;
  const query = data.query;
  const correct = data.correct;
  const wrong1 = data.wrong1;
  const wrong2 = data.wrong2;
  const wrong3 = data.wrong3;
  const queryParams = [quizID, query, correct, wrong1, wrong2, wrong3];
  const queryString = `INSERT INTO questions (quiz_id, query, correct_answer, wrong_1, wrong_2, wrong_3) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
  return pool.query(queryString, queryParams)
  .then((res) => {
    const questionID = res.questions.id; //or whatever this ends up being
    return pool.query(`INSERT INTO quizzes_questions (quiz_id, question_id) VALUES ($1, $2) RETURNING *;`,
    [quizID, questionID])
    .catch(e => console.log(e));
  })
}

const generateRandomString = function(length, chars) {
  let result = '';
  for (let i = length; i > 0; i--) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};



module.exports = (db) => {
  router.get('/', (req, res) => {
    console.log('inside get new')
    res.render('dummynew');
  })
  router.post('/', (req, res) => {
    console.log("inside newQuizPost")
    const title = req.body.title;
    const author_id = req.session.user_id;
    console.log('author_id = ', author_id)
    console.log('req = ', req.body)

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

    let obj = req.body
    let dataResult = dataArray(obj)
    console.log(`dataResult: ${JSON.stringify(dataResult)}`)
   // console.log(title, author_id, unlisted)
    const link = generateRandomString(6, '8qy3zi');
    console.log('link = ', link)
    for (let eachObj of dataResult) {
      for (let eachItem in eachObj) {
        console.log(eachItem)
        //console.log('1 = ', eachObj[eachItem][query])
      }
    }

    //console.log('title : ', req.body)
    //const query1 =`INSERT INTO quizzes (title, author_id, unlisted, link) VALUES ($1, $2, $3, $4) RETURNING *;`;
    //const values1 = [title, author_id, unlisted, link];

    // db.query(query1, values1)
    //   .then(data => {
    //     const newQuiz = data.rows;
    //     const quiz_id = data.rows[0].id;
    //     console.log('id = ', quiz_id)
    //     console.log('result = ', newQuiz);
    //     const query2 = `INSERT INTO questions (quiz_id, query, correct_answer, wrong_1, wrong_2, wrong_3) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
    //     const values2 = [quiz_id, query, correct, wrong1, wrong2, wrong3];
    //     db.query(query2, values2)
    //       .then(data => {
    //         const quizQuestionAnswers = data.rows;
    //         const question_id = data.rows[0].id;
    //         console.log('2 = ', quizQuestionAnswers);
    //         const query3 = `INSERT INTO quizzes_questions (quiz_id, question_id) VALUES ($1, $2) RETURNING *;`;
    //         const values3 = [quiz_id, question_id];
    //         db.query(query3, values3)
    //           .then(data => {
    //             const quiz_question_ids = data.rows;
    //             console.log('ids 3 = ', quiz_question_ids)
    //             res.json({ quiz_question_ids });
    //           })

    //       })
    //   })
    //   .catch((err) => {
    //     res
    //       .status(500)
    //       .json({ err: err.message });
    //   })

  })
  return router;
}
