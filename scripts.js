// Namespacing object
const pokeApp = {}

// Array to hold data from API call
pokeApp.pokeArray = [
    {
        name: '',
        image: '',
        alt: ''
    },
    {
        name: '',
        image: '',
        alt: ''
    },
    {
        name: '',
        image: '',
        alt: ''
    },
    {
        name: '',
        image: '',
        alt: ''
    },
    {
        name: '',
        image: '',
        alt: ''
    },
    {
        name: '',
        image: '',
        alt: ''
    },
    {
        name: '',
        image: '',
        alt: ''
    },
    {
        name: '',
        image: '',
        alt: ''
    }
];

pokeApp.cards = document.querySelectorAll('.card');
pokeApp.startBtn = document.querySelector('.start');
pokeApp.subHead = document.querySelector('h2');
pokeApp.frontFaces = document.querySelectorAll('.frontFace');
pokeApp.pElements = document.querySelectorAll('.gameContainer p');
pokeApp.game = document.querySelector('.gameContainer');
pokeApp.tryText = document.querySelector('.tryCounter p');
pokeApp.form = document.querySelector('form');
pokeApp.difficultyValue = document.getElementById('difficulty');

pokeApp.hasFlipped = false;
pokeApp.lockBoard = false;
pokeApp.firstCard = '';
pokeApp.secondCard = '';
pokeApp.numTry;
pokeApp.matches = 0;

// function to generate an array of unique random numbers found at https://dev.to/sagdish/generate-unique-non-repeating-random-numbers-g6g
pokeApp.randomUnique = (range, count) => {
    let nums = new Set();
    while(nums.size < count) {
        nums.add(Math.floor(Math.random() * (range - 1 + 1) + 1));
    };
    return[...nums];
};

