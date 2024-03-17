class Square {
    constructor(element) {
        this.element = element;
        this.player = null;
    }
}

class Game {
    constructor() {
        const squareElements = document.querySelectorAll('.square');
        this.squares = Array.from(squareElements).map(element => new Square(element));
        this.currentPlayer = 'X';
        this.resetButton = document.querySelector('#reset');
        this.display = document.querySelector('#status');
        this.resetButton.addEventListener('click', () => this.reset());
        this.clickHandler = this.click.bind(this);
    }

    start() {
        this.squares.forEach(square => {
            square.element.addEventListener('click', this.clickHandler);
        });
        this.display.textContent = `${this.currentPlayer}'s turn`;
    }

    click(event) {
        const square = this.squares.find(sq => sq.element === event.target);
        if (square && square.player === null) {
            square.element.textContent = this.currentPlayer;
            square.element.style.color = this.currentPlayer === 'X' ? '#CF5C36' : '#6868f1';
            square.player = this.currentPlayer;
            if (this.checkWinner()) {
                this.displayWinner();
            } else {
                this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                this.display.textContent = `${this.currentPlayer}'s turn`;
                this.checkDraw();
            }
        }
    }

    reset() {
        this.removeClickHandlers();
        this.squares.forEach(square => {
            square.element.textContent = '';
            square.player = null;
        });
        this.currentPlayer = 'X';
        this.start();
    }

    checkWinner() {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const combo of winningCombos) {
            const [a, b, c] = combo;
            if (this.squares[a].player &&
                this.squares[a].player === this.squares[b].player &&
                this.squares[a].player === this.squares[c].player) {
                return true;
            }
        }
        return false;
    }

    checkDraw() {
        if (this.squares.every(square => square.player)) {
            this.display.textContent = 'Draw!';
            this.removeClickHandlers();
        }
    }

    displayWinner() {
        this.display.textContent = `Player ${this.currentPlayer} wins!`;
        this.removeClickHandlers();
        this.createWinnerAlert();
    }

    createWinnerAlert() {
        const winnerAlert = document.createElement('div');
            winnerAlert.className='alert alert-success winner-alert fade-in';
            winnerAlert.textContent = `Player ${this.currentPlayer} wins!`;
        
        const winnerScreenDim = document.createElement('div');
            winnerScreenDim.className='winner-screen-dim';


        const resetButton = document.createElement('button');
            resetButton.className='btn btn-primary ml-2';
            resetButton.textContent = 'Play Again';
            resetButton.addEventListener('click', () => {
            winnerScreenDim.remove();
            winnerAlert.remove();
            this.reset();
        });

        
        winnerAlert.appendChild(resetButton);
        document.body.appendChild(winnerAlert);
        document.body.appendChild(winnerScreenDim);
    }

    removeClickHandlers() {
        this.squares.forEach(square => {
            square.element.removeEventListener('click', this.clickHandler);
        });
    }
}

const game = new Game();
game.start();