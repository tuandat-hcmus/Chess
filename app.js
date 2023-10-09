'use strict';

/* Global variables */
const chessBoard = document.getElementById('chess-board');

const startPieces = [
    ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
    ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn'],
    ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook']
];

let colorMatrix = [
    ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black'],
    ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'],
    ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white']
];

const blackPiece = ['rook', 'knight', 'bishop', 'queen', 'king', 'pawn'];
const whitePiece = ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Pawn'];

const piecesMap = {
    rook: '♜',
    knight: '♞',
    bishop: '♝',
    queen: '♛',
    king: '♚',
    pawn: '♟',
    Rook: '♖',
    Knight: '♘',
    Bishop: '♗',
    Queen: '♕',
    King: '♔',
    Pawn: '♙'
}

let playerTurn = 'white';
let dragged; // piece are being dragged
let moveList = [];
let attackList = [];
let oldX = 0;
let oldY = 0;

// movement array
const whitePawnMove = [[-1, 0], [-2, 0]];
const blackPawnMove = [[1, 0], [2, 0]];
const whitePawnAttack = [[-1, -1], [-1, 1]];
const blackPawnAttack = [[1, -1], [1, 1]];
const knightMove = [[-2, -1], [-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2]];
const knightAttack = knightMove;
const rookMove = [[-1, 0], [0, 1], [1, 0], [0, -1]];
const rookAttack = rookMove;
const bishopMove = [[-1, -1], [-1, 1], [1, 1], [1, -1]];
const bishopAttack = bishopMove;
const queenMove = [...bishopMove, ...rookMove];
const queenAttack = queenMove;
const kingMove = queenMove;
const kingAttack = kingMove;


// function declaration //

function createBoard() {
    for (let i = 0; i < 64; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        let row = Math.floor(i / 8);
        cell.id = `${row}${i % 8}`;
        if (!(row % 2)) {
            cell.classList.add(i % 2 === 0 ? 'white-cell' : 'black-cell');
        }
        else {
            cell.classList.add(i % 2 === 0 ? 'black-cell' : 'white-cell');
        }
        chessBoard.appendChild(cell);
    }
}

function initPieces() {
    const cellList = chessBoard.childNodes;
    for (let i = 0; i < cellList.length; i++) {
        let rowIndex = Math.floor(i / 8);
        let piece = startPieces[rowIndex][i % 8];
        if (piece !== ' ') {
            const chessPiece = document.createElement('div');
            chessPiece.classList.add('piece');
            chessPiece.classList.add(whitePiece.includes(piece) ? 'white' : 'black');
            chessPiece.id = piece;
            chessPiece.draggable = chessPiece.classList.contains(playerTurn) ? true : false;
            chessPiece.innerText = piecesMap[piece];
            cellList[i].appendChild(chessPiece);
        }
    }
}

// return ids of cells that dragged piece can move to
function getMove(x, y, piece) {
    piece = piece.toLowerCase();
    let res = [];
    switch (piece) {
        case 'pawn':
            if (playerTurn === 'white') {
                if (x === 6) {
                    whitePawnMove.forEach(item => {
                        let dx = x + item[0];
                        let dy = y + item[1];
                        if (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] === ' ') {
                            res.push(`${dx}${dy}`);
                        }
                    });
                }
                else {
                    let dx = x + whitePawnMove[0][0];
                    let dy = y + whitePawnMove[0][1];
                    if (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] === ' ') {
                        res.push(`${dx}${dy}`);
                    }
                }
            }

            else {
                if (x === 1) {
                    blackPawnMove.forEach(item => {
                        let dx = x + item[0];
                        let dy = y + item[1];
                        if (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] === ' ') {
                            res.push(`${dx}${dy}`);
                        }
                    });
                }
                else {
                    let dx = x + blackPawnMove[0][0];
                    let dy = y + blackPawnMove[0][1];
                    if (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] === ' ') {
                        res.push(`${dx}${dy}`);
                    }
                }
            }
            break;
        case 'knight':
            knightMove.forEach(item => {
                let dx = x + item[0];
                let dy = y + item[1];
                if (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] === ' ') {
                    res.push(`${dx}${dy}`);
                }
            });
            break;
        case 'rook':
            rookMove.forEach(item => {
                let count = 1;
                let dx = x + item[0] * count;
                let dy = y + item[1] * count;
                while (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] === ' ') {
                    count++;
                    res.push(`${dx}${dy}`);
                    dx = x + item[0] * count;
                    dy = y + item[1] * count;
                }
            });
            break;
        case 'bishop':
            bishopMove.forEach(item => {
                let count = 1;
                let dx = x + item[0] * count;
                let dy = y + item[1] * count;
                while (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] === ' ') {
                    res.push(`${dx}${dy}`);
                    count++;
                    dx = x + item[0] * count;
                    dy = y + item[1] * count;
                }
            });
            break;
        case 'queen':
            queenMove.forEach(item => {
                let count = 1;
                let dx = x + item[0] * count;
                let dy = y + item[1] * count;
                while (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] === ' ') {
                    res.push(`${dx}${dy}`);
                    count++;
                    dx = x + item[0] * count;
                    dy = y + item[1] * count;
                }
            });
            break;
        case 'king':
            kingMove.forEach(item => {
                let dx = x + item[0];
                let dy = y + item[1];
                if (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] === ' ') {
                    res.push(`${dx}${dy}`);
                }
            });
            break;
    }
    return res;
}

