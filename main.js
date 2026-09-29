import {setupPlayerCountUI, setupFormSelectorsUI, getOpponents, loadGameScreen, setupBidUI} from './modules/ui/gameSetup.js';
import {updateDisplay, addPlayerGlow, removePlayerGlow, typeWriter, determineFirstPlayerUI} from './modules/ui/diceUI.js';
import {gameState, Player, DiceRoll} from './modules/gameObjects.js';
import {audio} from './modules/ui/audio.js';


const submitButton = document.getElementById('submit');
submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    gameState.initiatePlayerObjects(getOpponents());
    loadGameScreen();
    setupBidUI();
});

document.addEventListener('click', async (e) => {
    audio.click.play();
    if (e.target.matches('.information i')) {
        document.querySelector('.instructions').style.display = 'block';
    } else if (e.target.matches('#roll')) {
        determineFirstPlayerUI(gameState)
        await gameState.determineFirstPlayer()
    } else if (e.target.matches('#fluff')) {

    } else if (e.target.matches('#bid')) {

    } else if (!document.querySelector('.instructions').contains(e.target)) {
        document.querySelector('.instructions').style.display = 'none';
    }
})


setupPlayerCountUI();
setupFormSelectorsUI();














   






























/*const mainPlayer = document.querySelector('[data-bids="player-3"]');
const bidList = document.querySelector('[data-bids="player-3"] .bid-list'); 
const topCushion = document.querySelector('[data-bids="player-3"] .top-cushion');
const bottomCushion = document.querySelector('[data-bids="player-3"] .bottom-cushion');
let isAutoScrolling = false;

mainPlayer.addEventListener('scroll', () => {
    if (!isAutoScrolling) {
        topCushion.style.height = '0px';
        bottomCushion.style.height = '0px';

    }
    
    
})


const next = document.getElementById('next');
next.addEventListener('click', () => {
    
    topCushion.style.height = '150px';
    bottomCushion.style.height = '150px';
    const newBid = document.createElement('div');
    newBid.className = 'die';
    newBid.innerHTML = `${Math.floor(Math.random() * 4)}<i class="fa-solid fa-dice-six" style="color: rgb(188, 43, 7);"></i>`;
    bidList.appendChild(newBid);
    isAutoScrolling = true;
    
    setTimeout(() => {
        const parentHeight = mainPlayer.clientHeight;
        const childHeight = newBid.offsetHeight;
        const offset = newBid.offsetTop;
        const scrollTarget = offset - (parentHeight / 2) + (childHeight / 2 );
        mainPlayer.scrollTo({top: scrollTarget, behavior: 'smooth'});
        setTimeout(() => {
            isAutoScrolling = false;
        }, 1000);
    }, 40)
    
}); */








    






