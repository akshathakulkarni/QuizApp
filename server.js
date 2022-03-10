// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const cookieSession = require('cookie-session');
const app = express();
const morgan = require("morgan");
const bcrypt = require("bcrypt");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
const userRegister = require("./routes/userRegister");
const attempts = require("./routes/attempts");
const login = require("./routes/login");
const logout = require("./routes/logout");
const quizList = require("./routes/quizList");
const quizzes = require("./routes/quizzes");
const shareLinkQuiz = require("./routes/shareLinkQuiz");
const shareLinkAttempt = require("./routes/shareLinkAttempt");

// Mount resource routes
app.use("/api/users/register", userRegister(db));
app.use("/api/attempts", attempts(db));
app.use("/api/login", login(db));
app.use("/logout", logout(db));
app.use("/api/quizzes", quizzes(db));
app.use("/api/share/quiz", shareLinkQuiz(db));
app.use("/api/share/attempt", shareLinkAttempt(db));
app.use("/", quizList(db));

app.get("/", (req, res) => {
  const name = '';
  res.render("index", { name });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