// return ids of cells that dragged piece can attack to
function getAttack(x, y, piece) {
    piece = piece.toLowerCase();
    let res = [];
    const opponent = playerTurn === 'white' ? 'black' : 'white';
    switch (piece) {
        case 'pawn':
            if (playerTurn === 'white') {
                whitePawnAttack.forEach(item => {
                    let dx = x + item[0];
                    let dy = y + item[1];
                    if (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] === 'black') {
                        res.push(`${dx}${dy}`);
                    }
                });
            }
            else {
                blackPawnAttack.forEach(item => {
                    let dx = x + item[0];
                    let dy = y + item[1];
                    if (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] === 'white') {
                        res.push(`${dx}${dy}`);
                    }
                });
            }
            break;
        case 'knight':
            knightAttack.forEach(item => {
                let dx = x + item[0];
                let dy = y + item[1];
                if (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] === opponent) {
                    res.push(`${dx}${dy}`);
                }
            });
            break;
        case 'rook':
            rookAttack.forEach(item => {
                let count = 1;
                let dx = x + item[0] * count;
                let dy = y + item[1] * count;
                while (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] !== opponent && colorMatrix[dx][dy] !== playerTurn) {
                    count++;
                    dx = x + item[0] * count;
                    dy = y + item[1] * count;
                }
                if (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] === opponent) {
                    res.push(`${dx}${dy}`);
                }
            });
            break;
        case 'bishop':
            bishopAttack.forEach(item => {
                let count = 1;
                let dx = x + item[0] * count;
                let dy = y + item[1] * count;
                while (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] !== opponent && colorMatrix[dx][dy] !== playerTurn) {
                    count++;
                    dx = x + item[0] * count;
                    dy = y + item[1] * count;
                }
                if (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] === opponent) {
                    res.push(`${dx}${dy}`);
                }
            })
            break;
        case 'queen':
            queenAttack.forEach(item => {
                let count = 1;
                let dx = x + item[0] * count;
                let dy = y + item[1] * count;
                while (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] !== opponent && colorMatrix[dx][dy] !== playerTurn) {
                    count++;
                    dx = x + item[0] * count;
                    dy = y + item[1] * count;
                }
                if (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] === opponent) {
                    res.push(`${dx}${dy}`);
                }
            })
            break;
        case 'king':
            kingAttack.forEach(item => {
                let dx = x + item[0];
                let dy = y + item[1];
                if (dx >= 0 && dx <= 7 && dy >= 0 && dy <= 7 && colorMatrix[dx][dy] === opponent) {
                    res.push(`${dx}${dy}`);
                }
            });
            break;
    }
    return res;
}

// dragStart handler;
function dragStart(e) {
    dragged = e.target;
    const crt = this.cloneNode(true);
    crt.classList.toggle('thumb');
    crt.style.color = 'rgba(0, 0 ,0, .3)';
    crt.style.zIndex = -1;
    this.parentNode.append(crt);
    e.dataTransfer.setDragImage(crt, 30, 30);
    oldX = parseInt(this.parentNode.id.slice(0, 1));
    oldY = parseInt(this.parentNode.id.slice(1, 2));
    moveList = getMove(oldX, oldY, e.target.id);
    attackList = getAttack(oldX, oldY, e.target.id);
    
    console.log(attackList);
    if (moveList.length) {
        moveList.forEach(id => {
            document.getElementById(id).classList.add('moveable');
        });
    }
    if (attackList.length) {
        attackList.forEach(id => {
            document.getElementById(id).classList.add('attackable');
        })
    }
}

// dragend handler
function dragEnd() {
    let thumb = document.querySelector('.thumb');
    if (thumb) {
        thumb.remove();
    }
    if (moveList.length) {
        moveList.forEach(id => {
            document.getElementById(id).classList.remove('moveable');
        })
    }
    if (attackList.length) {
        attackList.forEach(id => {
            document.getElementById(id).classList.remove('attackable');
        });
    }
}

// drop handler
function dropHandler(e) {
    console.log(colorMatrix);
    let ID;
    // console.log(e.target);
    if (moveList.includes(e.target.id) || attackList.includes(e.target.parentNode.id)) {
        if (e.target.classList.contains('piece')) {
            ID = e.target.parentNode.id;
            e.target.parentNode.replaceChild(dragged, e.target.parentNode.childNodes[0]);
        }
        else {
            ID = e.target.id;
            e.target.append(dragged);
        }
        let x = parseInt(ID.slice(0, 1));
        let y = parseInt(ID.slice(1, 2));
        colorMatrix[x][y] = playerTurn;
        colorMatrix[oldX][oldY] = ' ';
        playerChange();
        checkWin();
    }
}

// dragover handler
function dragOver(e) {
    e.preventDefault();
}

function playerChange() {
    playerTurn = playerTurn === 'white' ? 'black' : 'white';
    document.getElementById('turn').style.backgroundColor = playerTurn;
    updateDraggable();
}

function updateDraggable() {
    pieceList.forEach(piece => {
        piece.draggable = piece.classList.contains(playerTurn) ? true : false;
    })
}

function checkWin() {
    const winner = document.getElementById('winner');
    if(document.getElementById('king') === null) {
        winner.innerText = 'White';
        scoreBoard.style.zIndex = 100;
    }
    if(document.getElementById('King') === null) {
        winner.innerText = 'Black';
        scoreBoard.style.zIndex = 100;
    }
}

/* MAIN */

createBoard();
initPieces();

const scoreBoard = document.querySelector('.score-board');

const playButton = document.getElementById('btn');

const pieceList = document.querySelectorAll('.piece');
pieceList.forEach(item => {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
})

const cellList = document.querySelectorAll('.cell');

cellList.forEach(cell => {
    cell.addEventListener('drop', dropHandler);
    cell.addEventListener('dragover', dragOver);
});

playButton.addEventListener('click', () => {
    scoreBoard.style.zIndex = -1;
    window.location.reload();
});



