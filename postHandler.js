
const mysql = require('mysql')
const db = require('./module')
const con = require('./database')

function getHandler(req, res) {
  var query = `SELECT * FROM user WHERE email = '${req.body.email}'`
  con.query(query, (err, result, fields) => {
    var user = result[0]
    res.send(user)
  })
}

function postHandler(req, res) {
  var email = req.body.email
  var password = req.body.password
  var query = `INSERT INTO user (email, password) VALUES ('${email}', '${password}')`
  con.query(query, function (req, res) {
    console.log('Insert row')
  })
  res.send('Post api: ' + email + ' ' + password)
}


module.exports = {
  postHandler,
  getHandler
}


