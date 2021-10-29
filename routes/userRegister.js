/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const bcrypt = require("bcrypt");
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render('register');
  });
  router.post("/", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    //const password = req.body.password;
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    const values = [name, email, hashedPassword];
    if (req.body.name === '' || req.body.email === '' || req.body.password === '') {
      res.statusCode = 400;
      return res.send('Error : Invalid username or email or password.');
    }
    db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`, values)
      .then((data) => {
        res.redirect('/');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  })
  return router;
};
