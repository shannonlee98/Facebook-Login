module.exports = function post(con) {
  console.log('Connected to post')
  var query = "INSERT INTO user (email, password) VALUES ('test@email.com', 'asdf1234')"
  con.query(query, function (req, res) {
    console.log('Insert row')
  })
}