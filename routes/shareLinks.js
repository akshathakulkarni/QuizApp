const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/:link', (req, res) => {
    const link = req.params.link;
    const share_link = `localhost:8080/api/quizzes/${link}`;
    res.render('shareLinks', { share_link })
    //res.send(`Please use this link to share : 'localhost:8080/api/quizzes/${link}'`)
  })
  return router;
}
