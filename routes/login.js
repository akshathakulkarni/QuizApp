const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    console.log('inside get route')
    res.render('login', { invalid: false });
  })
  router.post('/', (req, res) => {
    console.log('inside post route')
    const email = req.body.email;
    const password = req.body.password;
    const hash = bcrypt.hashSync(password, 10);
    console.log(hash);
    /*
    db.query(`SELECT name, id FROM users WHERE email = $1 AND password = $2`, [email, hash])
      .then((data) => {
        const name = data.rows[0].name;
        req.session.user_id = data.rows[0].id;
        req.session.name = data.rows[0].name;
        console.log('name = ', req.session.name)
        console.log('id = ', req.session.user_id);
        res.redirect('/');
      })
      .catch((err) => {
        console.log('error catch');
        res.status(500)
          //.json({error: err.message})
          .render('login', { invalid: true });
      });
  })
  */
    db.query(`SELECT name, id, password FROM users WHERE email = $1`, [email])
    .then((data) => {
      const name = data.rows[0].name;
      const dbPass = data.rows[0].password;
      if (bcrypt.compareSync(password, hash)) {
        req.session.user_id = data.rows[0].id;
        req.session.name = data.rows[0].name;
        console.log('name = ', req.session.name)
        console.log('id = ', req.session.user_id);
        res.redirect('/');
      } else {
        res.render('login', { invalid: true });
      }
    })
    .catch((err) => {
      console.log('error catch');
      res.status(500)
        //.json({error: err.message})
        .render('login', { invalid: true });
    });
  })
  return router;
}
