function Player(sign) {
  const getSign = () => {
    return sign;
  };
  return { getSign };
}

// remember, when doing IIFEs, always use the const or let syntax, instead of regular function keyword:

const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const setField = (index, sign) => {
    if (index > board.length) return;
    board[index] = sign;
  };

  const getField = (index) => {
    if (index > board.length) return;
    return board[index];
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { setField, getField, reset };
})();
