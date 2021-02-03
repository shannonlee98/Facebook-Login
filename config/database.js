class Database {
  constructor( config ) {
      this.connection = config;
  }
  query( sql, args ) {
      return new Promise( ( resolve, reject ) => {
          this.connection.query( sql, args, ( err, rows ) => {
              if ( err )
                  return reject( err );
              resolve( rows );
              return rows;
          } );
      } );
  }
}

const mysql = require('mysql2')
const db = require('./dbconfig')
const con = mysql.createConnection({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database,
})

// con.connect()
con.query(
    'SELECT * FROM user',
    function(err, results, fields) {
        if (err) throw err
        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
    }
);

const database = new Database(con)

module.exports = database