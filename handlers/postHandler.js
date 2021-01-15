const con = require('../config/database')
const bcrypt = require('bcrypt');
const { localsName } = require('ejs');
const saltRounds = 10;

function signupHandler(req, res) {
  var email = req.body.email
  var password = req.body.password
  var query = `SELECT * FROM user WHERE email = '${email}'`
  con.query(query, (err, result, fields) => {
    if (err) 
      throw err;
    if (result.length > 0) {
      var user = result[0]
      console.log('User already exists: ' + user.email)
      req.app.locals.message = 'That email is already taken'
      res.render('signup')
    } else {
      insertUser(email, password);
      req.app.locals.message = 'SUCCESS! Please login'
      res.render('login')
    }
  })

  function insertUser(email, password) {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      // Store hash in your password DB.
      if (err)
        throw err;
      var query = `INSERT INTO user (email, password) VALUES ('${email}', '${hash}')`;
      con.query(query, (err, result) => {
        if (err)
          throw err;
        console.log('SUCCESS! New user created:')
        console.log(' Email: ' + email)
        console.log(' Password: ' + hash)
      });
    });
  }
}

function loginHandler(req, res) {
  var email = req.body.email
  var password = req.body.password
  var query = `SELECT * FROM user WHERE email = '${email}'`
  con.query(query, (err, result, fields) => {
    if (err) 
      throw err;
    if (result.length > 0) {
      var user = result[0]
      authenticateUser(password, user);
    } else {
      console.log('User invalid')
      req.app.locals.message = 'User invalid'
      res.render('login')
    }
  })

  function authenticateUser(password, user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (err)
        throw err;
      if (result) {
        console.log('SUCCESS! Logging in');
        console.log(' Email: ' + user.email);
        console.log(' Password: ' + user.password);

        req.session.user = user;
        res.redirect('/profile');
      } else {
        console.log('Password invalid');
        req.app.locals.message = 'Password invalid'
        res.render('login');
      }
    });
  }
}

module.exports = {
  signupHandler,
  loginHandler
}


