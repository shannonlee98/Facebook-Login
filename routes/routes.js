const express = require('express');
const router = express.Router();
const fb = require('../config/fbconfig')

const signup = require('../handlers/localHandler').signupHandler
const login = require('../handlers/localHandler').loginHandler
const oauthFacebook = require('../handlers/facebookHandler').oauthHandler
const getMe = require('../handlers/facebookHandler').getMeHandler
const oauthInsta = require('../handlers/instaHandler').oauthHandler
const mergeAccount = require('../handlers/mergeHandler').mergeAccountHandler
const updateAccount = require('../handlers/localHandler').updateAccountHandler
const addAccount = require('../handlers/localHandler').addAccountHandler

const facebookURL = "https://www.facebook.com/v9.0/dialog/oauth?" +
                    `client_id=${fb.app_id}` +
                    `&redirect_uri=${fb.redirect_uri}` +
                    `&state=${fb.state_param}` +
                    '&scope=user_birthday,user_gender,email'

const instaURL = 'https://api.instagram.com/oauth/authorize' +
              `?client_id=${fb.insta_id}` +
              `&redirect_uri=${fb.insta_uri}` +
              '&scope=user_profile,user_media' +
              '&response_type=code'

router.get('/', (req, res) => { res.render('index.html', { 
  facebookLoginURL: facebookURL, instaLoginURL: instaURL 
}) })
  
router.get('/signup', (req, res) => res.render('signup.html', { message: '' }))
router.post('/signup', (req, res) => signup(req, res))

router.get('/login', (req, res) => res.render('login.html', { message: '' }))
router.post('/login', (req, res) => login(req, res))

router.get('/oauth-redirect', (req, res) => oauthFacebook(req, res))
router.get('/me', (req, res) => getMe(req, res))

router.get('/oauthInsta', (req, res) => oauthInsta(req, res))

router.get('/addAccount', (req, res) => addAccount(req, res))
router.get('/mergeAccount', (req, res) => mergeAccount(req, res))
router.get('/updateAccount', (req, res) => updateAccount(req, res))

router.get('/profile', (req, res) => {
  res.render('profile.html', { user: req.session.user })
})

router.get('/logout', (req, res) => {
  res.redirect('/')
})

module.exports = router