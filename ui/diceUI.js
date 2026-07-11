 function updateDisplay(currentRoll, diceFace) {
    const diceArray = document.querySelectorAll(diceFace);
    for (let i = 0; i < currentRoll.numOfDice; i++) {
        diceArray[i].className = currentRoll.diceRolledFaces[i];
    }
}


function loseDieUI(playerName, diceLost) {
    player.numOfDice -= diceLost;
    const diceArray = document.querySelector(`${playerName} .dice-bids`).children;
    for (let i = 1; i <= diceLost; i++) {
        diceArray[diceArray.length - 1].remove();
    }
}


