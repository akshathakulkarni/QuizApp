const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    res.render('login', { invalidPass: false, invalidUser: false });
  })
  router.post('/', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    db.query(`SELECT name, id, password FROM users WHERE email = $1`, [email])
    .then((data) => {
      const name = data.rows[0].name;
      const dbPass = data.rows[0].password;
      if (bcrypt.compareSync(password, dbPass)) {
        req.session.user_id = data.rows[0].id;
        req.session.name = data.rows[0].name;
        res.redirect('/');
      } else {
        res.render('login', { invalidPass: true, invalidUser: false });
      }
    })
    .catch((err) => {
      res.status(500);
      console.log(err);
      res.render('login', { invalidPass: false, invalidUser: true })
    });
  })
  return router;
}
