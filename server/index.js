var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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
    if(req.query.name){
        console.log('name input')
        res.statusCode = 200;
        res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
        res.setHeader('Content-Type', 'text/html')
        res.render('front', {name: req.query.name, date: new Date().toISOString().split('T')[0], hasName: true})
    }else{
        console.log('init')
        res.statusCode = 200;
        res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
        res.setHeader('Content-Type', 'text/html')
        res.render("front", {hasName: false});
    }
    
})

app.post('/ttt/play', (req, res) => {
    console.log(req.body)
    board = req.body.grid;

    // check X winner
    if (checkWin('X')){
        sendRes(res, 'X', board);
        return
    }
    var choices = []
    for (let x = 0; x<9; x++){
        if(board[x] == ' '){
            choices.push(x);
        }
    }
    const choice = choices[Math.floor(Math.random() * choices.length)];
    board[choice] = 'O';
    if (checkWin('O')) {
        sendRes(res, 'O', board);
    }

    // check tie
    else if (board.filter((player) => player == ' ').length == 0) {
        sendRes(res, 'T', board)
    }

    else {
        sendRes(res, ' ', board)
    }

})

function checkWin(player){
    let WINNINGCOMBO = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]

    win = false;
    console.log(player)
    for (const combo of WINNINGCOMBO) {
        console.log(board[combo[0]], board[combo[1]], board[combo[2]], player)
        console.log('=============')
        if ( board[combo[0]] === board[combo[1]] && board[combo[2]] === board[combo[0]] && board[combo[0]] === player ){
            win = true;
            break;
        }
    }
    console.log(win)
    return win;
}

function sendRes(res, winner, board) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
    res.send(JSON.stringify({
        grid: board,
        winner: winner
    }))
}

server.listen(3000, function(){
    console.log("server is running on port 3000");
})