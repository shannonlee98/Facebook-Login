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

const mysql = require('mysql')
const db = require('./dbconfig')
const con = mysql.createConnection({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database
})
con.connect()

const database = new Database(con)

module.exports = database