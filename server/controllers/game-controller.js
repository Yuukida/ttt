const User = require('../models/user-model')
const Game = require('../models/game-model')
const mongoose = require('mongoose')

function checkWin(board, player){
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
    for (const combo of WINNINGCOMBO) {
        //console.log(board[combo[0]], board[combo[1]], board[combo[2]], player)
        //console.log('=============')
        if ( board[combo[0]] === board[combo[1]] && board[combo[2]] === board[combo[0]] && board[combo[0]] === player ){
            win = true;
            break;
        }
    }
    return win;
}

function sendRes(res, winner, board) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
    res.send(JSON.stringify({
        status: 'OK',
        grid: board,
        winner: winner
    }))
}

function makeMove(board){
    var choices = []
    for (let x = 0; x<9; x++){
        if(board[x] == ' '){
            choices.push(x);
        }
    }
    const choice = choices[Math.floor(Math.random() * choices.length)];
    return choice
}

playTurn = async (user, move, game, res) => {
    if(move === null){
        sendRes(res, ' ', game.grid)
        return
    }
    board = game.grid
    board[parseInt(move)] = 'X'
    if (checkWin(board, 'X')){
        game.winner = 'X'
        await game.save()
        user.currentGame = null
        user.hasGame = false;
        await user.save()
        sendRes(res, 'X', board);
        return
    }

    board[makeMove(board)] = 'O'
    if (checkWin(board, 'O')) {
        game.winner = "O"
        await game.save()
        user.currentGame = null
        user.hasGame = false;
        await user.save()
        sendRes(res, 'O', board);
        return
    }else if(board.filter((player) => player == ' ').length == 0){
        game.winner = "T"
        await game.save()
        user.currentGame = null
        user.hasGame = false;
        await user.save()
        sendRes(res, 'T', board)
        return
    }else{
        await game.save()
        sendRes(res, ' ', board)
    }
}

newGame = async (user, move, res) => {
    const newGame = new Game({
        grid: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        winner: ' ',
        owner: user.username
    })
    const savedNewGame = await newGame.save()
    console.log(savedNewGame)
    user.currentGame = savedNewGame._id // save current game to user
    user.hasGame = true;
    const savedUser = await user.save()
    console.log(savedUser)
    playTurn(savedUser, move, savedNewGame, res)
}


basePage = (req, res) => {
    console.log('base')
    res.statusCode = 200;
    res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
    res.render('base')
}

tttPage = (req, res) => {
    console.log('ttt')
    if(req.session.user){
        console.log('name input')
        res.statusCode = 200;
        res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
        res.setHeader('Content-Type', 'text/html')
        res.render('front', {name: req.session.user, date: new Date().toISOString().split('T')[0], hasName: true})
    }else{
        console.log('init')
        res.statusCode = 200;
        res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
        res.setHeader('Content-Type', 'text/html')
        res.render("front", {hasName: false});
    }
}

playGame = async (req, res) => {
    const {move} = req.body;

    const user = await User.findOne({username: req.session.user})

    if (user.hasGame){ // has current game, check if game finished
        console.log('exist')
        const currentGame = await Game.findOne({_id: user.currentGame})
        playTurn(user, move, currentGame, res) 
    }else{
        console.log('new')
        newGame(user, move, res)
    }
}

listgames = async (req, res) => {
    const user = req.session.user
    const games = await Game.find({owner: user})
    let gamesRes = []

    for (const game of games){
        gamesRes.push({
            id: game._id.toString(),
            start_date: game.createdAt
        })
    }

    res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
    res
    .status(200)
    .json({
        status: 'OK',
        games: gamesRes
    })
}

getgame = async (req, res) => { //id
    res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
    const {id} = req.body
    const game = await Game.findOne({_id: mongoose.Types.ObjectId(id)})

    if(!game) {
        return res
            .status(200)
            .json({
                status: 'ERROR',
                errorMessage: 'invalid game id'
            })
    }

    return res
        .status(200)
        .json({
            status: 'OK',
            grid: game.grid,
            winner: game.winner
        })

}

getscore = async (req, res) => {
    res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
    const user = req.session.user
    const games = await Game.find({owner: user})

    let human = 0
    let wopr = 0
    let tie = 0

    for (const game of games) {
        switch (game.winner) {
            case 'T':
                tie++;
                break;
            case 'X':
                human++
                break;
            case 'O':
                wopr++
                break;
        
            default:
                break;
        }
    }

    res
    .status(200)
    .json({
        status: 'OK',
        human: human,
        wopr: wopr,
        tie: tie
    })
}

module.exports = {
    basePage,
    playGame,
    tttPage,
    listgames,
    getgame,
    getscore
}