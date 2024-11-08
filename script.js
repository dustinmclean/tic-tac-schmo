// Adding 'use strict' to prevent potential bugs:
"use strict";

// A Factory Function to create the player, and return an Object with the player's
// 'sign', which is private via a closure.

// Task: create a 'player' factory function, that returns a function, that returns a sign parameter. Then
// return that function as an object.

function Player(sign) {
  const getSign = () => {
    return sign;
  };
  return { getSign };
}

// Now, create an IIFE, which has 3 methods inside, for future use, but are private, and only
// accessable via the 3 methods.  setField, getField, and reset.

// Note: the getField function, could be called: checkTheBoardForWhereMarkersCurrentlyAre()

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

// Okay, this function runs ONCE, at the beginning of the game, spitting out three functions into
// an object... which lets you reuse them over and over, whenever you need them.

const displayController = (() => {
  const fieldElements = document.querySelectorAll(".field");
  const messageElement = document.getElementById("message");
  const restartButton = document.getElementById("restart-button");

  fieldElements.forEach((field) =>
    field.addEventListener("click", (e) => {
      if (gameController.getIsOver() || e.target.textContent !== "") return;
      gameController.playRound(parseInt(e.target.dataset.index));
      updateGameboard();
    })
  );

  restartButton.addEventListener("click", (e) => {
    gameBoard.reset();
    gameController.reset();
    updateGameboard();
    setMessageElement("Player X's turn");
  });

  const updateGameboard = () => {
    for (let i = 0; i < fieldElements.length; i++) {
      fieldElements[i].textContent = gameBoard.getField(i);
    }
  };

  const setResultMessage = (winner) => {
    if (winner === "Draw") {
      setMessageElement("It's a draw!");
    } else {
      setMessageElement(`Player ${winner} has won!`);
    }
  };

  const setMessageElement = (message) => {
    messageElement.textContent = message;
  };

  return { setResultMessage, setMessageElement };
})();
