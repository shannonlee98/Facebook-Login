const http = require ('http')
const hostname = '127.0.0.1'
const port = 8080

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session');

const router = require('./routes/routes')

// Express
app.listen(port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: 'anystringoftext',
                saveUninitialized: true,
                resave: true
            }));
app.use('/', router);

app.use(express.static(__dirname + '/'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');



// Routes
app.get('/', function(req, res) {
  res.render('home.html')
  // res.sendFile(path.join(__dirname+'/views/home.html'));
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
