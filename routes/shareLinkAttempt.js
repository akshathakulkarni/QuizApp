const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/:link', (req, res) => {
    console.log("IN share link attempts")
    const link = req.params.link;
    console.log('req = ', req.params)
    const share_link = `localhost:8080/api/attempts/${link}`;
    console.log('link =', share_link)
    if (req.session.user_id) {
      db.query('SELECT name FROM users WHERE id = $1', [req.session.user_id])
      .then(data => {
        const userName = data.rows[0].name;
        res.render('shareLinks', { share_link, 'name': userName });
      })
    } else {
      res.render('shareLinks', { share_link, 'name': null });
    }
  })
  return router;
}
