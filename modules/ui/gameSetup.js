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
                    <button id="roll" class="button hidden">ROLL!</button>
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
                <div id="main-player" class="main-player" data-player="mainPlayer">
                    <div class="dice-bids">
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
                        <div class="die"><i class="fa-solid fa-square-virus" style="color: rgb(188, 43, 7);"></i></div>
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

export {setupPlayerCountUI, setupFormSelectorsUI, loadGameScreen, setupBidUI};