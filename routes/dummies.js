const express = require('express');
const router = express.Router();

module.exports = (db) => {
  /*
  router.get('/', (req, res) => {
    db.query(`SELECT * FROM attempts;`)
      .then(data => {
        const attempts = data.rows;
        res.json({ attempts });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ err: err.message });
      })
  })
  */
  router.get('/dummyquiz', (req, res) => {
    res.render('dummyquiz');
  });
  return router;
}
