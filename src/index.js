import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    let className = "square";
    if (props.className) {
        className += " " + props.className;
    }
    return (
        <button
            className={className}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    
    renderSquare(i) {
        let className; 
        if (this.props.winner) {
            if (this.props.winner.indexOf(i) >= 0) {
                className = "winner";
            }
        } else if (gameFinished(this.props.squares)) {
            className = "draw";
        }
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                key={i}
                className={className}
            />
        );
    }

    render() {
        const rows = Array(3);
        for (let row = 0; row < 3; row++) {
            const squares = Array(3);
            for (let col = 0; col < 3; col++) {
                squares[col] = this.renderSquare(col + (row * 3))
            }
            rows[row] = (
                <div className="board-row" key={row}>
                    {squares}
                </div>
            );
        }
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                squareIndex: 0,
            }],
            stepNumber: 0,
            xIsNext: true,
            movesOrderAsc: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                squareIndex: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    toggleMovesOrder() {
        this.setState({
            movesOrderAsc: !this.state.movesOrderAsc
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const col = step.squareIndex % 3;
            const row = Math.floor(step.squareIndex / 3);
            const desc = move ?
                'Go to move #' + move + ' (' + col + ',' + row + ')' :
                'Go to game start';
            const className = this.state.stepNumber === move ? 'current-move' : '';
            return (
                <li key={move}>
                    <button 
                        onClick={() => this.jumpTo(move)}
                        className={className}
                    >
                        {desc}
                    </button>
                </li>
            );
        })

        let status;
        if (winner) {
            status = 'Winner ' + current.squares[winner[0]];
        } else if (gameFinished(current.squares)) {
            status = 'Draw game';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        winner={winner}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.toggleMovesOrder()}>Toggle Moves Order</button>
                    <ol reversed={!this.state.movesOrderAsc}>
                        {this.state.movesOrderAsc ? moves : moves.reverse()}
                    </ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return null;
}

function gameFinished(squares) {
    return squares.indexOf(null) === -1;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

