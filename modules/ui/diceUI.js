import {sleep, getRandomNumber, bidFactory} from '../utilities.js';
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


function loseDieUI(player, diceLost) {
    const diceArray = document.querySelector(`[data-player="${player.playerName}"] .dice-bids`).children;
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

async function displayBid(gameState, player, fluffing) {
    const playerBids = document.querySelector(`[data-bids="${player.playerName}"]`);
    const bidList = document.querySelector(`[data-bids="${player.playerName}"] .bid-list`); 
    const topCushion = document.querySelector(`[data-bids="${player.playerName}"] .top-cushion`);
    const bottomCushion = document.querySelector(`[data-bids="${player.playerName}"] .bottom-cushion`);
    const currentBid = player.bids[player.bids.length - 1];
    topCushion.style.height = '150px';
    bottomCushion.style.height = '150px';
    let newBid;
    if (fluffing) {
        newBid = document.createElement('div');
        newBid.textContent = 'CALL!';
    } else {
        newBid = document.createElement('div');
        newBid.className = 'die';
        newBid.innerHTML = `${currentBid.number}<i class="${DiceRoll.getDisplay(currentBid.value)}" style="color: rgb(188, 43, 7);"></i>`;
    }
    bidList.appendChild(newBid);
    gameState.isAutoScrolling = true;
    await sleep(40);
    const parentHeight = playerBids.clientHeight;
    const childHeight = newBid.offsetHeight;
    const offset = newBid.offsetTop;
    const scrollTarget = offset - (parentHeight / 2) + (childHeight / 2 );
    playerBids.scrollTo({top: scrollTarget, behavior: 'smooth'});
    await sleep(1000);
    gameState.isAutoScrolling = false;
}

function getMainPlayerBid() {
    const bidNumber = Number(document.getElementById('display').textContent);
    const bidValue = document.getElementById('die-bid').dataset.menuDie;
    return bidFactory(bidNumber, bidValue, 'mainPlayer');
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
        await typeWriter(`${winner.playerName === 'mainPlayer' ? 'You' : winner.playerName} ${winner.playerName === 'mainPlayer' ? 'have' : 'has'} the most wilds`, 50);
        await sleep(1000);
        await typeWriter(`${winner.playerName === 'mainPlayer' ? 'You' : winner.playerName} ${winner.playerName === 'mainPlayer' ? 'are' : 'is'} going first`, 50);
        await sleep(1000);
        await typeWriter('Roll the dice to start the game', 50);
        document.getElementById('roll').classList.add('first');

    }
}



function biddingUI(gameState) {
    gameState.beginGameUI = () => {
        document.getElementById('roll').classList.toggle('hidden');
        document.getElementById('communication').classList.toggle('hidden');
    }
    gameState.onReroll = async (players) => {
        await rollingDiceAnimation(players);
        players.forEach((player) => {
            document.querySelectorAll(player.playersDice).forEach((die) => {
                die.className = 'fa-solid fa-square-virus';
            });
        });
        updateDisplay(players[players.length - 1].currentRoll, players[players.length - 1].playersDice);
    }
    gameState.beforeBidding = async (player) => {
        addPlayerGlow(player);
        await sleep(5000);
    }
    gameState.afterBidding = (player) => {
        displayBid(gameState, player, false);
        removePlayerGlow(player);
    }
    gameState.beforeMainPlayerBid = async (player) => {
        addPlayerGlow(player);
        await typeWriter('Your turn to make a bid', 25);
    }
    gameState.onFluffing = async (player, success, diceLost) => {
        const currentPlayer = gameState.currentPlayer;
        displayBid(gameState, currentPlayer, true);
        await typeWriter(`${currentPlayer.playerName === 'mainPlayer'? 'You' : currentPlayer.playerName} ${currentPlayer.playerName === 'mainPlayer' ? 'are' : 'is'} calling the bid`, 50);
        gameState.playerArray.forEach((player) => {
            updateDisplay(player.currentRoll, player.playersDice);
        });
        await sleep(5000);
        if (success) {
            if (gameState.currentBid.number > 1) {
                await typeWriter(`The call is successful. There are not ${gameState.currentBid.number} ${gameState.currentBid.value}${gameState.currentBid.value === 'six' ? 'es' : 's'}`, 50);
            } else {
                await typeWriter(`The call is successful. There is not 1 ${gameState.currentBid.value}`, 50);
            }
        } else {
            if (gameState.currentBid.number > 1) {
                await typeWriter(`The call is not successfull. There are at least ${gameState.currentBid.number} ${gameState.currentBid.value}${gameState.currentBid.value === 'six' ? 'es' : 's'}`, 50);
            } else {
                await typeWriter(`The call is not successfull. There is at least 1 ${gameState.currentBid.value}`, 50);
            }
            
        }
        //await sleep(5000);
        loseDieUI(player, diceLost);
        //await typeWriter(`${player.playerName === 'mainPlayer' ? 'You' : player.playerName} ${player.playerName === 'mainPlayer' ? 'lose' : 'loses'} a die`, 50);
        //await sleep(3000);
        if (currentPlayer.playerName !== player.playerName) {
            removePlayerGlow(currentPlayer);
            addPlayerGlow(player);
        }
        //await typeWriter(`${player.playerName === 'mainPlayer' ? 'You' : player.playerName} will begin the next round`, 50);
        //await sleep(2000);
        await typeWriter (`Click next to begin a new round`, 50);
    }
    gameState.onNewRound = () => {
        document.querySelectorAll('.bid-list').forEach((list) => {
            list.innerHTML = '';
        })
    }
    gameState.onEliminated = async (player) => {
        removePlayerGlow(player);
        addPlayerGlow(gameState.currentPlayer)
        typeWriter(`${player.playerName === 'mainPlayer' ? 'You' : player.playerName} ${player.playerName === 'mainPlayer' ? 'are' : 'is'} eliminated from the game`);

    }
}



function attachUIHooks(gameState) {
    determineFirstPlayerUI(gameState);
    biddingUI(gameState);
}

export {rollingDiceAnimation, updateDisplay, addPlayerGlow, removePlayerGlow, typeWriter, attachUIHooks, getMainPlayerBid}

