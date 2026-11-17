import {setupPlayerCountUI, setupFormSelectorsUI, getOpponents, loadGameScreen, setupBidUI} from './modules/ui/gameSetup.js';
import {updateDisplay, addPlayerGlow, removePlayerGlow, typeWriter, attachUIHooks, getMainPlayerBid} from './modules/ui/diceUI.js';
import {gameState, Player, DiceRoll} from './modules/gameObjects.js';
import {audio} from './modules/ui/audio.js';


const submitButton = document.getElementById('submit');
submitButton.addEventListener('click', (e) => {
    gameState.initiatePlayerObjects(getOpponents());
    loadGameScreen();
    setupBidUI();
    attachUIHooks(gameState);
    document.querySelectorAll('.new-bids').forEach((bidArea) => {
    bidArea.addEventListener('scroll', () => {
        const topCushion = document.querySelectorAll('.top-cushion');
        const bottomCushion = document.querySelectorAll('.bottom-cushion');
        if (!gameState.isAutoScrolling) {
            topCushion.forEach((cushion) => cushion.style.height = '0px');
            bottomCushion.forEach((cushion) => cushion.style.height = '0px');
        }
    });
});

});

document.addEventListener('click', async (e) => {
    audio.click.play();
    if (e.target.matches('.information i')) {
        document.querySelector('.instructions').style.display = 'block';
    } else if (e.target.matches('#roll')) {
        if (!e.target.classList.contains('first')) {
            await gameState.determineFirstPlayer()
        } else {
            await gameState.beginGame()
        }
        
    } else if (e.target.matches('#fluff')) {
        gameState.mainPlayerFluff(gameState.currentBid);
    } else if (e.target.matches('#bid')) {
        gameState.mainplayerBid(getMainPlayerBid());
    } else if (e.target.matches('#next')) {
        gameState.beginNewRound();

    } else if (!document.querySelector('.instructions').contains(e.target)) {
        document.querySelector('.instructions').style.display = 'none';
    }
})




setupPlayerCountUI();
setupFormSelectorsUI();


/*Things that need working on:
    bluffing way too high even on first bid
    bidding on things that have been bidden alot even though you have none instead of fluffing
    (maybe have a different risk evaluation when you don't have any of the leastrisk die)
    fluffing out of turn

    update player tendencies after winning or losing a fluff
    fix messages
    making it impossible to make an illegal bid
    make it impossible to press a wrong button
    infininte loop at the end of bids
    poor bidding decision when down to one or two dice */






    






