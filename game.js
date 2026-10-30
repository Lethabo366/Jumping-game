let isJumping = false;
let bottomPosition = 0;
let rightPosition = 0;
let jumpVelocity = 0;
let obstacleCleared = false;

let start = false;
let groundOrSky = null;

const gravity = 0.8;
const jumpStrength = 12;
let speed = 3;
let gameOver = false;
let obstaclesDodged = 0;

const player = document.querySelector('#player');

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isJumping) {
        event.preventDefault();
        jump();
    }
});

function obstacleMovement() {
    const groundObstacle = document.querySelector('#ground_obstacle');
    const skyObstacle = document.querySelector('#sky_obstacle');
    const ground = document.querySelector('#ground');

    const obstacle = groundOrSky === 0 ? groundObstacle : skyObstacle;

    groundObstacle.style.visibility = groundOrSky === 0 ? 'visible' : 'hidden';
    skyObstacle.style.visibility = groundOrSky === 1 ? 'visible' : 'hidden';

    if (start) {
        rightPosition += speed;
        obstacle.style.right = `${rightPosition}px`;
    }

    const groundRect = ground.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (!obstacleCleared && obstacleRect.right <= playerRect.left) {
        obstacleCleared = true;
        obstaclesDodged += 1;

        if (obstaclesDodged % 6 === 0) {
            speed += 1;
        }

        updateObstacle();
        return;
    }

    if (obstacleRect.right <= groundRect.left) {
        rightPosition = 0;
        obstacle.style.right = '0px';
        start = true;
        obstacleCleared = false;
    }
}

function updateObstacle() {
    groundOrSky = Math.floor(Math.random() * 2);
    rightPosition = 0;

    const groundObstacle = document.querySelector('#ground_obstacle');
    const skyObstacle = document.querySelector('#sky_obstacle');
    const obstacle = groundOrSky === 0 ? groundObstacle : skyObstacle;

    groundObstacle.style.visibility = groundOrSky === 0 ? 'visible' : 'hidden';
    skyObstacle.style.visibility = groundOrSky === 1 ? 'visible' : 'hidden';
    obstacle.style.right = '0px';
    start = true;
}

function checkCollision() {
    const groundObstacle = document.querySelector('#ground_obstacle');
    const skyObstacle = document.querySelector('#sky_obstacle');

    const obstacle = groundOrSky === 0 ? groundObstacle : skyObstacle;
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
        playerRect.right > obstacleRect.left &&
        playerRect.left < obstacleRect.right &&
        playerRect.bottom > obstacleRect.top &&
        playerRect.top < obstacleRect.bottom
    ) {
        return true;
    }

    return false;
}

function gameStart() {
    if (gameOver) {
        return;
    }

    start = true;
    updateObstacle();
    gameLoop();
}

function gameLoop() {
    if (gameOver) {
        return;
    }

    obstacleMovement();

    if (checkCollision()) {
        gameOver = true;
        console.log('Game Over');
        return;
    }

    requestAnimationFrame(gameLoop);
}

function jump() {
    isJumping = true;
    jumpVelocity = jumpStrength;
 
    function animateJump() {
        if (!isJumping) {
            return;
        }

        jumpVelocity -= gravity;
        bottomPosition += jumpVelocity;

        if (bottomPosition <= 0) {
            bottomPosition = 0;
            jumpVelocity = 0;
            isJumping = false;
            player.style.bottom = '0px';
            return;
        }

        player.style.bottom = `${bottomPosition}px`;
        requestAnimationFrame(animateJump);
    }

    animateJump();
}

gameStart();
