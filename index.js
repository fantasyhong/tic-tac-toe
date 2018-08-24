import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) { 
    return (
      <button className = "square" 
      onClick = {props.onClick} > {props.value}
      </button>
    );
}

function calculateWinner (squares) {
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
  for (let i in lines) {
    const [a, b, c] = lines[i];
    /*console.log([a,b,c] + ' '+lines[i]);*/
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isTie (squares) {
  for (let i in squares){
    if(squares[i] === null){
      return false;
    }
  }
  return true;
}



class Board extends React.Component {
  
  renderSquare (i) {
    return <Square value = {
      this.props.squares[i]}
      onClick = {() => this.props.onClick(i)} />;
  }
  
  

  render () {
    
    return (
      <div>
        <div className = "board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className = "board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className = "board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        
      </div>
    );
  }
}

class Game extends React.Component {
  defaultstate = {
    history:[{
      squares : Array(9).fill(null),
    }],
    stepNumber: 0,
    xIsNext : true,
  }

  constructor (props) {
    super (props);
    this.state = this.defaultstate;
  }

  handleClick (i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    /*Time machine feature is read-only, players can't make changes to past moves. */
    if(squares[i] || calculateWinner (squares) || this.state.stepNumber !== (history.length-1)) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X':'O';
    this.setState ({
      history:history.concat([{
        squares:squares,
      }]),
      stepNumber: history.length,
      xIsNext : !this.state.xIsNext,
      });

  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ===0,
    });
  }

  resetGame () {
    this.setState({...this.defaultstate});
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step,move) => {
      const desc = move ? 'Move #' + move : 'Start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}> {desc} </button>
        </li>
        );

    })
    let status;
    if(!winner && !isTie (current.squares)) {
      status = 'Next player: ' + (this.state.xIsNext ? 'X':'O');
    }
    else if (winner) {
      status = 'Winner: '+ winner;
    }
    else{
      status = 'Tie';
    }
    return (
      <div className = "game">
        <div className = "game-board">
          <Board 
            squares = {current.squares}
            onClick = {i => this.handleClick(i)}/>
          <button onClick = {() => this.resetGame()}>Reset Game</button>
        </div>
        <div className = "game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

