const axios = require('axios');
// const accessTokens = new Set();
const database = require('../config/database')
const fb = require('../config/fbconfig')

async function oauthHandler (req, res) {
  try {
    const authCode = req.query.code;

    // Build up the URL for the API request. `client_id`, `client_secret`,
    // `code`, **and** `redirect_uri` are all required. And `redirect_uri`
    // must match the `redirect_uri` in the dialog URL from Route 1.
    const accessTokenUrl = 'https://graph.facebook.com/v9.0/oauth/access_token?' +
                            `client_id=${fb.app_id}` +
                            `&redirect_uri=${fb.redirect_uri}` +
                            `&client_secret=${fb.client_secret}` +
                            `&code=${authCode}`
    
    // Make an API request to exchange `authCode` for an access token
    const accessToken = await axios.get(accessTokenUrl).then(res => res.data.access_token);

    // Store the token in memory for now. Later we'll store it in the database.
    res.redirect(`/me?accessToken=${accessToken}`);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.response.data || err.message });
  }
}

async function getMeHandler (req, res) {
  try {
    const accessToken = req.query.accessToken;

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
    console.log(data);


    var query = `SELECT * FROM user WHERE email = '${data.email}'`
    database.query(query).then(result => {
      if (result.length == 0) {
        query = `SELECT * FROM user WHERE localEmail = '${data.email}'`
        database.query(query).then(result => {
          if (result.length > 0) {
            // Existing local account matching facebook email
            localStorage.setItem('existing', 'local')
            localStorage.setItem('fbid', data.id)
            localStorage.setItem('email', data.email)
            localStorage.setItem('username', data.first_name + ' ' + data.last_name)
            localStorage.setItem('gender', data.gender)
            localStorage.setItem('birthday', data.birthday)
            return res.redirect('/mergeAccount?existing=local')
          } else {
            // New account from facebook
            var query = 'INSERT INTO user (fbid, email, username, gender, birthday) ' +
                        `VALUES ('${data.id}', '${data.email}', '${data.first_name} ${data.last_name}', '${data.gender}', '${data.birthday}')`;
            database.query(query).then(user => {
              console.log('SUCCESS! New user created:')
              req.session.user = data
              req.session.user.fbid = data.id
              req.session.user.username = data.first_name + ' ' + data.last_name
              res.redirect('/profile')
            });
          }
        })
      } else {
        req.session.user = result[0]
        console.log(result[0])
        res.redirect('/profile')
      }
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.response.data || err.message });
  }
}

module.exports = {
  oauthHandler,
  getMeHandler
}