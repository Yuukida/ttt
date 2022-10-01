var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
const session = require('express-session')
const mongoDBSession = require('connect-mongodb-session')(session)
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const dotenv = require('dotenv')
dotenv.config();

const db = require('./db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const store = new mongoDBSession({
    uri: process.env.DB_CONNECT,
    collection: 'sessions'
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'))
app.set('view engine', 'ejs');

app.use(cookieParser())

app.use(
    session({
        secret: "session key",
        resave: false,
        store: store,
        saveUninitialized: false
    })
)

const gameController = require('./routes/game-router')
app.use('/', gameController)


server.listen(3000, function(){
    console.log("server is running on port 3000");
})