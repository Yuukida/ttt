var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'))
app.set('view engine', 'ejs');

const gameController = require('./routes/game-router')
app.use('/', gameController)

server.listen(3000, function(){
    console.log("server is running on port 3000");
})