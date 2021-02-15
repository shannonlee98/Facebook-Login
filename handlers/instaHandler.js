const fb = require('../config/fbconfig')

async function oauthHandler (req, res) {
  const authCode = req.query.code;
  console.log(authCode)

  // Build up the URL for the API request. `client_id`, `client_secret`,
  // `code`, **and** `redirect_uri` are all required. And `redirect_uri`
  // must match the `redirect_uri` in the dialog URL from Route 1.
  // const accessTokenUrl = 'https://graph.facebook.com/v9.0/oauth/access_token?' +
  //                         `client_id=${fb.app_id}` +
  //                         `&redirect_uri=${fb.redirect_uri}` +
  //                         `&client_secret=${fb.client_secret}` +
  //                         `&code=${authCode}`

  // Make an API request to exchange `authCode` for an access token
  // const accessToken = await axios.get(accessTokenUrl).then(res => res.data.access_token);

}

module.exports = {
  oauthHandler
}