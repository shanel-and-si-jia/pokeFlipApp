// namespacing object
const pokeApp = {}

pokeApp.cards = document.querySelectorAll('.card');
pokeApp.startBtn = document.querySelector('.start');
pokeApp.game = document.querySelector('.gameContainer');
pokeApp.tryText = document.querySelector('.tryCounter p');

pokeApp.hasFlipped = false;
pokeApp.lockBoard = false;
pokeApp.firstCard = '';
pokeApp.secondCard = '';
pokeApp.numTry = 8;


// Function that will be attached to event listener to flip a card
pokeApp.flipCard = function() {
    // Check if the board is locked, if so do nothing
    if (pokeApp.lockBoard) return;
    // Check if first card is selected again, if so do nothing
    if (this === pokeApp.firstCard) return;
    
    // Add class to card to flip it over
    this.classList.add('flip')

    // Check if hasFlipped is true or false    
    if(!pokeApp.hasFlipped){
        // If hasFlipped is false make it true
        pokeApp.hasFlipped = true;
        // Change value of firstCard to card that was just clicked
        pokeApp.firstCard = this;
        
    } else {
        // If hasFlipped is true make it false
        pokeApp.hasFlipped = false;
        // Change value of secondCard to card that was just clicked
        pokeApp.secondCard = this;
        // Run function to check if cards match
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
        // The game board is locked when cards don't match to prevent user
        // from selecting more cards during the animation
        pokeApp.lockBoard = true;
        // If non-match, number of tries will decrement by 1
        pokeApp.numTry--;
        // Update the counter real time
        pokeApp.tryText.innerText = `You have: ${pokeApp.numTry} tries left`;

        // Add set time before cards are flipped back for user to see
        setTimeout(() => {
            pokeApp.firstCard.classList.remove('flip');
            pokeApp.secondCard.classList.remove('flip');
            pokeApp.resetBoard();
            // Run endGame if user runs out of tries
            pokeApp.endGame();
        }, 1000);
    }
}

// End game once number of tries run out
pokeApp.endGame = () => {
    if(pokeApp.numTry === 0) {
        // When game ends, reset already matched cards to default value
        pokeApp.cards.forEach((card) => {
            card.classList.remove('matched', 'flip');
            card.addEventListener('click', pokeApp.flipCard);
        });
        // When game end, remove game board and show notice
        pokeApp.game.classList.add('hide');
        
        // Start/Reply button reappear
        setTimeout(() => {
            pokeApp.startBtn.classList.remove('hide')
        }, 900);
    }
}

// Start game button function
pokeApp.startGame = () => {
    pokeApp.startBtn.addEventListener('click', () => {
        // Number of trials reset back to origin
        pokeApp.numTry = 8;
        // When start game button is clicked, remove hide class from gameboard
        pokeApp.game.classList.remove('hide');
        // Then add hide class to the start button
        pokeApp.startBtn.classList.add('hide');
        // Remove hide class from trial counter at the start of game
        // Display how many trials remains
        pokeApp.tryText.classList.remove('hide');
        pokeApp.tryText.innerText = `You have: ${pokeApp.numTry} tries left`;
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

// Call init to start our app
pokeApp.init();