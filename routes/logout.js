const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post('/', (req, res) => {
    res.redirect('/');
  })
  return router;
}
