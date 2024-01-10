// Získání odkazu na canvas a jeho kontext pro kreslení
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Třída reprezentující části hada
class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Inicializace herních proměnných
let speed = 7;  // Rychlost pohybu hada
let tileCount = 20;  // Počet dlaždic na herní ploše
let tileSize = canvas.width / tileCount - 2;  // Velikost dlaždice hada
let headX = 10;  // Počáteční pozice hlavy hada (X)
let headY = 10;  // Počáteční pozice hlavy hada (Y)
const snakeParts = [];  // Pole pro ukládání částí hada
let tailLength = 2;  // Počáteční délka hada
let appleX = 5;  // Počáteční pozice jablka (X)
let appleY = 5;  // Počáteční pozice jablka (Y)
let inputsXVelocity = 0;  // Vstupní rychlost pohybu hada (X)
let inputsYVelocity = 0;  // Vstupní rychlost pohybu hada (Y)
let xVelocity = 0;  // Aktuální rychlost pohybu hada (X)
let yVelocity = 0;  // Aktuální rychlost pohybu hada (Y)
let score = 0;  // Skóre hráče
const gulpSound = new Audio("gulp.mp3");  // Zvuk při sežrání jablka

// Hlavní herní smyčka
function drawGame() {
    // Nastavení rychlosti na základě vstupů hráče
    xVelocity = inputsXVelocity;
    yVelocity = inputsYVelocity;

    // Aktualizace pozice hada
    changeSnakePosition();

    // Kontrola konce hry
    let result = isGameOver();
    if (result) {
        return;
    }

    // Vymazání obrazovky
    clearScreen();

    // Kontrola kolize s jablkem a vykreslení hada a jablka
    checkAppleCollision();
    drawApple();
    drawSnake();

    // Vykreslení skóre
    drawScore();

    // Zvyšování obtížnosti s postupem hrou
    if (score > 5) {
        speed = 9;
    }
    if (score > 10) {
        speed = 11;
    }

    // Nastavení časovače pro další snímek hry
    setTimeout(drawGame, 1000 / speed);
}

// Funkce na kontrolu konce hry
function isGameOver() {
    let gameOver = false;

    // Pokud had nespadne, nedostane se do zdi nebo nevrazí do svého těla, hra pokračuje
    if (yVelocity === 0 && xVelocity === 0) {
        return false;
    }

    // Kontrola kolize s okraji
    if (headX < 0 || headX >= tileCount || headY < 0 || headY >= tileCount) {
        gameOver = true;
    }

    // Kontrola kolize se samotným hadem
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }

    // Zobrazení "Game Over" v případě konce hry
    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "50px Verdana";

        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");

        ctx.fillStyle = gradient;
        ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
    }

    return gameOver;
}

// Vykreslení skóre
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "10px Verdana";
    ctx.fillText("Score " + score, canvas.width - 50, 10);
}

// Vyčištění obrazovky
function clearScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Vykreslení hada
function drawSnake() {
    ctx.fillStyle = "green";
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }

    // Přidání nové části hada
    snakeParts.push(new SnakePart(headX, headY));

    // Omezení délky hada na aktuální hodnotu tailLength
    while (snakeParts.length > tailLength) {
        snakeParts.shift();
    }

    // Vykreslení hlavy hada
    ctx.fillStyle = "orange";
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

// Změna pozice hada
function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

// Vykreslení jablka
function drawApple() {
    ctx.fillStyle = "red";
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

// Kontrola kolize s jablkem
function checkAppleCollision() {
    if (appleX === headX && appleY == headY) {
        // Přesunutí jablka na novou náhodnou pozici
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);

        // Zvýšení délky hada a skóre
        tailLength++;
        score++;

        // Přehrání zvuku
        gulpSound.play();
    }
}

// Posluchač kláves pro ovládání hada
document.body.addEventListener("keydown", keyDown);

// Funkce pro zachytávání klávesových událostí
function keyDown(event) {
    // Nahoru
    if (event.keyCode == 38 || event.keyCode == 87) {
        if (inputsYVelocity == 1) return;
        inputsYVelocity = -1;
        inputsXVelocity = 0;
    }

    // Dolů
    if (event.keyCode == 40 || event.keyCode == 83) {
        if (inputsYVelocity == -1) return;
        inputsYVelocity = 1;
        inputsXVelocity = 0;
    }

    // Vlevo
    if (event.keyCode == 37 || event.keyCode == 65) {
        if (inputsXVelocity == 1) return;
        inputsYVelocity = 0;
        inputsXVelocity = -1;
    }

    // Vpravo
    if (event.keyCode == 39 || event.keyCode == 68) {
        if (inputsXVelocity == -1) return;
        inputsYVelocity = 0;
        inputsXVelocity = 1;
    }
}

// Posluchač tlačítka pro restart hry
document.getElementById("restartButton").addEventListener("click", restartGame);

// Funkce pro restart hry
function restartGame() {
    // Resetování herních proměnných na výchozí hodnoty
    speed = 7;
    tileCount = 20;
    tileSize = canvas.width / tileCount - 2;
    headX = 10;
    headY = 10;
    snakeParts.length = 0;
    tailLength = 2;
    appleX = 5;
    appleY = 5;
    inputsXVelocity = 0;
    inputsYVelocity = 0;
    xVelocity = 0;
    yVelocity = 0;
    score = 0;

    // Vyčištění obrazovky a spuštění hry znovu
    clearScreen();
    drawGame();
}

// Spuštění herní smyčky
drawGame();
