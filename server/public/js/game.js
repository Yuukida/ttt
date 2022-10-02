
squares = Array.from(document.querySelectorAll('.square'));
console.log(squares)

var board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']

squares.forEach(square => {
    square.addEventListener('click', handleClick)
});


function handleClick(e) {
    const square = e.target;
    if (square.innerHTML !== "" && square.innerHTML !== " "){
        sendToServer(null)
        return
    }
    square.innerHTML += 'X';
    board[parseInt(square.id)] = 'X';
    sendToServer(parseInt(square.id));
}

function sendToServer(move) {
    console.log(move)
    fetch('/ttt/play', {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            move: move
        })
    })
    .then((response) => response.json())
    .then((data) => {
        let winner = document.getElementById('winner')
        winner.innerHTML = 'Winner: '
        if (data.winner != ' '){
            let winner = document.getElementById('winner')
            winner.innerHTML = 'Winner: ' + data.winner
            squares.forEach(square => {
                square.innerHTML = ""
            })
            return
        }

        board = data.grid
        console.log(board)
        for (let x=0; x<9; x++) {
            squares[x].innerHTML = board[x]
        }
    });
}