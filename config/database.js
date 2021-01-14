const mysql = require('mysql')
const db = require('./module')
const con = mysql.createConnection({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database
})
con.connect()

module.exports = con