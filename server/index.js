var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + 'public'))
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    console.log('base')
    res.statusCode = 200;
    res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
    res.send('hello')
})

app.get('/ttt', function(req, res) {
    console.log('ttt')
    console.log(req);
    if(req.query.name){
        res.statusCode = 200;
        res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
        res.setHeader('Content-Type', 'text/html')
        res.render('front', {name: req.query.name, date: new Date().toISOString().split('T')[0], hasName: true})
    }else{
        res.statusCode = 200;
        res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
        res.render("front", {hasName: false});
    }
    
})

server.listen(3000, function(){
    console.log("server is running on port 3000");
})