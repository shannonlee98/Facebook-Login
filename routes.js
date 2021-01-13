const express = require('express');
const router = express.Router();

const postHandler = require('./postHandler').postHandler
const getHandler = require('./postHandler').getHandler

router.use(express.urlencoded({ extended: true }))
router.use(express.json())

router.get('/', (req, res) => getHandler(req, res))
router.post('/', (req, res) => postHandler(req, res))
  
// PUT method route
router.put('/', function(req, res) {
  res.send('Update api')
});

// DELETE method route
router.delete('/', function(req, res) {
  res.send('Delete api')
});

module.exports = router