document.addEventListener('keypress', (event) => {
    if (event.code === 'Space') {
        for(let i = 0; i < 30; i++) {
            document.querySelector('#player').style.bottom = `${i}px`;
        }
    } 
})

document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {

          for(let i = 30; i > 0; i--) {
            document.querySelector('#player').style.bottom = `${i}px`;
        }
        document.querySelector('#player').style.bottom = '0px ';
        console.log('Land!');
    }
})

// document.addEventListener("keydown", (event) => {
//     if (event.code === "Space") {
//         console.log("Jump!");
//     }
// });
 
// function handleInput () {
 
// }

// handleInput()