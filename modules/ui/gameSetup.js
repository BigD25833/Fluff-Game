function updateFormSelectors(selectors) {    
    const playerArray = ['Daniel', 'Matthew', 'Mama', 'Evelyn'];
    const chosen = new Set([...selectors].map((select) => select.value).filter((value) => value !== ''));
    selectors.forEach((selector) => {
        const currentValue = selector.value;
        selector.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.disabled = true;
        placeholder.selected = currentValue === '';
        placeholder.hidden = true;
        placeholder.textContent = 'Select an opponent';
        selector.appendChild(placeholder);

        playerArray.forEach((player) => {
            if (chosen.has(player) && currentValue !== player) return;
            const option = document.createElement('option');
            option.value = player;
            option.textContent = player;
            if (player === currentValue) option.selected = true;
            selector.appendChild(option);
        });
    });
}


function setupPlayerCountUI() {
    const radioButtons = document.querySelectorAll('input[name="number-of-players"]');
    const dynamicOption = document.getElementById('dynamic-option');
    radioButtons.forEach((radio) => {
        radio.addEventListener('change', () => {
            const value = radio.value;
            dynamicOption.style.display = value === '4' ? 'block' : 'none';
        });
    });
}

function setupFormSelectorsUI() {
    const selectors = document.querySelectorAll('.opponent-selector');
    const resetButton = document.getElementById('reset');

    selectors.forEach((selector) => {
        selector.addEventListener('change', () => updateFormSelectors(selectors));
    });

    resetButton.addEventListener('click', () => {
        selectors.forEach((selector) => {
            selector.value = '';
        })
        updateFormSelectors(selectors);
    });

    updateFormSelectors(selectors);
}

function setupBidUI() {
    //DOM Queries
    const menuArrow = document.getElementById('pop-up');
    const dieBid = document.getElementById('die-bid');
    const menuPopup = document.getElementById('menu');
    const menuDice = document.querySelectorAll('[data-menu-die]');
    const minusButton = document.getElementById('minus');
    const plusButton = document.getElementById('plus');
    const numberBid = document.getElementById('display');

    //Add event listeners to the bidding buttons
    menuArrow.addEventListener('click', () => {
        menuPopup.classList.toggle('hidden');
    });

    menuDice.forEach((die) => {
        die.addEventListener('click', () => {
            const dieFace = die.innerHTML;
            const valueOfDieBid = die.dataset.menuDie;
            dieBid.innerHTML = dieFace;
            dieBid.dataset.menuDie = valueOfDieBid;
            menuPopup.classList.toggle('hidden');     
        });
    });

    minusButton.addEventListener('click', () => {
        let valueOfNumberBid = Number(numberBid.textContent);
        if (valueOfNumberBid === 1) {
            return
        }
        valueOfNumberBid--;
        numberBid.textContent = valueOfNumberBid;
    })

    plusButton.addEventListener('click', () => {
    let valueOfNumberBid = Number(numberBid.textContent);
    if (valueOfNumberBid === 20) {
        return
    }
    valueOfNumberBid++;
    numberBid.textContent = valueOfNumberBid;
    })
}

function getOpponents() {
    const opponent1 = document.getElementById('opponent-1');
    const opponent2 = document.getElementById('opponent-2');
    const opponent3 = document.getElementById('opponent-3');
    return [opponent1.value, opponent2.value, opponent3.value, 'mainPlayer'];
}

