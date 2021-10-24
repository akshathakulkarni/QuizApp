const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get('/', (req, res) => {
    console.log('inside get route')
    res.render('login');
  })
  router.post('/', (req, res) => {
    console.log('inside post route')
    const email = req.body.email;
    const password = req.body.password;
    db.query(`SELECT name, id FROM users WHERE email = $1 AND password = $2`, [email, password])
      .then((data) => {
        const name = data.rows[0].name;
        req.session.user_id = data.rows[0].id;
<<<<<<< HEAD
        console.log('user id = ', req.session.user_id)
=======
        console.log('id = ', req.session.user_id);
>>>>>>> e7a022e409e226d50b3694490252f838379f2250
        //res.json({ name })
        res.render('index', { name });
      })
      .catch((err) => {
        res
          .status(500)
          .json({error: err.message});
      });
  })
  return router;
}
