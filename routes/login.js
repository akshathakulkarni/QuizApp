const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    console.log('inside get route')
    res.render('login', { invalidPass: false, invalidUser: false });
  })
  router.post('/', (req, res) => {
    console.log('inside post route')
    const email = req.body.email;
    const password = req.body.password;
    db.query(`SELECT name, id, password FROM users WHERE email = $1`, [email])
    .then((data) => {
      const name = data.rows[0].name;
      const dbPass = data.rows[0].password;
      if (bcrypt.compareSync(password, dbPass)) {
        req.session.user_id = data.rows[0].id;
        req.session.name = data.rows[0].name;
        console.log('name = ', req.session.name)
        console.log('id = ', req.session.user_id);
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
