const con = require('../config/database')

function postMessageHandler(req, res) {
  var name = req.body.name
  var email = req.body.email
  var message = req.body.message
  var query = `INSERT INTO messages ( username, email, message )
                VALUES ( '${name}', '${email}', '${message}' );`
  con.query(query, (err) => {
    if (err) 
      throw err;
    res.redirect('/table')
  })
}

function getMessageHandler(req, res) {
  var query = 'SELECT * FROM messages;'
  con.query(query, (err, result) => {
    if (err) 
      throw err
    if (result.length > 0) {
      console.log(result.length)
      res.render('table', { messages: JSON.stringify(result) })
    } else {
      console.log('redirect home')
      res.redirect('/home')
    }
  })
}

module.exports = {
  postMessageHandler,
  getMessageHandler
}


