var board;
var score = 0;
var rows = 4;
var columns = 4;
var boardHistory = [];
var scoreHistory = [];
var redoBoardHistory = [];
var redoScoreHistory = [];


window.onload= function(){
    setGame();
}

function setGame(){
    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]

    for(let r=0; r<rows; r++){
        for(let c=0; c<columns; c++){
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile,num);
            document.getElementById("board").append(tile);
        }
    }

    setTwo();
    setTwo();
}


function hasEmptyTile() {
    for (let r=0; r<rows; r++){
        for (let c=0; c<columns; c++){
            if (board[r][c] == 0){
                return true;
            }
        }
    }
    return false;
}

function setTwo(){
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while(!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if(board[r][c] == 0){
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function updateTile(tile,num){
    tile.innerText = "";
    tile.classList.value = ""; 
    tile.classList.add("tile");
    if (num > 0){
        tile.innerText = num;
        if(num <= 2048) {
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x4096");
        }
    }
}

document.addEventListener("keyup",(e) => {

    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();
    }
    else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }

    isGameOver();

    document.getElementById("score").innerText = score;
})

function filterZero(row){
    return row.filter(num => num != 0);
}

function slide(row){
    row = filterZero(row);
    for(let i=0; i<row.length-1; i++){
        if(row[i] == row[i+1]){
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    while (row.length < columns){
        row.push(0);
    }
    return row;
}

function slideLeft(){
    saveState();
    for (let r=0; r<rows; r++){
        let row = board[r];
        row = slide(row);
        board[r] = row;

        for(let c=0; c<columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
}

function slideRight(){
    saveState();
    for (let r=0; r<rows; r++){
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for(let c=0; c<columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
}

function slideUp(){
    saveState();
    for (let c=0; c <columns; c++){
        let row = [board[0][c], board[1][c],board[2][c],board[3][c]];
        row = slide(row);
        for(let r=0; r<rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
}

function slideDown(){
    saveState();
    for (let c=0; c <columns; c++){
        let row = [board[0][c], board[1][c],board[2][c],board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for(let r=0; r<rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
}

function saveState() {
    boardHistory.push(board.map(row => row.slice()));
    scoreHistory.push(score);
    redoBoardHistory = [];
    redoScoreHistory = [];
}

function undo() {
    if (boardHistory.length > 0) {
        redoBoardHistory.push(board.map(row => row.slice()));
        redoScoreHistory.push(score);

        board = boardHistory.pop();
        score = scoreHistory.pop();

        updateBoard();
    }
}

function updateBoard() {
    for(let r=0; r<rows; r++){
        for(let c=0; c<columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    document.getElementById("score").innerText = score;
}

function redo() {
    if (redoBoardHistory.length > 0) {
        boardHistory.push(board.map(row => row.slice()));
        scoreHistory.push(score);

        board = redoBoardHistory.pop();
        score = redoScoreHistory.pop();

        updateBoard();
    }
}

document.getElementById('undoButton').addEventListener('click', undo);
document.getElementById('redoButton').addEventListener('click', redo);


function isGameOver() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                return false;
            }
        }
    }
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 1; c++) {
            if (board[r][c] === board[r][c + 1]) {
                return false;
            }
        }
    }
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 1; r++) {
            if (board[r][c] === board[r + 1][c]) {
                return false;
            }
        }
    }
    showGameOverDialog();
    return true;
}

function showGameOverDialog() {
    const dialog = document.getElementById('gameOverDialog');
    const finalScore = document.getElementById('finalScore');
    finalScore.innerText = score;
    dialog.showModal();
}

document.getElementById('restartButton').addEventListener('click', () => {
    const dialog = document.getElementById('gameOverDialog');
    dialog.close();
    restartGame();
});
  
function restartGame() {
    // Reset the game state
    score = 0;
    board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    document.getElementById('board').innerHTML = '';
    setGame();
    document.getElementById('score').innerText = score;
}
  