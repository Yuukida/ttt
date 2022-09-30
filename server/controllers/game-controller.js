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

basePage = (req, res) => {
    console.log('base')
    res.statusCode = 200;
    res.setHeader('X-CSE356', '6306cc6d58d8bb3ef7f6b85b');
    res.send('hello')
}

tttPage = (req, res) => {
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
}

playGame = (req, res) => {
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
}

module.exports = {
    basePage,
    playGame,
    tttPage
}