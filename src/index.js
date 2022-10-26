import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const Square = ({ value, handleClick, isClick, win, col, row }) => {
  const isWin = win?.find((item) => item[0] === row && item[1] === col);
  return (
    <button
      className="square"
      onClick={handleClick}
      style={{
        backgroundColor: isWin ? "red" : isClick ? "green" : "white",
      }}
    >
      {value}
    </button>
  );
};

const Board = ({ history, handleClick, xIsNext, winner, isDraw }) => {
  const status = winner
    ? `${!xIsNext ? "X" : "O"} Win`
    : isDraw
    ? "Draw"
    : `Next player: ${xIsNext ? "X" : "O"}`;
  return (
    <div>
      <div className="status">{status}</div>
      {history?.squares?.map((rows, indexRow) => (
        <div key={indexRow} className="board-row">
          {rows?.map((value, indexCol) => (
            <Square
              key={indexCol}
              value={value}
              handleClick={() => handleClick(indexRow, indexCol)}
              isClick={indexCol === history.col && indexRow === history.row}
              win={history?.win}
              col={indexCol}
              row={indexRow}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const calculateWinner = (squares, row, col) => {
  let checkRow = 0;
  let checkCol = 0;
  let checkCrossRow = 0;
  let checkCrossCol = 0;
  let win = [];
  for (let i = 0; i < squares.length; i++) {
    if (squares[row][i] === squares[row][col]) {
      checkRow++;
    }
    if (squares[i][col] === squares[row][col]) {
      checkCol++;
    }
    if (squares[i][i] === squares[row][col]) {
      checkCrossRow++;
    }
    if (squares[i][squares.length - 1 - i] === squares[row][col]) {
      checkCrossCol++;
    }
  }

  if (checkRow === squares.length) {
    for (let i = 0; i < squares.length; i++) {
      win.push([row, i]);
    }
  }
  if (checkCol === squares.length) {
    for (let i = 0; i < squares.length; i++) {
      win.push([i, col]);
    }
  }
  if (checkCrossRow === squares.length) {
    for (let i = 0; i < squares.length; i++) {
      win.push([i, i]);
    }
  }
  if (checkCrossCol === squares.length) {
    for (let i = 0; i < squares.length; i++) {
      win.push([i, squares.length - 1 - i]);
    }
  }
  return win?.length > 0 ? win : null;
};

const Game = () => {
  const [history, setHistory] = React.useState([
    Array(3).fill(Array(3).fill(null)),
  ]);
  const [stepNumber, setStepNumber] = React.useState(0);
  const [xIsNext, setXIsNext] = React.useState(true);
  const [winner, setWinner] = React.useState(false);
  const [chessboard, setChessboard] = React.useState(3);
  const [isDescending, setIsDescending] = React.useState(true);

  const handleClick = (row, col) => {
    const newHistory = history[stepNumber].squares.map((rows) => [...rows]);

    console.log(newHistory[row][col], winner);

    if (newHistory[row][col] || winner) {
      return;
    }

    newHistory[row][col] = xIsNext ? "X" : "O";
    setStepNumber((prev) => prev + 1);
    setXIsNext(!xIsNext);
    let win = calculateWinner(newHistory, row, col);
    setWinner(win?.length);
    setHistory([
      ...history.slice(0, stepNumber + 1),
      { squares: newHistory, row, col, win },
    ]);
  };

  useEffect(() => {
    if (chessboard) {
      setStepNumber(0);
      const newHistory = Array(chessboard);
      for (let i = 0; i < chessboard; i++) {
        if (chessboard === 3) newHistory[i] = [null, null, null];
        else newHistory[i] = [null, null, null, null, null];
      }
      setHistory([{ squares: newHistory, row: null, col: null, win: [] }]);
    }
  }, [chessboard]);

  console.log(history, stepNumber);

  return (
    <div className="game">
      <div className="game-board">
        {history?.length > 0 && (
          <Board
            handleClick={handleClick}
            history={history[stepNumber]}
            xIsNext={xIsNext}
            winner={winner}
            chessboard={chessboard}
            isDraw={history?.length === chessboard * chessboard + 1}
          />
        )}
      </div>
      <div className="game-info">
        <ol>
          {isDescending ? (
            <>
              {history?.map((value, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      setStepNumber(index);
                      setXIsNext(index % 2 === 0);
                      setWinner(
                        calculateWinner(value?.squares, value?.row, value?.col)
                      );
                    }}
                  >
                    Go to {index === 0 ? `game start` : `move ${index}`}
                  </button>
                </li>
              ))}
            </>
          ) : (
            <>
              {history
                ?.map((value, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        setStepNumber(index);
                        setXIsNext(index % 2 === 0);
                        setWinner(
                          calculateWinner(
                            value?.squares,
                            value?.row,
                            value?.col
                          )
                        );
                      }}
                    >
                      Go to {index === 0 ? `game start` : `move ${index}`}
                    </button>
                  </li>
                ))
                .reverse()}
            </>
          )}
        </ol>
      </div>
      <div
        style={{
          marginTop: 14,
          marginLeft: 14,
        }}
      >
        <button
          onClick={() => {
            setIsDescending(!isDescending);
          }}
        >
          chuyển đổi thứ tự
        </button>
      </div>
      <div
        style={{
          marginTop: 14,
          marginLeft: 14,
        }}
      >
        <button onClick={() => setChessboard(chessboard === 3 ? 5 : 3)}>
          {chessboard === 3 ? "5x5" : "3x3"}
        </button>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
