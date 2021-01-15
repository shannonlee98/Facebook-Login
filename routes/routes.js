const express = require('express');
const router = express.Router();

const signup = require('../handlers/postHandler').signupHandler
const login = require('../handlers/postHandler').loginHandler

router.use(function(req, res, next){
  req.app.locals.message = ''
  next()
});

router.get('/', (req, res) => { res.render('home.html') })

  
router.get('/signup', (req, res) => {
  res.render('signup.html')
})
router.post('/signup', (req, res) => signup(req, res))

router.get('/login', (req, res) => res.render('login.html'))
router.post('/login', (req, res) => login(req, res))

router.get('/profile', (req, res) => {
  res.render('profile.html', { user: req.session.user })
})

router.get('/logout', (req, res) => {
  res.redirect('/')
})

module.exports = router