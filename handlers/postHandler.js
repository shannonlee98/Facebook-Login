const con = require('../config/database')

function postHandler(req, res) {
  var email = req.body.email
  var password = req.body.password
  var query = `INSERT INTO user (email, password) VALUES ('${email}', '${password}')`
  con.query(query, function (req, res) {
    console.log('Insert row')
  })
  console.log('Post api: ' + email + ' ' + password)
  res.redirect('/')
}

function getHandler(req, res) {
  var email = req.query.email
  var password = req.query.password
  var query = `SELECT * FROM user WHERE email = '${req.query.email}'`
  con.query(query, (err, result, fields) => {
    var user = result[0]
    console.log('Found user: ' + user.email)
  })
  console.log('Get api: ' + email + ' ' + password)
  res.redirect('/')
}


module.exports = {
  postHandler,
  getHandler
}


