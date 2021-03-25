// namespacing object
const pokeApp = {}

pokeApp.cards = document.querySelectorAll('.card');
pokeApp.startBtn = document.querySelector('.start');
pokeApp.game = document.querySelector('.gameContainer');

pokeApp.hasFlipped = false;
pokeApp.lockBoard = false;
pokeApp.firstCard = '';
pokeApp.secondCard = '';
pokeApp.numTry = 8;


// function that will be attached to event listener to flip a card
pokeApp.flipCard = function() {
    // Check if the board is locked, if so do nothing
    if (pokeApp.lockBoard) return;
    // Check if first card is selected again, if so do nothing
    if (this === pokeApp.firstCard) return;
    
    // Add class to card to flip it over
    this.classList.add('flip')

    // Check if hasFlipped is true or false    
    if(!pokeApp.hasFlipped){
        // if hasFlipped is false make it true
        pokeApp.hasFlipped = true;
        // Change value of firstCard to card that was just clicked
        pokeApp.firstCard = this;
        
    } else {
        // if hasFlipped is true make it false
        pokeApp.hasFlipped = false;
        // Change value of secondCard to card that was just clicked
        pokeApp.secondCard = this;
        // run function to check if cards match
        pokeApp.checkIfMatch();
    }
}

// Function to check if first card and second card flipped match eachother
pokeApp.checkIfMatch = function() {
    // If firstCard matches secondCard, flip both card and remove from game board
    if(pokeApp.firstCard.innerText === pokeApp.secondCard.innerText){
        pokeApp.firstCard.removeEventListener('click', pokeApp.flipCard);
        pokeApp.secondCard.removeEventListener('click', pokeApp.flipCard);
        // Add set time before removing matched card for user to see
        setTimeout(() => {
            pokeApp.firstCard.classList.add('matched')
            pokeApp.secondCard.classList.add('matched')
            pokeApp.resetBoard();
        }, 1000);
    
    } else {
        // If firstCard and secondCard doesn't match, flip them backwards
        // The game board is locked when cards don't match to prevent user from
        // selecting more cards during the animation
        pokeApp.lockBoard = true;
        // If non-match, number of tries will decrement by 1
        pokeApp.numTry--;
        // Add set time before cards are flipped back for user to see
        setTimeout(() => {
            pokeApp.firstCard.classList.remove('flip');
            pokeApp.secondCard.classList.remove('flip');
            pokeApp.resetBoard();
            // Run endGame if user runs out of tries
            pokeApp.endGame();
        }, 1000);
        
        console.log(pokeApp.numTry);
    }
}

// End game once number of tries run out
pokeApp.endGame = () => {
    if(pokeApp.numTry === 0) {
        // When game end, remove game board and show notice
        pokeApp.game.classList.add('hide');
        // Start/Reply button reappear
        setTimeout(() => {
            pokeApp.startBtn.classList.remove('hide')
        }, 1000);
    }
}

// Start game button function
pokeApp.startGame = () => {
    pokeApp.startBtn.addEventListener('click', () => {
        // When start game button is clicked, remove hide class from gameboard
        pokeApp.game.classList.remove('hide');
        // Then add hide class to the start button
        pokeApp.startBtn.classList.add('hide');
    })
}

// Game board error control function
pokeApp.resetBoard = () => {
    pokeApp.hasFlipped = false;
    pokeApp.lockBoard = false;
    pokeApp.firstCard = null;
    pokeApp.secondCard = null;
}

pokeApp.init = () => {
    pokeApp.startGame();
    pokeApp.cards.forEach(card => card.addEventListener('click', pokeApp.flipCard));
}

pokeApp.init();