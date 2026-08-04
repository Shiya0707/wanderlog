const ROWS = 6;
const COLS = 7;

let board = [];
let currentPlayer = "red";
let gameOver = false;

const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

function initGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(""));
    gameOver = false;
    currentPlayer = "red";
    statusText.textContent = "🔴 Red Player's Turn";
    boardElement.innerHTML = "";

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", () => dropDisc(col));
            boardElement.appendChild(cell);
        }
    }
}

function dropDisc(col) {
    if (gameOver) return;

    for (let row = ROWS - 1; row >= 0; row--) {

        if (board[row][col] === "") {

            board[row][col] = currentPlayer;

            const index = row * COLS + col;
            const cell = boardElement.children[index];
            cell.classList.add(currentPlayer);

            if (checkWinner(row, col)) {
                gameOver = true;
                statusText.textContent =
                    currentPlayer === "red"
                        ? "🎉 Red Player Wins!"
                        : "🎉 Yellow Player Wins!";
                return;
            }

            if (isBoardFull()) {
                gameOver = true;
                statusText.textContent = "🤝 It's a Draw!";
                return;
            }

            currentPlayer = currentPlayer === "red" ? "yellow" : "red";

            statusText.textContent =
                currentPlayer === "red"
                    ? "🔴 Red Player's Turn"
                    : "🟡 Yellow Player's Turn";

            return;
        }
    }
}

function isBoardFull() {
    return board[0].every(cell => cell !== "");
}

function checkWinner(row, col) {

    return (
        count(row, col, 0, 1) +
            count(row, col, 0, -1) >
            2 ||
        count(row, col, 1, 0) +
            count(row, col, -1, 0) >
            2 ||
        count(row, col, 1, 1) +
            count(row, col, -1, -1) >
            2 ||
        count(row, col, 1, -1) +
            count(row, col, -1, 1) >
            2
    );
}

function count(row, col, rowDir, colDir) {

    let total = 0;

    let r = row + rowDir;
    let c = col + colDir;

    while (
        r >= 0 &&
        r < ROWS &&
        c >= 0 &&
        c < COLS &&
        board[r][c] === currentPlayer
    ) {
        total++;
        r += rowDir;
        c += colDir;
    }

    return total;
}

restartBtn.addEventListener("click", initGame);

initGame();