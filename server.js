const http = require ('http')
const hostname = '127.0.0.1'
const port = 8080

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
const path = require('path')

const router = require('./routes/routes')

// Express
app.listen(port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);



// Routes
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'/views/home.html'));
});


// Server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
