enum Dir { Up = 0, Down, Left, Right }

let gameSpeed = 800;
let gameRunning = false;
let allowInput = true;
let currentDirection: Dir;
let currentX: number
let currentY: number
let dotX: number
let dotY: number
let score: number
let snakePartsX: number[]
let snakePartsY: number[]
resetGame()

basic.forever(() => {
    if (gameRunning) {
        let nextX = currentX;
        let nextY = currentY;
        switch (currentDirection) {
            case Dir.Up:
                nextY--;
                break;
            case Dir.Right:
                nextX++;
                break;
            case Dir.Down:
                nextY++;
                break;
            case Dir.Left:
                nextX--;
                break;
        }
        // check to see if we hit the wall
        if (nextX < 0 || nextX > 4 || nextY < 0 || nextY > 4) {
            loseGame();
        } else if (!hitDot(nextX, nextY) && led.point(nextX, nextY)) {
            // we hit ourself 
            loseGame();
        } else {
            currentX = nextX;
            currentY = nextY;
            led.plot(currentX, currentY)
            snakePartsX.push(currentX);
            snakePartsY.push(currentY);
            if (hitDot(currentX, currentY)) {
                score++
                getNewDot()
                if (score % 3 == 0 && gameSpeed > 50) {
                    gameSpeed = gameSpeed - 50
                } else {
                    dropTail();
                }
            } else {
                dropTail();
            }
        }
    }

    basic.pause(gameSpeed)
})

input.onButtonPressed(Button.A, () => {
    if (!allowInput)
        return;
    if (!gameRunning) {
        gameRunning = true;
        return;
    }

    switch (currentDirection) {
        case Dir.Up:
            currentDirection = Dir.Left;
            break;
        case Dir.Right:
            currentDirection = Dir.Up;
            break;
        case Dir.Down:
            currentDirection = Dir.Right;
            break;
        case Dir.Left:
            currentDirection = Dir.Down;
            break;
    }
})

input.onButtonPressed(Button.B, () => {
    if (!allowInput)
        return;
    if (!gameRunning) {
        gameRunning = true;
        return;
    }

    switch (currentDirection) {
        case Dir.Up:
            currentDirection = Dir.Right;
            break;
        case Dir.Right:
            currentDirection = Dir.Down;
            break;
        case Dir.Down:
            currentDirection = Dir.Left;
            break;
        case Dir.Left:
            currentDirection = Dir.Up;
            break;
    }
})

function loseGame() {
    allowInput = false;
    gameRunning = false;
    //basic.showIcon(IconNames.No)
    basic.showAnimation(`
        #####.........................#####
        #####.###.................###.#####
        #####.###...#.........#...###.#####
        #####.###.................###.#####
        #####.........................#####
        `, 300)
    basic.pause(300)
    basic.showIcon(IconNames.Skull)
    basic.pause(300)
    basic.clearScreen()
    basic.showString("SCORE:")
    basic.showNumber(score, 100)
    basic.pause(3000)
    resetGame()
}
function resetGame() {
    basic.clearScreen()
    basic.showString("SNAKE")
    gameSpeed = 800
    currentDirection = Dir.Right;
    currentX = 0
    currentY = 3
    snakePartsX = [0]
    snakePartsY = [3]
    led.plot(currentX, currentY)
    getNewDot()
    score = 0
    allowInput = true
}
function getNewDot() {
    let pt = getNotLit()
    dotX = pt.X;
    dotY = pt.Y;
    led.plot(dotX, dotY)
}
function getNotLit(): { X: number, Y: number } {
    let x = Math.randomRange(0, 4);
    let y = Math.randomRange(0, 4);
    while (led.point(x, y)) {
        x = Math.randomRange(0, 4)
        y = Math.randomRange(0, 4)
    }
    return { X: x, Y: y }
}
function hitDot(x: number, y: number): boolean {
    return x == dotX && y == dotY;
}
function dropTail() {
    led.unplot(snakePartsX[0], snakePartsY[0]);
    snakePartsX.shift();
    snakePartsY.shift();
}
