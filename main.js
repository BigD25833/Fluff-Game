








const rollButton = document.getElementById('roll');
rollButton.addEventListener('click', () => {
    const mainPlayer = new Player('#main-player', '#main-player i');
    mainPlayer.currentRoll = new DiceRoll(mainPlayer.numOfDice, mainPlayer.playersDiceFace);
    mainPlayer.currentRoll.updateDisplay();
    const player1 =  new Player('#player-1', '#player-1 i');
    player1.currentRoll = new DiceRoll(player1.numOfDice, player1.playersDiceFace);
    player1.currentRoll.updateDisplay();
    const player2 = new Player('#player-2', '#player-2 i');
    player2.currentRoll = new DiceRoll(player2.numOfDice, player2.playersDiceFace);
    player2.currentRoll.updateDisplay();
    const player3 = new Player('#player-3', '#player-3 i');
    player3.currentRoll = new DiceRoll(player3.numOfDice, player3.playersDiceFace);
    player3.currentRoll.updateDisplay();
});

    






