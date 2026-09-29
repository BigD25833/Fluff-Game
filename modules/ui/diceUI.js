import {sleep, getRandomNumber} from '../utilities.js';
import {DiceRoll} from '../gameObjects.js';
import {audio} from './audio.js';





function rollingDiceAnimation(players) {
    return new Promise((res) => {
        const playersDice = players.map((player) => {
            return document.querySelectorAll(player.playersDice);
        });
        const start = performance.now();
        audio.rollDice.loop = true;
        audio.rollDice.play();
        function frame(now) {
            const elapsed = now - start;
            playersDice.forEach((playerDice) => {
                playerDice.forEach((die) => {
                    const randomIndex = getRandomNumber(6);
                    const dieRolled = DiceRoll.dicePool[randomIndex];
                    die.className = dieRolled.display;
                });
            });
            if (elapsed < 1000) {
                requestAnimationFrame(frame)
            } else {
                res();
                audio.rollDice.loop = false;
            }
        }
        requestAnimationFrame(frame);
    });    
}

function updateDisplay(currentRoll, playersDice) {
    const diceArray = document.querySelectorAll(playersDice);
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

function addPlayerGlow(player) {
    if (player.playerName === 'mainPlayer') {
        const playerGlow = document.querySelector('#bid-area');
        if (getComputedStyle(playerGlow).getPropertyValue('--turn-glow').trim() === 'white') {
            return
        }
        playerGlow.style.setProperty('--turn-glow', 'white');
    } else {
        const playerGlow = document.querySelector(`[data-player="${player.playerName}"]`);
        if (getComputedStyle(playerGlow).getPropertyValue('--turn-glow').trim() === 'white') {
            return
        }
        playerGlow.style.setProperty('--turn-glow', 'white');
    }
    audio.glow.play();    
}

function removePlayerGlow(player) {
    if (player.playerName === 'mainPlayer') {
        document.querySelector('#bid-area').style.setProperty('--turn-glow', 'transparent');
    } else {
        document.querySelector(`[data-player="${player.playerName}"]`).style.setProperty('--turn-glow', 'transparent');
    }
    audio.glow.play();
}

async function typeWriter(string, delay) {
    const messageBoard = document.getElementById('messages');
    messageBoard.textContent = '';
    for (let i = 0; i < string.length; i++) {
        messageBoard.textContent += string[i]
        audio.typeWriter.play();
        await sleep(delay)
        audio.typeWriter.pause();
        audio.typeWriter.currentTime = 0;
    }
}

function determineFirstPlayerUI(gameState) {
    gameState.onInitialRoll = async (players) => {
        await rollingDiceAnimation(players);
        players.forEach((player) => {
            updateDisplay(player.currentRoll, player.playersDice);
        });
        await sleep(1500);
    }
    gameState.onBeforeReroll = async (players) => {
        players.forEach((player) => {
            addPlayerGlow(player); 
        })
        await typeWriter('Rerolling to break the tie of wilds', 50);
        await rollingDiceAnimation(players);

        
    }
    gameState.onAfterReroll = async (players, playersEliminated) => {
        players.forEach((player) => {
            updateDisplay(player.currentRoll, player.playersDice);
        });
        await sleep(1500);
        playersEliminated.forEach((player) => {
            removePlayerGlow(player);
        });
    }
    gameState.onWinner = async (winner) => {
        addPlayerGlow(winner);
        await typeWriter(`${winner.playerName} has the most wilds`, 50);
        await sleep(500);
        await typeWriter(`${winner.playerName} is going first`, 50);
    }
}

export {rollingDiceAnimation, updateDisplay, addPlayerGlow, removePlayerGlow, typeWriter, determineFirstPlayerUI}

