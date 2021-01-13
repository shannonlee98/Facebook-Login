const express = require('express');
const router = express.Router();

const postHandler = require('./postHandler')

const mysql = require('mysql')
const db = require('./module')
const con = mysql.createConnection({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database
})
con.connect()

router.use(express.urlencoded({ extended: true }))
router.use(express.json())

// define the home page route
router.get('/', function (req, res) {
  var query = `SELECT * FROM user WHERE email = '${req.body.email}'`
  con.query(query, (err, result, fields) => {
    var user = result[0]
    res.send(user)
  })
  console.log(req.body.email + " " + req.body.password)
})

// POST method route
router.post('/', (req, res) => {
  var email = req.body.email
  var password = req.body.password
  var query = `INSERT INTO user (email, password) VALUES ('${email}', '${password}')`
  con.query(query, function (req, res) {
    console.log('Insert row')
  })
  res.send('Post api')
})
  
// PUT method route
router.put('/', function(req, res) {
  res.send('Update api')
});

// DELETE method route
router.delete('/', function(req, res) {
  res.send('Delete api')
});

module.exports = router