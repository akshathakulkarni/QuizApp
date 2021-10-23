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


