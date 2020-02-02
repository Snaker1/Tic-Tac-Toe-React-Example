import React, { ElementType } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

interface BoardProps {
  onClick: (i: number) => void;
  squares: String[];
}
interface GameProps {}
interface State {
  history: any[];
  stepNumber: number;
  xIsNext: Boolean;
}

class Board extends React.Component <BoardProps> {
  private static size = 3;
  private renderSquare(i: number) {
    const value = this.props.squares[i];
    const onClick = () => {this.props.onClick(i)};
    return ( 
      <button className="square" onClick={onClick}>
        {value}
      </button>
    );
  }
  private renderRow(column: number) {
    const i = column * Board.size;
    return (
      <div className="board-row">
        {this.renderSquare(i)}
        {this.renderSquare(i+1)}
        {this.renderSquare(i+2)}
      </div>
    );
  }
  render() {
    return (
      <div>
        {this.renderRow(0)}
        {this.renderRow(1)}
        {this.renderRow(2)}
      </div>
    );
  }
}

class Game extends React.Component <GameProps, State> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  getPlayer() : String {
    if (this.state.xIsNext) {
      return 'X';
    } else {
      return 'O';
    }
  }
  handleClick(i: number) {
    const history = this.state.history.slice(0,
      this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (Game.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.getPlayer();
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }
  static calculateWinner(squares: String[]) {
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
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
        return squares[a];
      }
    }
    return null;
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner =
      Game.calculateWinner(current.squares);
    const moves = history.map((step: number, move: number) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li className="history" key={move}>
          <button onClick={() =>
            {this.jumpTo(move);}} >{desc}
          </button>
        </li>
      );
    });
    let status = '';
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + this.getPlayer();
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i: number) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
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