import React from 'react';
import Board from './Board.js';

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





class Game extends React.Component {
  defaultstate = {
    history:[{
      squares : Array(9).fill(null),
    }],
    stepNumber: 0,
    xIsNext : true,
    onePlayer : true,
  }

  constructor (props) {
    super (props);
    this.state = this.defaultstate;
  }

  handleClick (i) {
    const history = this.state.history;
    const playerMode = this.state.onePlayer;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let computerMove = true;
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

    if (this.state.stepNumber === parseInt (squares.length/2,10) ||!playerMode)
    {
      return;
    }
    while(computerMove){
      let randomSelect = Math.floor(Math.random() * squares.length);
      if(squares[randomSelect] === null){
        squares[randomSelect] = 'O';
        this.setState ({
        history:history.concat([{
          squares:squares,
        }]),
        stepNumber: history.length,
        xIsNext : this.state.xIsNext,
        });
        computerMove = false;
        return;        
      }
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      // xIsNext: (step % 2) ===0,
    });
  }

  resetGame () {
    this.setState({...this.defaultstate});
  }

  setPlayer (status){
    if(this.state.stepNumber === 0 && this.state.stepNumber === (this.state.history.length-1)){
      this.setState({
        onePlayer: status,
      });
    }
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
          <h3>Current Mode: {this.state.onePlayer ? "One Player": "Two Player"}</h3> 
          <div className = "game-mode">
            <button onClick = {() => this.setPlayer(true)}>1 Player</button>
            <button onClick = {() => this.setPlayer(false)}>2 Player</button>
          </div>
          <Board 
            squares = {current.squares}
            onClick = {i => this.handleClick(i)}/>
          <div className = "reset-game">  
            <button onClick = {() => this.resetGame()}>Reset Game</button>
          </div>
        </div>
        <div className = "game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default Game;