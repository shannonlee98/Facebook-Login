const http = require ('http');
const hostname = '127.0.0.1';
const port = 8080;

// const mysql = require('mysql');
// const db = require('./module');

const express = require('express');
const app = express();

const router = require('./routes');

// Express
app.listen(port);
app.use('/api', router);

// Routes
app.get('/', function(req, res) {
  res.send('Welcome to homepage')
});
app.post('/post-test', (req, res) => {
    console.log('Got body:', req.body);
    res.sendStatus(200);
});


// Server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  // res.end('Hello World');
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});