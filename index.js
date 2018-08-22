import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) { 
    return (
      <button className="square" 
      onClick={props.onClick}>{props.value}
      </button>
    );
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
  for (let i in lines) {
    const [a, b, c] = lines[i];
    /*console.log([a,b,c] + ' '+lines[i]);*/
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isTie(squares){
  for (let i in squares){
    if(squares[i]===null){
      return false;
    }
  }
  return true;
}



class Board extends React.Component {
  defaultstate={
    squares:Array(9).fill(null),
    xIsNext:true,
  }

  constructor(props){
    super(props);
    this.state=this.defaultstate;
  }
  renderSquare(i) {
    return <Square value={
      this.state.squares[i]}
      onClick={()=>this.handleClick(i)} />;
  }
  resetGame(){
    this.setState({...this.defaultstate});
  }
  handleClick(i){
    const squares=this.state.squares.slice();
    if(squares[i]||calculateWinner(this.state.squares)){
      return;
    }
    squares[i]=this.state.xIsNext?'X':'O';
    this.setState({
      squares:squares,
      xIsNext:!this.state.xIsNext,
      });

  }

  render() {
    const winner=calculateWinner(this.state.squares);
    let status;
    if(!winner&&!isTie(this.state.squares)){
      status = 'Next player: '+ (this.state.xIsNext ? 'X':'O');
    }
    else if(winner){
      status='Winner: '+winner;
    }
    else{
      status='Tie';
    }
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        <button onClick={()=>this.resetGame()}>Reset Game</button>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
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

