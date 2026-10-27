
let isJumping = false;
let bottomPosition = 0;
let goingUp = true;

const player = document.querySelector('#player');

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isJumping) {
        event.preventDefault();

        isJumping = true;
        goingUp = true;

        jump();
    }
});

function jump() {
    if (goingUp) {
        bottomPosition += 3;

        if (bottomPosition >= 30) {
            goingUp = false;
        }
    } else {
        bottomPosition -= 3;
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