const con = require('../config/database')
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

function signupHandler(req, res) {
  var email = req.body.email
  var password = req.body.password
  var query = `SELECT * FROM user WHERE email = '${email}'`
  con.query(query, (err, result, fields) => {
    if (err) throw err;
    if (result.length > 0) {
      var user = result[0]
      console.log('User already exists: ' + user.email)
      res.redirect('/signup')
    } else {
      var query = `INSERT INTO user (email, password) VALUES ('${email}', '${password}')`
      con.query(query, (err, result) => {
        if (err) throw err;
        console.log('SUCCESS! New user created:')
        console.log(' Email: ' + email)
        console.log(' Password: ' + password)
      })
      res.redirect('/')
    }
  })
}

function loginHandler(req, res) {
  var email = req.body.email
  var password = req.body.password
  var query = `SELECT * FROM user WHERE email = '${email}'`
  con.query(query, (err, result, fields) => {
    if (err) throw err;
    if (result.length > 0) {
      var user = result[0]
      if (password == user.password) {
        console.log('SUCCESS! Logging in')
        console.log(' Email: ' + user.email)
        console.log(' Password: ' + user.password)

        req.session.user = user
        res.redirect('/profile')
      } else {
        console.log('Password invalid')
        res.redirect('/login')
      }
    } else {
      console.log('User invalid')
      res.redirect('/login')
    }
  })
}

module.exports = {
  signupHandler,
  loginHandler
}


