const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post('/', (req, res) => {
    res.session = null;
    res.redirect('/');
  })
  return router;
}
