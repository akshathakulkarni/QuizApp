const express = require('express');
const router = express.Router();

const makeNewQuiz = (data, user) => {
  const title = data.title;
  const unlisted = data.unlisted;
  const userID = user.id;
  const link = generateRandomString();
  return pool
  .query(`INSERT INTO quizzes (title, author_id, unlisted, link) VALUES ($1, $2, $3, $4) RETURNING *`,
  [title, userID, unlisted, link])
  .catch(e => console.log(e));
};

module.exports = { makeNewQuiz };

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

module.exports = { makeNewQuestion };

const checkAnswer = function(ans) {
  const query = ans.query;
  const answer = ans.answer;
  const queryString = `SELECT COUNT(*) FROM questions WHERE query = $1 AND correct_answer = $2`;
  return pool.query(queryString, [query, answer])
  .then(res => {
    if (res.number === 1) { // or whatever this is
      return true;
    }
    return false;
  })
  .catch(e => console.log(e));
}

module.exports = { checkAnswer };

