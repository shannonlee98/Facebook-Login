const mysql = require('mysql');
const db = require('./module')

var con = mysql.createConnection({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "select name, address from customers";
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log(fields);
    });
  });