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
    res.render('dummynew');
  })
  router.post('/', (req, res) => {
    console.log("inside newQuizPost")
    const title = req.body.title;
    const author_id = req.session.user_id;
    console.log('author_id = ', author_id)
    const unlisted = req.body.unlisted;
    const link = generateRandomString(6, '8qy3zi');
    console.log('link = ', link)
    const query = req.body.query;
    const correct = req.body.correct;
    const wrong1 = req.body.wrong1;
    const wrong2 = req.body.wrong2;
    const wrong3 = req.body.wrong3l
    console.log('title : ', req.body)
    // const query1 =`INSERT INTO quizzes (title, author_id, unlisted, link) VALUES ($1, $2, $3, $4) RETURNING *;`;
    // const values1 = [title, author_id, unlisted, link];
    // const query2 = `INSERT INTO questions (quiz_id, query, correct_answer, wrong_1, wrong_2, wrong_3) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
    // const values2 = [quizID, query, correct, wrong1, wrong2, wrong3];
    // db.query(query1, values1)
    //   .then((res) => {
    //     console.log(res.rows);
    //     const quizId = res.rows.id; //Check for quizId
    //     db.query(query2, values2)
    //       .then((res) => {
    //         res.json({ })
    //       })

    //   })

      // .then((data) => {
      //   console.log('data = ' , data)
      // })
      // .catch((err) => {
      //   console.log({ err: err.message })
      // })
    res.send(":-)")

  })
  return router;
}
