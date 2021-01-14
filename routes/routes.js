const express = require('express');
const router = express.Router();

// const post = require('../handlers/postHandler').postHandler
// const get = require('../handlers/postHandler').getHandler
const signup = require('../handlers/postHandler').signupHandler
const login = require('../handlers/postHandler').loginHandler

router.get('/', (req, res) => {
  let sess = req.session
  res.render('home.html')
})

// router.post('/api', (req, res) => post(req, res))
// router.get('/api', (req, res) => get(req, res))
  
router.get('/signup', (req, res) => res.render('signup.html'))
router.post('/signup', (req, res) => signup(req, res))

router.get('/login', (req, res) => res.render('login.html'))
router.post('/login', (req, res) => login(req, res))

router.get('/profile', (req, res) => {
  res.render('profile.html', { user: req.session.user })
})

router.get('/logout', (req, res) => {
  res.redirect('/')
})

// PUT method route
router.put('/', function(req, res) {
  res.send('Update api')
});

// DELETE method route
router.delete('/', function(req, res) {
  res.send('Delete api')
});

module.exports = router