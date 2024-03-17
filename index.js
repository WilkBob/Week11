// squares keep track of an html element, as well as a which player has chosen them. all squares start as null.
class Square {
    constructor(element) {
        this.element = element;
        this.player = null;
    }
}
//main game logic
class Game {
    constructor() {
        //get the square elements, and make an array of Square objects out of them using map
        const squareElements = document.querySelectorAll('.square');
        this.squares = Array.from(squareElements).map(element => new Square(element));
        //assign current player, X starts
        this.currentPlayer = 'X';
        //get elements for ui
        this.resetButton = document.querySelector('#reset');
        this.display = document.querySelector('#status');
        //assign reset method to resetButton
        this.resetButton.addEventListener('click', () => this.reset());
        //bind click method to handler on specific object (for removal later)
        this.clickHandler = this.click.bind(this);
    }
//start game
    start() {
        this.squares.forEach(square => {
            //add clickhandler to all squares
            square.element.addEventListener('click', this.clickHandler);
        });
        this.display.textContent = `${this.currentPlayer}'s turn`;
    }

    //click method, applied to every square on start()
    click(event) {
        //find square whose element is equal to the target element
        const square = this.squares.find(sq => sq.element === event.target);
        if (square && square.player === null) {
            //if we have a square, and there's no player, set square to player, with color based on x or O
            square.element.textContent = this.currentPlayer; //display x in square
            square.element.style.color = this.currentPlayer === 'X' ? '#CF5C36' : '#6868f1';// orange : purple
            square.player = this.currentPlayer; //assign squares player

            if (this.checkWinner()) {
                this.displayWinner(); //if someone has won, display the end screen
            } else {
                //if no one wins, change the current player, display that it's their turn, then check for a draw
                this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                this.display.textContent = `${this.currentPlayer}'s turn`;
                this.checkDraw();//placed at end of else statement to avoid conflict with winscreen. 
            }
        }
    }

    reset() {
        //remove handlers, to be reAdded on start
        this.removeClickHandlers();
        //reset squares (they're not used again, but reset anyways)
        this.squares.forEach(square => {
            square.element.textContent = '';
            square.player = null;
        });
        //reset current player again for good measure
        this.currentPlayer = 'X';
        //start new game
        this.start();
    }
//winner logic
    checkWinner() {
        //these are the winning square combos
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const combo of winningCombos) {
            const [a, b, c] = combo;
            //check the array of squares using the indexes of each winning combo. if the same player controls all three squares, a victory has occurred. return a winner before changing the player
            if (this.squares[a].player &&
                this.squares[a].player === this.squares[b].player &&
                this.squares[a].player === this.squares[c].player) {
                return true;
            }
        }
        return false;
    }
//if all squares are taken, its a draw. remove click handlers, leaving game displayed but unclickable until reset is clicked
    checkDraw() {
        if (this.squares.every(square => square.player)) {
            this.display.textContent = 'Draw!';
            this.removeClickHandlers();
        }
    }
//iff there's a winner, change the display to their player, remove clicks, and add the end screen (this was an afterthought, once I read the assignment)
    displayWinner() {
        this.display.textContent = `Player ${this.currentPlayer} wins!`;
        this.removeClickHandlers();
        this.createWinnerAlert();
    }

    createWinnerAlert() {
        //create a bootstrap alert displaying our winner
        const winnerAlert = document.createElement('div');
            winnerAlert.className='alert alert-success winner-alert fade-in';
            winnerAlert.textContent = `Player ${this.currentPlayer} wins!`;
        //add a dimmer screen, to cover everything except the result screen
        const winnerScreenDim = document.createElement('div');
            winnerScreenDim.className='winner-screen-dim';

//create and add a button
        const resetButton = document.createElement('button');
            resetButton.className='btn btn-primary ml-2';
            resetButton.textContent = 'Play Again';
            resetButton.addEventListener('click', () => {
            winnerScreenDim.remove(); //button removes winner alerts and resets game
            winnerAlert.remove();
            this.reset();
        });
//add button to alert, then add alert and dimmer to DOM
        
        winnerAlert.appendChild(resetButton);
        document.body.appendChild(winnerAlert);
        document.body.appendChild(winnerScreenDim);
    }
//remove event listener from each square. useful when limiting user input.
    removeClickHandlers() {
        this.squares.forEach(square => {
            square.element.removeEventListener('click', this.clickHandler);
        });
    }
}
//initialize class and start the game
const game = new Game();
game.start();