const axios = require('axios')
const https = require('https')
const querystring = require('querystring');
const fb = require('../config/fbconfig')

async function oauthHandler (req, res) {
  const authCode = req.query.code;

const data = querystring.stringify({
  'client_id': '853562015498114',
  'client_secret': '4e6fca8a4126afa4883050273585acc7',
  'grant_type': 'authorization_code',
  'redirect_uri': 'https://shannon.vivita.sg/oauthInsta',
  'code': authCode
})

const options = {
  hostname: 'api.instagram.com',
  path: `/oauth/access_token`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(data)
  }
}

const request = https.request(options, response => {
  // console.log(`STATUS: ${res.statusCode}`)
  response.setEncoding('utf8')

  var body = ''
  response.on('data', chunk => {
    body += chunk
    //console.log(body)
  })
  response.on('end', () => {
    var post = JSON.parse(body)

    https.get(`https://graph.instagram.com/me?fields=id,username&access_token=${post.access_token}`, (result) => {
	console.log('STATUS CODE', result.statusCode)

	var data = ''
	result.on('data', chunk => {
	  data += chunk
	})

	result.on('end', () => {
	  var parsed = JSON.parse(data)
	  console.log(parsed.id)
	  console.log(parsed.username)
	  res.send(parsed)
	})
    }).on('error', (e) => {
      console.error(e)
    })
  })
})

request.on('error', error => {
  console.error(`PROBLEM WITH REQUEST: ${error.message}`)
})

request.write(data)
request.end()

}

module.exports = {
  oauthHandler
}
