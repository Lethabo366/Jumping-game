
let isJumping = false;
let bottomPosition = 0;
let rightPosition = 0;

let goingUp = true;
let start = false;
let groundOrSky = null;

let speed = 3;


const player = document.querySelector('#player');

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isJumping) {
        event.preventDefault();

        isJumping = true;
        goingUp = true;

        jump();
    }
});

function obstacleMovement() {
    const groundObstacle = document.querySelector('#ground_obstacle');
    const skyObstacle = document.querySelector('#sky_obstacle');

    if (start) {
        rightPosition += speed;

        if(rightPosition >= 315) {
            start = false;
        }

        if (groundOrSky === 0) {
            groundObstacle.style.right = `${rightPosition}px`;
        } else if (groundOrSky === 1) {
            skyObstacle.style.right = `${rightPosition}px`;
        } 
    }

    if(rightPosition > 0) {
        requestAnimationFrame(obstacleMovement);
    } 
    else {
        rightPosition = 0;
        start = true;
        requestAnimationFrame(obstacleMovement);
    }

}

function jump() {
    if (goingUp) {
        bottomPosition += speed;

        if (bottomPosition >= 30) {
            goingUp = false;
        }
    } else {
        bottomPosition -= speed;
    }

    player.style.bottom = `${bottomPosition}px`;

    if (bottomPosition > 0) {
        requestAnimationFrame(jump);
    } else {
        bottomPosition = 0;
        player.style.bottom = '0px';
        isJumping = false;
        console.log('Land!');
    }
}


 groundOrSky = Math.floor(Math.random() * 2);
obstacleMovement();


// let isJumping = false;

// document.addEventListener('keypress', (event) => {
//     if (event.code === 'Space' ) {
//         isJumping = true;
//         for(let i = 0; i < 30; i++) {
//             document.querySelector('#player').style.bottom = `${i}px`;
//         }
//     } 
// })

// document.addEventListener('keyup', (event) => {
//     if (event.code === 'Space') {

//           for(let i = 30; i > 0; i--) {
//             document.querySelector('#player').style.bottom = `${i}px`;
//         }
//         document.querySelector('#player').style.bottom = '0px ';
//         console.log('Land!');
//     }
// })

// let count = 0;

// function increaseCount() {
//     count++;

//     console.log(count);

//     if (count < 5) {
//         requestAnimationFrame(increaseCount);
//     }
// }

// requestAnimationFrame(increaseCount);

// document.addEventListener("keydown", (event) => {
//     if (event.code === "Space") {
//         console.log("Jump!");
//     }
// });
 
// function handleInput () {
 
// }

// handleInput()