const gridElement = document.getElementById('grid');
const scoreElement = document.getElementById('score');
let grid = [];
let score = 0;

document.addEventListener('keydown', handleInput);
startGame();

function startGame() {
    resetGame();
    generateRandomTile();
    generateRandomTile();
    updateGrid();
}

function resetGame() {
    grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    score = 0;
    scoreElement.innerText = score;
}

function updateGrid() {
    gridElement.innerHTML = '';
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const tileElement = document.createElement('div');
            tileElement.classList.add('tile');
            const tileValue = grid[row][col];
            tileElement.innerText = tileValue ? tileValue : '';
            if (tileValue) tileElement.classList.add(`tile-${tileValue}`);
            gridElement.appendChild(tileElement);
        }
    }
}

function generateRandomTile() {
    const emptyTiles = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid[row][col] === 0) {
                emptyTiles.push({ row, col });
            }
        }
    }
    
    if (emptyTiles.length) {
        const randomIndex = Math.floor(Math.random() * emptyTiles.length);
        const { row, col } = emptyTiles[randomIndex];
        grid[row][col] = Math.random() < 0.9 ? 2 : 4; // 90% chance for 2, 10% for 4
    }
}

function handleInput(event) {
    let moved = false;
    
    switch (event.key) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
    }
    
    if (moved) {
        generateRandomTile();
        updateGrid();
        scoreElement.innerText = score;
        
        if (checkGameOver()) {
            alert("Game Over!");
            resetGame();
            startGame();
        }
    }
}

function moveUp() {
    let moved = false;
    
    for (let col = 0; col < 4; col++) {
        let lastMergeRow = -1;
        for (let row = 0; row < 4; row++) {
            if (grid[row][col] !== 0) {
                let nextRow = row;
                while (nextRow > 0 && grid[nextRow - 1][col] === 0) {
                    grid[nextRow - 1][col] = grid[nextRow][col];
                    grid[nextRow][col] = 0;
                    moved = true;
                    nextRow--;
                }
                
                if (nextRow > 0 && grid[nextRow - 1][col] === grid[nextRow][col] && lastMergeRow !== nextRow) {
                    grid[nextRow - 1][col] *= 2;
                    score += grid[nextRow - 1][col];
                    grid[nextRow][col] = 0;
                    lastMergeRow = nextRow - 1;
                    moved = true;
                }
            }
        }
    }
    
    return moved;
}

function moveDown() {
    let moved = false;
    
    for (let col = 0; col < 4; col++) {
        let lastMergeRow = 4;
        for (let row = 3; row >= 0; row--) {
            if (grid[row][col] !== 0) {
                let nextRow = row;
                while (nextRow < 3 && grid[nextRow + 1][col] === 0) {
                    grid[nextRow + 1][col] = grid[nextRow][col];
                    grid[nextRow][col] = 0;
                    moved = true;
                    nextRow++;
                }
                
                if (nextRow < 3 && grid[nextRow + 1][col] === grid[nextRow][col] && lastMergeRow !== nextRow) {
                    grid[nextRow + 1][col] *= 2;
                    score += grid[nextRow + 1][col];
                    grid[nextRow][col] = 0;
                    lastMergeRow = nextRow + 1;
                    moved = true;
                }
            }
        }
    }
    
    return moved;
}

function moveLeft() {
    let moved = false;
    
    for (let row = 0; row < 4; row++) {
        let lastMergeCol = -1;
        for (let col = 0; col < 4; col++) {
            if (grid[row][col] !== 0) {
                let nextCol = col;
                while (nextCol > 0 && grid[row][nextCol - 1] === 0) {
                    grid[row][nextCol - 1] = grid[row][nextCol];
                    grid[row][nextCol] = 0;
                    moved = true;
                    nextCol--;
                }
                
                if (nextCol > 0 && grid[row][nextCol - 1] === grid[row][nextCol] && lastMergeCol !== nextCol) {
                    grid[row][nextCol - 1] *= 2;
                    score += grid[row][nextCol - 1];
                    grid[row][nextCol] = 0;
                    lastMergeCol = nextCol - 1;
                    moved = true;
                }
            }
        }
    }
    
    return moved;
}

function moveRight() {
    let moved = false;
    
    for (let row = 0; row < 4; row++) {
        let lastMergeCol = 4;
        for (let col = 3; col >= 0; col--) {
            if (grid[row][col] !== 0) {
                let nextCol = col;
                while (nextCol < 3 && grid[row][nextCol + 1] === 0) {
                    grid[row][nextCol + 1] = grid[row][nextCol];
                    grid[row][nextCol] = 0;
                    moved = true;
                    nextCol++;
                }
                
                if (nextCol < 3 && grid[row][nextCol + 1] === grid[row][nextCol] && lastMergeCol !== nextCol) {
                    grid[row][nextCol + 1] *= 2;
                    score += grid[row][nextCol + 1];
                    grid[row][nextCol] = 0;
                    lastMergeCol = nextCol + 1;
                    moved = true;
                }
            }
        }
    }
    
    return moved;
}

function checkGameOver() {
    if (grid.some(row => row.includes(2048))) {
        alert("You Win!");
        return true;
    }
    
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (grid[row][col] === 0) return false; // Empty tile found
            if (col < 3 && grid[row][col] === grid[row][col + 1]) return false; // Adjacent match horizontally
            if (row < 3 && grid[row][col] === grid[row + 1][col]) return false; // Adjacent match vertically
        }
    }
    
    return true; // No moves left
}
