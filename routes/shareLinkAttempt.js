const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/:link', (req, res) => {
    console.log("IN share link attempts")
    const link = req.params.link;
    console.log('req = ', req.params)
    const share_link = `localhost:8080/api/attempts/${link}`;
    console.log('link =', share_link)
    res.render('shareLinks', { share_link })
  })
  return router;
}
