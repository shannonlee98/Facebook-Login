const express = require('express');
const router = express.Router();
const fb = require('../config/fbconfig')

const signup = require('../handlers/localHandler').signupHandler
const login = require('../handlers/localHandler').loginHandler
const oauth = require('../handlers/facebookHandler').oauthHandler
const getMe = require('../handlers/facebookHandler').getMeHandler
const mergeAccount = require('../handlers/mergeHandler').mergeAccountHandler
const updateAccount = require('../handlers/localHandler').updateAccountHandler
const addAccount = require('../handlers/localHandler').addAccountHandler

const facebookURL = "https://www.facebook.com/v9.0/dialog/oauth?" +
                    `client_id=${fb.app_id}` +
                    `&redirect_uri=${fb.redirect_uri}` +
                    `&state=${fb.state_param}` +
                    '&scope=user_birthday,user_gender,public_profile'

// console.log(facebookURL)

router.get('/', (req, res) => { res.render('home.html', { facebookLoginURL: facebookURL}) })
  
router.get('/signup', (req, res) => res.render('signup.html', { message: '' }))
router.post('/signup', (req, res) => signup(req, res))

router.get('/login', (req, res) => res.render('login.html', { message: '' }))
router.post('/login', (req, res) => login(req, res))

router.get('/oauth-redirect', (req, res) => oauth(req, res))
router.get('/me', (req, res) => getMe(req, res))

router.get('/addAccount', (req, res) => addAccount(req, res))
router.get('/mergeAccount', (req, res) => mergeAccount(req, res))
router.get('/updateAccount', (req, res) => updateAccount(req, res))

router.get('/profile', (req, res) => {
  res.render('profile.html', { user: req.session.user })
})

router.get('/logout', (req, res) => {
  res.redirect('/')
})

router.get('/message', (req, res) => res.render('message'))
router.post('/message', (req, res) => postMessage(req, res))
router.get('/table', (req, res) => showTable(req, res))

module.exports = router