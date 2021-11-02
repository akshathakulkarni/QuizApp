QuizApp
=========

## Description

This is a simple, node-based full-stack web app designed for creating and taking simple, multiple-choice quizzes. In this app, users can:

- View a list of public quizzes on the homepage of the app
- Login or register to the database with their email and password
- Take any quiz, whether logged in or out, and immediately see their score
- Share a quiz with a unique link
- Share an attempt at a quiz by a registered user, with a unique link
- If logged in, save their attempts
- If logged in, create a quiz with any number of questions they want


## Behind the Scenes

This app was created as a midterm project by myself (Stéphane Krims) and Akshatha Kulkarni, as part of the requirements for our completion of Lighthouse Labs' Web Development Flex Course.

The app's creation took place from October 19-29, 2021, and we presented the app to our classmates and instructors on October 30.

As of this writing (Nov 2), the app is fully functional in its basic capabilities. However, there are some stretch (optional) functionalities we would have liked to include as well, such as:

- Allowing users to see which questions they got right and wrong
- Allowing users to delete and edit quizzes
- Allowing users to change their minds about how many questions their quiz has, rather than (as it is now) being forced to make however many questions are in the "create new quiz" form, depending on how many times they clicked the "add new question" button

## Installation instructions

If you'd like to try this app yourself:

1. Fork and clone this repository into your machine
2. Run the command `npm run local`. This will get the server running on port 8080.
3. Type `localhost:8080` in the address bar of your browser. You should see the home page of the app.

If you'd like to see some preset quizzes we've made, you can implement the seeds in this repo with psql. The username and password are both `labber`.
You can also use the `npm run db:reset` command. (note: this command will drop any users, quizzes or attempts that you have made yourself - use with caution!)

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
