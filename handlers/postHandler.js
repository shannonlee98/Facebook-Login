const con = require('../config/database')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const axios = require('axios');
const accessTokens = new Set();

function signupHandler(req, res) {
  var email = req.body.email
  var password = req.body.password
  var query = `SELECT * FROM user WHERE email = '${email}'`
  con.query(query, (err, result, fields) => {
    if (err) 
      throw err;
    if (result.length > 0) {
      var user = result[0]
      console.log('User already exists: ' + user.email)
      req.app.locals.message = 'That email is already taken'
      res.render('signup')
    } else {
      insertUser(email, password);
      req.app.locals.message = 'SUCCESS! Please login'
      res.render('login')
    }
  })

  function insertUser(email, password) {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      // Store hash in your password DB.
      if (err)
        throw err;
      var query = `INSERT INTO user (email, password) VALUES ('${email}', '${hash}')`;
      con.query(query, (err, result) => {
        if (err)
          throw err;
        console.log('SUCCESS! New user created:')
        console.log(' Email: ' + email)
        console.log(' Password: ' + hash)
      });
    });
  }
}

function loginHandler(req, res) {
  var email = req.body.email
  var password = req.body.password
  var query = `SELECT * FROM user WHERE email = '${email}'`
  con.query(query, (err, result, fields) => {
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
    var client_id = '1068263940305894'
    var client_secret = '7ae2ad17d7aa2ee02172bc4e4bf58513'
    var redirect_uri = 'http://localhost:8080/oauth-redirect'

    // Build up the URL for the API request. `client_id`, `client_secret`,
    // `code`, **and** `redirect_uri` are all required. And `redirect_uri`
    // must match the `redirect_uri` in the dialog URL from Route 1.
    const accessTokenUrl = 'https://graph.facebook.com/v6.0/oauth/access_token?' +
      `client_id=${client_id}&` +
      `client_secret=${client_secret}&` +
      `redirect_uri=${encodeURIComponent(redirect_uri)}&` +
      `code=${encodeURIComponent(authCode)}`;

    // Make an API request to exchange `authCode` for an access token
    const accessToken = await axios.get(accessTokenUrl).then(res => res.data['access_token']);
    // Store the token in memory for now. Later we'll store it in the database.
    console.log('Access token is', accessToken);
    accessTokens.add(accessToken);

    res.redirect(`/me?accessToken=${encodeURIComponent(accessToken)}`);
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
    const data = await axios.get(`https://graph.facebook.com/me?access_token=${encodeURIComponent(accessToken)}`).
      then(res => res.data);

    res.redirect('/profile')

    // return res.send(`
    //   <html>
    //     <body>Your name is ${data.name}</body>
    //   </html>
    // `);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.response.data || err.message });
  }
}


module.exports = {
  signupHandler,
  loginHandler,
  // facebookHandler,
  oauthHandler,
  getMeHandler
}


