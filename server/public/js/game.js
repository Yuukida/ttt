
squares = Array.from(document.querySelectorAll('.square'));
console.log(squares)

var board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']

squares.forEach(square => {
    square.addEventListener('click', handleClick, { once: true})
});


function handleClick(e) {
    const square = e.target;
    square.innerHTML += 'X';
    board[parseInt(square.id)] = 'X';
    sendToServer();
}

function sendToServer() {
    fetch('/ttt/play', {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            grid: board
        })
    })
    .then((response) => response.json())
    .then((data) => {
        
        if (data.winner != ' '){
            let winner = document.getElementById('winner')
            winner.innerHTML = 'Winner: ' + data.winner
            return
        }

        board = data.grid
        for (let x=0; x<9; x++) {
            if(squares[x].innerHTML == '' && board[x] != ' '){
                squares[x].innerHTML += board[x]
            }
        }
    });
}