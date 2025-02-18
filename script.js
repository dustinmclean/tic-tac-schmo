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

// Okay, this previous function runs ONCE, at the beginning of the game, spitting out three functions into
// an object... which lets you reuse them over and over, whenever you need them.

// Now, the next function is a massive IIFE, setting up basically the entire game:

// Start with selecting some DOM elements:

// --------------------   displayController Function ----------------------------------------------------------- //

const displayController = (() => {
  const fieldElements = document.querySelectorAll(".field");
  const messageArea = document.getElementById("message");
  const restartButton = document.getElementById("restart-button");

  // Next, add Event Listeners to each individual Field cell. Do a check for if the game is over, OR,
  // if the text content has something in it already, so it doesn't overwrite a preexisting sign. Return,
  // that is exits from the function without doing anything.
  // Then CALL gameController.playRound with the index of the clicked cell as an argument. :

  // By the way, this event listener loop here is HUGE: basically every time a user clicks on a cell, a click event is fired,
  // and the index number is grabbed from the HTML, it's returned as a string, and parseInt converts it to a number. Then that
  // is set as the 'cellIndex' to be used INSIDE of the playRound function later on. It's quite brilliant.

  fieldElements.forEach((field) =>
    field.addEventListener("click", (e) => {
      if (gameController.getIsOver() || e.target.textContent !== "") return;
      gameController.playRound(parseInt(e.target.dataset.index));
      updateGameboard();
    })
  );

  // This next part, adds an event listener to the restart button, which calls 4 functions: gameBoard.reset() - resets
  // the board array to empty strings. gameController.reset() - resets the internal logic, like sets isOver to false, and
  // the round to 1. updateGameboard() - exists IN this function, and it updates the DOM to the current status, which
  // you just reset. then displayMessageArea() - which just calls passes a message: "player x's turn"

  restartButton.addEventListener("click", (e) => {
    gameBoard.reset();
    gameController.reset();
    updateGameboard();
    displayMessageArea("Player X starts");
  });

  // Now define updateGameboard. Which loops through each individual fieldElement (that you selected earlier, each cell),
  // and for each fieldElement at it's given index, set the text content to equal the gameBoard.getField() function, who's
  // job it is to return to you whatever marker is at that index. Essentially, this sets whatever marker is at that index
  // to that given cell. It plops in in. That's this function's job.

  const updateGameboard = () => {
    fieldElements.forEach((cell, index) => {
      cell.textContent = gameBoard.getField(index);
    });
  };

  // Now, define a function that will do a check: give it one parameter 'winner'. And if winner, stricly equals the string
  // "Draw", the call the displayMessageArea (defined later) and pass 'It's a draw'. And if NOT, then set it to equal a
  // message saying that person is a winner. This functinon' job is to update the little message are, with whoever is
  // the winner, or else say that it's a draw. The internal logic will be defined later on.

  const setResultMessage = (winner) => {
    if (winner === "Draw") {
      displayMessageArea("It's a draw!");
    } else {
      displayMessageArea(`Player ${winner} is a Schmo!`);
    }
  };

  // Define the displayMessageArea function, with the one parameter 'message'. Set it to equade the textContent of the
  // messageArea (which is the div selected and called messageArea).

  const displayMessageArea = (message) => {
    messageArea.textContent = message;
  };

  // Start out with printing the message "Player X starts"

  displayMessageArea("Player X starts");

  // BOOM: spits out an object with two Methods: setResultMessage, and displayMessageArea. These can be used publicly later
  // for the user to interact with the game.

  return { setResultMessage, displayMessageArea };
})();

// Now another MASSIVE IIFE:

// ---------------------------------- gameController Function -----------------------------------------------//

// This is the inner workings of the game. This is where all the magic happens.

// Start out with the main massive IIFE called gameController.

const gameController = (() => {
  // Now create two players, using your previously defined Factory Function. Define the first one as playerX, and pass it
  // the arguement "X", and then playerO, and pass it "O". Boom you created two players.

  const playerX = Player("X");
  const playerO = Player("O");

  // define a 'round' variable, initialize it to 1, and then isOver to determine whether the game is over, or still going,
  // and set it to currently equal false, because the game is currently going:

  let round = 1;
  let isOver = false;

  // Now define a schlick function called playRound, and give it one parameter, which is the fieldIndex.

  const playRound = (cellIndex) => {
    // Now you finally call setField, which sets the marker at the given index. You pass it two arguments, one is the
    // cellIndex, which you got earlier from the event listener. The other is a real cool function called getCurrentPlayerSign. 
    // This little guy's job is to essentially determine who's turn it is, X or O. 
    gameBoard.setField(cellIndex, getCurrentPlayerSign());
    if (checkWinner(cellIndex)) {
      displayController.setResultMessage(getCurrentPlayerSign());
      isOver = true;
      return;
    }
    if (round === 9) {
      displayController.setResultMessage("Draw");
      isOver = true;
      return;
    }
    round++;
    displayController.displayMessageArea(
      `Player ${getCurrentPlayerSign()}'s turn`
    );
  };

  const getCurrentPlayerSign = () => {
    return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
  };

  // This checkWinner function is very very very clever. Genius perhaps. SO... it takes one parameter, the cellIndex. Then it creates
  // an array of arrays. Each one has 3 numbers, corresponding to potential indexes, that would indicate a win. So if a given sign
  // is present in all three, that means a win! So then it takes that variable holding all these arrays, and does a .filter on it. Which
  // 

  const checkWinner = (cellIndex) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions
      .filter((combination) => combination.includes(cellIndex))
      .some((possibleCombination) =>
        possibleCombination.every(
          (index) => gameBoard.getField(index) === getCurrentPlayerSign()
        )
      );
  };

  const getIsOver = () => {
    return isOver;
  };

  const reset = () => {
    round = 1;
    isOver = false;
  };

  // BOOM: this IIFE has spit out an object with 3 methods, than can be used publically to interact with the game:

  return { playRound, getIsOver, reset };
})();
