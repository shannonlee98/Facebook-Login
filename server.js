const http = require ('http')
const hostname = '127.0.0.1'
const port = 8080
const serverPort = 8081

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const router = require('./routes/routes')

// Express
app.listen(port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: 'anystringoftext',
                saveUninitialized: true,
                resave: true,
                cookie: { maxAge: 60000 }
            }));

app.use(express.static(__dirname + '/'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', router);

// Server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end();
});

server.listen(serverPort, hostname, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
