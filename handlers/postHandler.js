const con = require('../config/database')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const axios = require('axios');
const accessTokens = new Set();
// const {FB, FacebookApiException} = require('fb');
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
          } );
      } );
  }
}
const database = new Database(con)
var client_id = '1068263940305894'
var client_secret = '7ae2ad17d7aa2ee02172bc4e4bf58513'
var redirect_uri = 'http://localhost:8080/oauth-redirect'

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}



function signupHandler(req, res) {
  var email = req.body.email
  var password = req.body.password

  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err)
      throw err;
    var query = `SELECT * FROM user WHERE localEmail = '${email}'`
    database.query(query).then(result => {
      if (result.length > 0) {
        return res.render('signup', { message: 'User already exists: ' + email })
      } else {
        query = `SELECT * FROM user WHERE email = '${email}'`
        database.query(query).then(result => {
          localStorage.setItem('existing', 'facebook')
          localStorage.setItem('email', email)
          localStorage.setItem('hash', hash)
          if (result.length > 0) {
            return res.redirect(`/mergeAccount`)
          } else {
            return res.redirect('/addAccount')
          }
        })
      }
    })
  })
}

function insertUser(email, password) {
  var query = `INSERT INTO user (localEmail, password) VALUES ('${email}', '${password}')`;
  database.query(query, (err) => {
    if (err)
      throw err;
    console.log('SUCCESS! New user created:')
    console.log(' Email: ' + email)
    console.log(' Password: ' + password)
  });
}

function mergeAccountHandler(req, res) {
  if (localStorage.existing == 'facebook') {
    res.render('merge', { accountType: 'facebook' })
  } else if (localStorage.existing == 'local') {
    res.render('merge', { accountType: 'local' })
  } else {
    res.send('wrong merge')
  }
}

function postAccountHandler(req, res) {
  var hash = localStorage.getItem('hash')
  var email = localStorage.getItem('email')
  var username = localStorage.getItem('username')
  var birthday = localStorage.getItem('birthday')
  var gender = localStorage.getItem('gender')
  if (localStorage.existing == 'facebook') {
    // Merge with existing facebook account
    var query = `UPDATE user SET localEmail = '${email}', password = '${hash}' WHERE email = '${email}'`
    database.query(query, (err) => {
      if (err)
        throw err;
      console.log('SUCCESS! User updated:')
    });
    return res.render('login', { message: 'Account merged! Please login' })
  } else if (localStorage.existing == 'local') {
    // Merge with existing local account
    var query = `UPDATE user SET email = '${email}', username = '${username}', gender = '${gender}', birthday = '${birthday}' WHERE localEmail = '${email}'`
    database.query(query, (err) => {
      if (err)
        throw err;
      console.log('SUCCESS! User updated:')
    });
    database.query(`SELECT * FROM user WHERE email = '${email}'`).then(result => {
      req.session.user = result[0]
      return res.redirect('/profile')
    })
  } else {
    res.send('wrong post')
  }
}

function putAccountHandler(req, res) {
  var hash = localStorage.getItem('hash')
  var email = localStorage.getItem('email')
  insertUser(email, hash)
  return res.render('login', { message: 'SUCCESS! Please login' })
}

function loginHandler(req, res) {
  var email = req.body.email
  var password = req.body.password
  var query = `SELECT * FROM user WHERE localEmail = '${email}'`
  database.query(query, (err, result) => {
    if (err) 
      throw err;
    if (result.length > 0) {
      var user = result[0]
       authenticateUser(password, user);
    } else {
      console.log('User invalid')
      req.app.locals.message = 'User invalid'
      res.render('login')
    }
  })

  function authenticateUser(password, user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (err)
        throw err;
      if (result) {
        console.log('SUCCESS! Logging in');
        console.log(' Email: ' + user.email);
        console.log(' Password: ' + user.password);
        req.session.user = user;
        res.redirect('/profile');
      } else {
        console.log('Password invalid');
        req.app.locals.message = 'Password invalid'
        res.render('login');
      }
    });
  }
}

async function oauthHandler (req, res) {
  try {
    const authCode = req.query.code;

    // Build up the URL for the API request. `client_id`, `client_secret`,
    // `code`, **and** `redirect_uri` are all required. And `redirect_uri`
    // must match the `redirect_uri` in the dialog URL from Route 1.
    const accessTokenUrl = 'https://graph.facebook.com/v6.0/oauth/access_token?' +
                            `client_id=${client_id}` +
                            `&redirect_uri=${redirect_uri}` +
                            `&client_secret=${client_secret}` +
                            `&code=${authCode}`;
    
    // Make an API request to exchange `authCode` for an access token
    const accessToken = await axios.get(accessTokenUrl).then(res => res.data.access_token);
    // Store the token in memory for now. Later we'll store it in the database.
    console.log('Access token is', accessToken);
    accessTokens.add(accessToken);


    res.redirect(`/me?accessToken=${accessToken}`);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.response.data || err.message });
  }
}

async function getMeHandler (req, res) {
  try {
    const accessToken = req.query.accessToken;
    if (!accessTokens.has(accessToken)) {
      throw new Error(`Invalid access token "${accessToken}"`);
    }


    // Get the name and user id of the Facebook user associated with the
    // access token.

    const { data } = await axios({
      url: 'https://graph.facebook.com/me',
      method: 'get',
      params: {
        fields: ['id', 'email', 'first_name', 'last_name', 'birthday', 'gender'].join(','),
        access_token: accessToken,
      },
    });
    console.log(data); // { id, email, first_name, last_name, birthday, gender }


    var query = `SELECT * FROM user WHERE email = '${data.email}'`
    database.query(query).then(result => {
      if (result.length == 0) {
        query = `SELECT * FROM user WHERE localEmail = '${data.email}'`
        database.query(query).then(result => {
          if (result.length > 0) {
            // Existing local account matching facebook email
            localStorage.setItem('existing', 'local')
            localStorage.setItem('email', data.email)
            localStorage.setItem('username', data.first_name + ' ' + data.last_name)
            localStorage.setItem('gender', data.gender)
            localStorage.setItem('birthday', data.birthday)
            return res.redirect('/mergeAccount?existing=local')
          } else {
            // New account from facebook
            var query = 'INSERT INTO user (email, username, gender, birthday) ' +
                        `VALUES ('${data.email}', '${data.first_name} ${data.last_name}', '${data.gender}', '${data.birthday}')`;
            database.query(query).then(user => {
              console.log('SUCCESS! New user created:')
              console.log(' Email: ' + data.email)
              req.session.user = data
              req.session.user.username = data.first_name + ' ' + data.last_name
              req.redirect('/profile')
            });
          }
        })
      } else {
        req.session.user = result[0]
        res.redirect('/profile')
      }
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.response.data || err.message });
  }
}


module.exports = {
  signupHandler,
  loginHandler,
  oauthHandler,
  getMeHandler,
  mergeAccountHandler,
  postAccountHandler,
  putAccountHandler
}


