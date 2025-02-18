function Player(sign) {
  const getSign = () => {
    return sign;
  };
  return { getSign }
}

// --------------------------------------------------

const gameBoard = (() => {
  const boardCells = ["", "", "", "", "", "", "", "", ""];

  const setField = (sign, index) => {
    if (index > boardCells.length) return;
    boardCells[index] = sign;
  }

  const getField = (index) => {
    if (index > boardCells.length) return;
    return boardCells[index];
  }

  const resetBoard = () => {
    for (let i = 0; i < boardCells.length; i++) {
      boardCells[i] = ""
    }
  }

  return { setField, getField, resetBoard };


})();

// -------------------------------------------------------



const diplayController = (() => {
  const fieldElements = document.querySelectorAll(".field-elements");
  const messageElement = document.getElementById("message");
  const restartButton = document.getElementById("restart-button");

 // Now the biiiiig ol event listener: this thing is god damn key to this whole thing thang thong: 

 fieldElements.forEach((cell) => {
  cell.addEventListener("click", (e) => {

    if (gameController.getIsOver() || e.target.textContent !== "") return;

    gameController.playRound(parseInt(e.target.dataset.index))

    const updateGameBoard = () => {
      fieldElements.forEach((cell, index) => {
        cell.textContent = gameBoard.setField(index)
      });
    };
  });
 });
})();



// -------------------------------------------------------------