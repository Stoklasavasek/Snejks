// Získání odkazu na canvas a jeho kontext pro kreslení
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Třída reprezentující části hada
class SnakePart {
    constructor(x, y) {
        this.x = x;  // Nastavení souřadnice X pro část hada
        this.y = y;  // Nastavení souřadnice Y pro část hada
    }
}

// Nastavení rychlosti pohybu hada
let speed = 7;

// Počet dlaždic na herní ploše
let tileCount = 20;

// Velikost jedné dlaždice hada
let tileSize = canvas.width / tileCount - 2;

// Počáteční pozice hlavy hada (X a Y)
let headX = 10;
let headY = 10;

// Pole pro ukládání částí hada
const snakeParts = [];

// Počáteční délka hada
let tailLength = 2;

// Počáteční pozice jablka (X a Y)
let appleX = 5;
let appleY = 5;

// Vstupní rychlost pohybu hada (X a Y)
let inputsXVelocity = 0;
let inputsYVelocity = 0;

// Aktuální rychlost pohybu hada (X a Y)
let xVelocity = 0;
let yVelocity = 0;

// Skóre hráče
let score = 0;

// Zvuk při sežrání jablka
const gulpSound = new Audio("zvuk.mp3");

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

    return gameOver;
}

// Vykreslení skóre na canvas
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "10px Verdana";
    ctx.fillText("Jablicek " + score, canvas.width - 60, 10);
}

// Vyčištění obrazovky
function clearScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Funkce pro přidání nové části hada a vykreslení hada
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

// Vykreslení jablka na canvas
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
        // Pokud je aktuální rychlost pohybu dolů (Y = 1), nenastavujeme pohyb nahoru
        if (inputsYVelocity == 1) return;
        // Nastavení vstupní rychlosti pohybu nahoru (Y = -1)
        inputsYVelocity = -1;
        inputsXVelocity = 0;
    }

    // Dolů
    if (event.keyCode == 40 || event.keyCode == 83) {
        // Pokud je aktuální rychlost pohybu nahoru (Y = -1), nenastavujeme pohyb dolů
        if (inputsYVelocity == -1) return;
        // Nastavení vstupní rychlosti pohybu dolů (Y = 1)
        inputsYVelocity = 1;
        inputsXVelocity = 0;
    }

    // Vlevo
    if (event.keyCode == 37 || event.keyCode == 65) {
        // Pokud je aktuální rychlost pohybu vpravo (X = 1), nenastavujeme pohyb vlevo
        if (inputsXVelocity == 1) return;
        // Nastavení vstupní rychlosti pohybu vlevo (X = -1)
        inputsYVelocity = 0;
        inputsXVelocity = -1;
    }

    // Vpravo
    if (event.keyCode == 39 || event.keyCode == 68) {
        // Pokud je aktuální rychlost pohybu vlevo (X = -1), nenastavujeme pohyb vpravo
        if (inputsXVelocity == -1) return;
        // Nastavení vstupní rychlosti pohybu vpravo (X = 1)
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
