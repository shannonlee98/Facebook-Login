const express = require('express');
const router = express.Router();

const signup = require('../handlers/postHandler').signupHandler
const login = require('../handlers/postHandler').loginHandler
// const facebook = require('../handlers/postHandler').facebookHandler
const oauth = require('../handlers/postHandler').oauthHandler
const getMe = require('../handlers/postHandler').getMeHandler
const mergeAccount = require('../handlers/postHandler').mergeAccountHandler
const postAccount = require('../handlers/postHandler').postAccountHandler
const putAccount = require('../handlers/postHandler').putAccountHandler


var app_id = '1068263940305894'
var redirect_uri = 'http://localhost:8080/oauth-redirect'
var state_param = 'login'

const facebookURL = "https://www.facebook.com/v9.0/dialog/oauth?" +
                    `client_id=${app_id}` +
                    `&redirect_uri=${redirect_uri}` +
                    `&state=${state_param}`

router.use(function(req, res, next){
  req.app.locals.message = ''
  next()
});

router.get('/', (req, res) => { res.render('home.html', { facebookLoginURL: facebookURL}) })
  
router.get('/signup', (req, res) => res.render('signup.html'))
router.post('/signup', (req, res) => signup(req, res))

router.get('/login', (req, res) => res.render('login.html'))
router.post('/login', (req, res) => login(req, res))

// router.get('/facebook', (req, res) => facebook(req, res))
router.get('/oauth-redirect', (req, res) => oauth(req, res))
router.get('/me', (req, res) => getMe(req, res))

router.get('/mergeAccount', (req, res) => mergeAccount(req, res))
router.post('/mergeAccount', (req, res) => postAccount(req, res))
router.get('/addAccount', (req, res) => putAccount(req, res))

router.get('/profile', (req, res) => {
  res.render('profile.html', { user: req.session.user })
})

router.get('/logout', (req, res) => {
  res.redirect('/')
})

module.exports = router