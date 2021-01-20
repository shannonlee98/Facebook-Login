const bcrypt = require('bcrypt');
const saltRounds = 10;
const database = require('../config/database')

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./localStorage');
}

async function signupHandler(req, res) {
  var email = req.body.email
  var password = req.body.password

  bcrypt.hash(password, saltRounds, async function (err, hash) {
    if (err)
      throw err;
    var query = `SELECT * FROM user WHERE localEmail = '${email}'`
    database.query(query).then(result => {
      if (result.length > 0) {
        return res.render('signup', { message: 'User already exists: ' + email })
      } else {
        query = `SELECT * FROM user WHERE email = '${email}'`
        database.query(query).then(result => {
          localStorage.setItem('existing', 'facebook')
          localStorage.setItem('email', email)
          localStorage.setItem('hash', hash)
          if (result.length > 0) {
            return res.redirect(`/mergeAccount`)
          } else {
            return res.redirect('/addAccount')
          }
        })
      }
    })
  })
}

function loginHandler(req, res) {
  var email = req.body.email
  var password = req.body.password
  var query = `SELECT * FROM user WHERE localEmail = '${email}'`
  database.query(query, (err, result) => {
    if (err) 
      throw err;
    if (result.length > 0) {
      var user = result[0]
       authenticateUser(password, user);
    } else {
      console.log('User invalid')
      res.render('login', { message: 'User invalid' })
    }
  })

  function authenticateUser(password, user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (err)
        throw err;
      if (result) {
        console.log('SUCCESS! Logging in');
        console.log(' Email: ' + user.localEmail);
        console.log(' Password: ' + user.password);
        req.session.user = user;
        res.redirect('/profile');
      } else {
        console.log('Password invalid');
        res.render('login', { message: 'Password invalid' })
      }
    });
  }
}

function addAccountHandler(req, res) {
  var hash = localStorage.getItem('hash')
  var email = localStorage.getItem('email')
  insertUser(email, hash)
  return res.render('login', { message: 'SUCCESS! Please login' })
}

function insertUser(email, password) {
  var query = `INSERT INTO user (localEmail, password) VALUES ('${email}', '${password}')`;
  database.query(query, (err) => {
    if (err)
      throw err;
    console.log('SUCCESS! New user created:')
    console.log(' Email: ' + email)
    console.log(' Password: ' + password)
  });
}

function updateAccountHandler(req, res) {
  var hash = localStorage.getItem('hash')
  var email = localStorage.getItem('email')
  var username = localStorage.getItem('username')
  var birthday = localStorage.getItem('birthday')
  var gender = localStorage.getItem('gender')
  if (localStorage.existing == 'facebook') {
    // Merge with existing facebook account
    var query = `UPDATE user SET localEmail = '${email}', password = '${hash}' WHERE email = '${email}'`
    database.query(query, (err) => {
      if (err)
        throw err;
      console.log('SUCCESS! User updated:')
    });
    return res.render('login', { message: 'Account merged! Please login' })
  } else if (localStorage.existing == 'local') {
    // Merge with existing local account
    var query = `UPDATE user SET email = '${email}', username = '${username}', gender = '${gender}', birthday = '${birthday}' WHERE localEmail = '${email}'`
    database.query(query, (err) => {
      if (err)
        throw err;
      console.log('SUCCESS! User updated:')
    });
    database.query(`SELECT * FROM user WHERE email = '${email}'`).then(result => {
      req.session.user = result[0]
      return res.redirect('/profile')
    })
  } else {
    res.send('nothing updated')
  }
}


module.exports = {
  signupHandler,
  addAccountHandler,
  loginHandler,
  updateAccountHandler
}