function loadGameScreen() {
    const opponent1 = document.getElementById('opponent-1');
    const opponent2 = document.getElementById('opponent-2');
    const opponent3 = document.getElementById('opponent-3');
    const container = document.getElementById('container');

    const player1 = opponent1.value;
    const player2 = `<div class="player" id="player2" data-player="${opponent2.value}">
                <img src="images/${opponent2.value}.JPG" alt="">
                <h2>${opponent2.value}</h2>                
                <div class="dice-bids">
                    <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                    <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                    <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                    <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                    <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                </div>
            </div>`;
    const player3 = opponent3.value ? opponent3.value : opponent2.value;

    container.innerHTML = `
        <div class="game-play">
                ${opponent3.value ? player2 : ''}
                <div class="information"><i class="fa-regular fa-circle-question"></i>
                <div class="instructions">
                <h2>How to Play Fluff</h2>
                <ol>
                    <li>Players begin with five dice with a wild face instead of the one. Wilds automatically count as whatever dice value is currently being bid.</li>
                    <li>To begin, all players roll their dice. The player with the most wilds goes first. If there is a tie, tied players reroll until one player has the most wilds.</li>
                    <li>To start a round, all players roll their dice and keep them hidden from the other players. The player going first makes a bid which consists of a number and die value (2-6). The bid is an estimation of how many <strong>total dice</strong> of that value have been rolled.</li>
                    <li>The next player has the option to either raise the bid or challenge the bid. In order to raise, each bid must be higher in number (e.g., three 4s to four 4s) or value (e.g., four 4s to four 5s)</li>
                    <li>Play continues clockwises until a player challenges the bid and all the dice are revealed. If the actual number of dice is <strong>equal to or greater</strong> than the number bid, the challenger loses a die. If the actual number of dice is <strong>less than</strong> the number bid, the bidder loses a die.</li>
                    <li>Players have to option to challenge a bid out of turn. If they are wrong, the challenger loses <strong>two</strong> dice. However, if they are right, the bidder still only loses one die.</li>
                    <li>The player who lost a die in previous round starts the bidding for the next round. If a player loses their final die, they are out of the game and the player to their left starts the next round.</li>
                    <li>The last player to have a die wins the game.</li>
                </ol>
                </div>
                </div>
                <div class="player" id="player1" data-player="${player1}">
                    <img src="images/${player1}.JPG" alt="">
                    <h2>${player1}</h2>
                    <div class="dice-bids">
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                    </div>
                </div>
                <div class="center">
                    <button id="roll" class="button">ROLL!</button>
                    <div class="communications hidden">
                    <div id="player-1-comm">
                        <div class="new-bids" data-bids="player-1">
                            <div class="top-cushion"></div>
                            <div class="bid-list"></div>
                            <div class="bottom-cushion"></div>  
                        </div>                        
                    </div>
                    <div id="player-2-comm">
                        <div class="new-bids" data-bids="player-2">
                            <div class="top-cushion"></div>
                            <div class="bid-list"></div>
                            <div class="bottom-cushion"></div>
                        </div>                        
                    </div>
                    <button class="button" id="next">NEXT</button>
                    <div id="player-3-comm">
                        <div class="new-bids" data-bids="player-3">
                            <div class="top-cushion"></div>
                            <div class="bid-list"></div>
                            <div class="bottom-cushion"></div>
                        </div>
                    </div>
                    <div id="main-player-comm" >
                        <div class="new-bids" data-bids="main-player">
                            <div class="top-cushion"></div>
                            <div class="bid-list"></div>
                            <div class="bottom-cushion"></div>
                        </div>         
                    </div>  
                    </div>
                </div>
                <div class="player" id="player3" data-player="${player3}">
                    <img src="images/${player3}.jpg" alt="">
                    <h2>${player3}</h2>
                    <div class="dice-bids">
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                    </div>
                </div>
                <div id="messages">Roll the dice to see who goes first!</div>
                <div id="main-player" class="main-player" >
                    <div data-player="mainPlayer">
                    <div class="dice-bids">
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                    </div>
                    </div>
                    <div class="controls">
                        <button id="fluff" class="fluff button">Fluff</button>
                        <div id="bid-area">
                            <h4>Make a bid</h4>
                            <div id="bid-buttons">
                                <button id="minus" class="minus button">-</button>
                                <div id="display">1</div>
                                <button id="plus" class="plus button">+</button>
                                <div class="dice-bids">
                                    <div id="die-bid" class="die"><i class="fa-solid fa-dice-two" style="color: rgb(188, 43, 7);"></i></div>
                                    <div id="menu" class=" dice-bids menu hidden">
                                        <div data-menu-die="two" class="die"><i class="fa-solid fa-dice-two" style="color: rgb(188, 43, 7);"></i></div>
                                        <div data-menu-die="three" class="die"><i class="fa-solid fa-dice-three" style="color: rgb(188, 43, 7);"></i></div>
                                        <div data-menu-die="four" class="die"><i class="fa-solid fa-dice-four" style="color: rgb(188, 43, 7);"></i></div>
                                        <div data-menu-die="five" class="die"><i class="fa-solid fa-dice-five" style="color: rgb(188, 43, 7);"></i></div>
                                        <div data-menu-die="six" class="die"><i class="fa-solid fa-dice-six" style="color: rgb(188, 43, 7);"></i></div>
                                    </div>
                                    <span id="pop-up">^</span>
                                </div>
                            </div>
                        </div>
                        <button class="bid button">Bid</button>
                    </div>
                </div>

            </div>`;
}

export {setupPlayerCountUI, setupFormSelectorsUI, loadGameScreen, setupBidUI, getOpponents};