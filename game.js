// Jump Runner
// One animation loop controls jumping, obstacle movement, scoring and collisions.

const gameArea = document.querySelector('#ground');
const player = document.querySelector('#player');
const groundObstacle = document.querySelector('#ground_obstacle');
const skyObstacle = document.querySelector('#sky_obstacle');

const scoreElement = document.querySelector('#score');
const bestScoreElement = document.querySelector('#best-score');
const statusElement = document.querySelector('#game-status');
const overlay = document.querySelector('#overlay');
const overlayTitle = document.querySelector('#overlay-title');
const overlayMessage = document.querySelector('#overlay-message');
const startButton = document.querySelector('#start-button');
const restartButton = document.querySelector('#restart-button');
const jumpButton = document.querySelector('#jump-button');

const GRAVITY = 0.72;       // Gravity per 60 FPS frame
const JUMP_STRENGTH = 13.5; // Initial upward velocity
const BASE_SPEED = 4.2;     // Obstacle movement per 60 FPS frame
const MIN_SPAWN_GAP = 250;  // Minimum distance between obstacles
const MAX_SPAWN_GAP = 390;

let playerY = 0;
let playerVelocityY = 0;
let isJumping = false;

let obstacleX = 0;
let obstacleType = 'ground';
let obstaclePassed = false;
let nextSpawnGap = 0;

let score = 0;
let bestScore = 0;
let speed = BASE_SPEED;

let gameState = 'ready'; // ready | running | over
let animationFrameId = null;
let previousTimestamp = 0;

// Read best score for this browser session.
bestScoreElement.textContent = bestScore;

// Keep the player's visual position in sync with the physics value.
function renderPlayer() {
    player.style.bottom = `${10 + playerY}px`;
}

// Return the currently active obstacle element.
function getActiveObstacle() {
    return obstacleType === 'ground' ? groundObstacle : skyObstacle;
}

// Choose and position the next obstacle.
function spawnObstacle() {
    obstacleType = Math.random() < 0.65 ? 'ground' : 'sky';
    obstaclePassed = false;

    groundObstacle.style.visibility =
        obstacleType === 'ground' ? 'visible' : 'hidden';

    skyObstacle.style.visibility =
        obstacleType === 'sky' ? 'visible' : 'hidden';

    const obstacle = getActiveObstacle();

    // Start just beyond the right edge of the game area.
    obstacleX = gameArea.clientWidth + 10;
    obstacle.style.left = `${obstacleX}px`;
    obstacle.style.right = 'auto';

    nextSpawnGap = randomBetween(MIN_SPAWN_GAP, MAX_SPAWN_GAP);
}

// Generate a random number within an inclusive range.
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Start a fresh game.
function startGame() {
    if (gameState === 'running') return;

    cancelAnimationFrame(animationFrameId);

    playerY = 0;
    playerVelocityY = 0;
    isJumping = false;

    score = 0;
    speed = BASE_SPEED;
    previousTimestamp = 0;

    scoreElement.textContent = score;
    statusElement.textContent = 'Playing';

    renderPlayer();
    spawnObstacle();

    gameState = 'running';
    overlay.hidden = true;
    gameArea.focus();

    animationFrameId = requestAnimationFrame(gameLoop);
}

// Begin a jump only when the player is on the ground.
function jump() {
    if (gameState !== 'running' || isJumping) return;

    isJumping = true;
    playerVelocityY = JUMP_STRENGTH;
}

// Update the player's vertical position.
function updatePlayer(deltaTime) {
    if (!isJumping) return;

    playerVelocityY -= GRAVITY * deltaTime;
    playerY += playerVelocityY * deltaTime;

    // The ground is the lower boundary of the jump.
    if (playerY <= 0) {
        playerY = 0;
        playerVelocityY = 0;
        isJumping = false;
    }

    renderPlayer();
}

// Move the obstacle from right to left and replace it after it leaves view.
function updateObstacle(deltaTime) {
    const obstacle = getActiveObstacle();

    obstacleX -= speed * deltaTime;
    obstacle.style.left = `${obstacleX}px`;

    // Award a point once the obstacle has completely passed the player.
    if (!obstaclePassed) {
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (obstacleRect.right < playerRect.left) {
            obstaclePassed = true;
            increaseScore();
        }
    }

    // Spawn another obstacle after the current one leaves the game area
    // and the required gap has elapsed.
    if (obstacleX + obstacle.offsetWidth < 0) {
        if (nextSpawnGap > 0) {
            nextSpawnGap -= speed * deltaTime;
        }

        if (nextSpawnGap <= 0) {
            spawnObstacle();
        } else {
            obstacle.style.visibility = 'hidden';
        }
    }
}

// Update score and gradually increase difficulty.
function increaseScore() {
    score += 1;
    scoreElement.textContent = score;

    if (score > bestScore) {
        bestScore = score;
        bestScoreElement.textContent = bestScore;
    }

    // Increase speed every five points, with a sensible upper limit.
    if (score % 5 === 0) {
        speed = Math.min(speed + 0.45, 10);
    }
}

// Use the actual rendered image rectangles for collision detection.
// Small insets reduce unfair collisions caused by transparent image edges.
function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = getActiveObstacle().getBoundingClientRect();

    const insetX = 9;
    const insetY = 8;

    return (
        playerRect.left + insetX < obstacleRect.right - insetX &&
        playerRect.right - insetX > obstacleRect.left + insetX &&
        playerRect.top + insetY < obstacleRect.bottom - insetY &&
        playerRect.bottom - insetY > obstacleRect.top + insetY
    );
}

// End the current game and show the restart option.
function endGame() {
    gameState = 'over';
    statusElement.textContent = 'Game over';

    cancelAnimationFrame(animationFrameId);

    overlayTitle.textContent = 'Game over!';
    overlayMessage.textContent = `You dodged ${score} obstacle${score === 1 ? '' : 's'}. Try again?`;
    startButton.textContent = 'Play again';
    overlay.hidden = false;
}

// The only animation loop: update everything once per frame.
function gameLoop(timestamp) {
    if (gameState !== 'running') return;

    // Normalize elapsed time to a 60 FPS frame.
    // The cap prevents a large jump after a tab is inactive.
    const deltaTime = previousTimestamp
        ? Math.min((timestamp - previousTimestamp) / 16.667, 2)
        : 1;

    previousTimestamp = timestamp;

    updatePlayer(deltaTime);
    updateObstacle(deltaTime);

    if (checkCollision()) {
        endGame();
        return;
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

// Keyboard controls.
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault();

        if (gameState === 'ready' || gameState === 'over') {
            startGame();
        } else {
            jump();
        }
    }
});

// Button controls.
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
jumpButton.addEventListener('click', jump);

// Allow tapping/clicking the play area to jump, without hijacking buttons.
gameArea.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;

    if (gameState === 'ready' || gameState === 'over') {
        startGame();
    } else {
        jump();
    }
});

// Keep the active obstacle's coordinates valid after a resize.
window.addEventListener('resize', () => {
    if (gameState !== 'running') return;

    const obstacle = getActiveObstacle();
    if (obstacleX > gameArea.clientWidth) {
        obstacleX = gameArea.clientWidth + 10;
        obstacle.style.left = `${obstacleX}px`;
    }
});