// Function to call API and get pokes
pokeApp.getPokes = async () => {
    for (let i = 0; i < pokeApp.pokeArray.length; i++) {
        // fetches poke with id based on randomNums
        const request = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeApp.randomNums[i]}/`);
        // converts data to json
        const data = await request.json();
        //Get poke's name
        const pokeName = data.name;
        // Get poke's image
        const sprite = data.sprites.other;
        const image = sprite['official-artwork'].front_default;
        // Set name and image in pokeArray
        pokeApp.pokeArray[i].name = pokeName;
        pokeApp.pokeArray[i].alt = pokeName;
        pokeApp.pokeArray[i].image = image;
    };
    return pokeApp.pokeArray; 
};

// function to set poke's on cards
pokeApp.setCards = (data) => {
    // Makes copy of pokeArray array
    const pokeArrayCopy = data.map(poke => poke);
    // loops through copy and pushes objects to original pokeArray
    pokeArrayCopy.forEach(obj => data.push(obj));
    //shuffles the cards after array of 16 is made
    let shuffled = pokeApp.shuffle(data);
    // loops through frontFaces images and assigns image source and text content from pokeArray data.
    for (let i = 0; i < pokeApp.frontFaces.length; i++) {
        pokeApp.pElements[i].textContent = shuffled[i].name;
        pokeApp.frontFaces[i].src = shuffled[i].image;
        pokeApp.frontFaces[i].alt = shuffled[i].alt;
    };
};

// Function that will be attached to event listener to flip a card
pokeApp.flipCard = function(clickedCard) {
    // Check if the board is locked, if so do nothing
    if (pokeApp.lockBoard) return;
    // Check if first card is selected again, if so do nothing
    if (clickedCard === pokeApp.firstCard) return;

    // Add class to card to flip it over
    clickedCard.classList.add('flip');

    // Check if hasFlipped is true or false    
    if(!pokeApp.hasFlipped){
        // If hasFlipped is false make it true
        pokeApp.hasFlipped = true;
        // Change value of firstCard to card that was just clicked
        pokeApp.firstCard = clickedCard;
        
    } else {
        // If hasFlipped is true make it false
        pokeApp.hasFlipped = false;
        // Change value of secondCard to card that was just clicked
        pokeApp.secondCard = clickedCard;
        // Run function to check if cards match
        pokeApp.checkIfMatch();
    };
};

// Function to check if first card and second card flipped match eachother
pokeApp.checkIfMatch = function() {
    // If firstCard matches secondCard, flip both card and remove from game board
    if(pokeApp.firstCard.innerText === pokeApp.secondCard.innerText){
        pokeApp.firstCard.removeEventListener('click', pokeApp.flipCard);
        pokeApp.secondCard.removeEventListener('click', pokeApp.flipCard);
        pokeApp.lockBoard = true;
        pokeApp.matches++;
        // Add set time before removing matched card for user to see
        setTimeout(() => {
            pokeApp.firstCard.classList.add('matched');
            pokeApp.secondCard.classList.add('matched');
            pokeApp.resetBoard();
            // run endGame if all matches have been made
            pokeApp.endGame();
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
    };
};

// Game board error control function
pokeApp.resetBoard = () => {
    pokeApp.hasFlipped = false;
    pokeApp.lockBoard = false;
    pokeApp.firstCard = null;
    pokeApp.secondCard = null;
};

// Function for difficulty selection
pokeApp.difficulty = () => {
    // Disable start button if no difficulty is chosen
    pokeApp.startBtn.disabled = true;
    pokeApp.difficultyValue.addEventListener('change', () => {
        pokeApp.numTry = pokeApp.difficultyValue.value;
        if (pokeApp.numTry === 14 || 10 || 6) {
            pokeApp.startBtn.disabled = false;
        };
    });
};

// Shuffles poke cards to random order using Fisher???Yates shuffle method
pokeApp.shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    };
    return array;
};

pokeApp.startState = () => {
    pokeApp.lockBoard = false;
    // Number of tries and matches reset back to origin
    pokeApp.numTry;
    pokeApp.matches = 0;
    
    pokeApp.startBtn.textContent = 'Loading...'
    pokeApp.randomNums = pokeApp.randomUnique(100, 8);
    
    pokeApp.getPokes()
        .then(pokeData => {
        pokeApp.setCards(pokeData);
        })
        .then(() => {
    
        pokeApp.subHead.innerText = 'Click the cards to find the matching Pokemon.';
    
        // When start game button is clicked, remove hide class from gameboard
        pokeApp.game.classList.remove('hide');
        // Then add hide class to the start button
        pokeApp.startBtn.classList.add('hide');
        // Remove hide class from trial counter at the start of game
        // Display how many trials remains
        pokeApp.tryText.classList.remove('hide');
        pokeApp.tryText.innerText = `You have: ${pokeApp.numTry} tries left`;
    });
};

// Start game button function
pokeApp.startGame = () => {
    pokeApp.startBtn.addEventListener('click', () => {
        // Remove difficulty option once game starts
        pokeApp.form.classList.add('disable');
        pokeApp.startState();
    }, {once: true});
};

pokeApp.endState = () => {
    // When game end, remove game board and show notice
    pokeApp.game.classList.add('hide');
    
    // Start/Reply button and difficult option reappear
    setTimeout(() => {
        // When game ends, reset already matched cards to default value
        pokeApp.cards.forEach((card) => {
            card.classList.remove('matched', 'flip');
            card.addEventListener('click', pokeApp.flipCard);
        });
        pokeApp.startBtn.innerText = 'Play Again';
        pokeApp.startBtn.classList.remove('hide');
        pokeApp.startBtn.addEventListener('click', () => {
            location.reload();
        });
    }, 900);
};

// End game once number of tries run out
pokeApp.endGame = () => {
    if(pokeApp.numTry === 0) {
        pokeApp.lockBoard = true;
        setTimeout(() => {
            window.scrollTo(0, 0);
            pokeApp.tryText.innerText = 'Sorry, you have run out of tries';
        }, 900);
        pokeApp.endState();
    } else if(pokeApp.matches === 8) {
        setTimeout(() => {
            window.scrollTo(0, 0);
            pokeApp.tryText.innerText = 'Congratulations, you have won! You have a great memory.';
        }, 900);
        pokeApp.endState();
    } else {
        return;
    };
};

pokeApp.init = () => {
    pokeApp.difficulty();
    pokeApp.startGame();
    pokeApp.cards.forEach(card => card.addEventListener('click', function() {
        pokeApp.flipCard(this);
    }));
    pokeApp.cards.forEach(card => card.addEventListener('keyup', function(e) {
        if(e.key === 'Enter') {
            pokeApp.flipCard(this);
        };
    }));
    pokeApp.form.reset();
};

// Call init to start our app
pokeApp.init();