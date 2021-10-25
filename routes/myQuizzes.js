const express = require("express");
const router = express.Router();

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
  return router;
}
