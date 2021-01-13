const express = require('express');
const router = express.Router();

const post = require('../handlers/postHandler').postHandler
const get = require('../handlers/postHandler').getHandler

router.post('/api', (req, res) => post(req, res))
router.get('/api', (req, res) => get(req, res))
  
// PUT method route
router.put('/', function(req, res) {
  res.send('Update api')
});

// DELETE method route
router.delete('/', function(req, res) {
  res.send('Delete api')
});

module.exports = router