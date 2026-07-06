//main player bidding section event listeners

const menuArrow = document.getElementById('pop-up');
const dieBid = document.getElementById('die-bid');
const menuPopup = document.getElementById('menu');
const menuDice = document.querySelectorAll('[data-menu-die]');
const minusButton = document.getElementById('minus');
const plusButton = document.getElementById('plus');
const numberBid = document.getElementById('display');

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


const valueOfNumberBid = numberBid.textContent;
const valueOfDieBid = dieBid.dataset.menuDie;

//rolling dice

class DiceRoll {
    constructor(numOfDice, playersDiceFace) {
        this.numOfDice = numOfDice;
        this.playersDiceFace = playersDiceFace;
        this.rollDice();
        this.sortDice();
        this.calculateProbabilities(); 
    }
    static dicePool = [
        {value: 'wild', display: 'fa-solid fa-square-virus'},
        {value: 'two', display: 'fa-solid fa-dice-two'}, 
        {value: 'three', display: 'fa-solid fa-dice-three'}, 
        {value: 'four', display: 'fa-solid fa-dice-four'}, 
        {value: 'five', display: 'fa-solid fa-dice-five'}, 
        {value: 'six', display: 'fa-solid fa-dice-six'}]; 
    rollDice() {
       this.diceRolledValues = [];
       this.diceRolledFaces = [];
       for (let i = 0; i < this.numOfDice; i++) {
        const randomIndex = Math.floor(Math.random() * 6);
        const dieRolled = DiceRoll.dicePool[randomIndex];
        this.diceRolledValues.push(dieRolled.value);
        this.diceRolledFaces.push(dieRolled.display);
       }
       gameState.totalDiceValues.totalDice += this.numOfDice;
    }
    updateDisplay()  {
        const diceArray  = document.querySelectorAll(this.playersDiceFace);
        for (let i = 0; i < this.numOfDice; i++) {
            diceArray[i].className = this.diceRolledFaces[i];
        }
    }
    sortDice() {
        this.diceValues = {
            wild: 0,
            two: 0,
            three: 0,
            four: 0,
            five: 0,
            six: 0
        }
        this.diceRolledValues.forEach((die) => {
            this.diceValues[die] += 1;
            gameState.totalDiceValues[die] += 1;
        })
   
    }
    calculateProbabilities() {
        const probabilityFactor = (gameState.totalDiceValues.totalDice - this.numOfDice) / 3;
        this.probabilityIndex = {
            two: Math.ceil(this.diceValues.wild + this.diceValues.two + probabilityFactor),
            three: Math.ceil(this.diceValues.wild + this.diceValues.three + probabilityFactor),
            four: Math.ceil(this.diceValues.wild + this.diceValues.four + probabilityFactor),
            five: Math.ceil(this.diceValues.wild + this.diceValues.five + probabilityFactor),
            six: Math.ceil(this.diceValues.wild + this.diceValues.six + probabilityFactor)
        }
        

    }
  

}

const playerAttributes = ['strong bidder', 'normal bidder', 'weak bidder', 'strong fluffer', 'regular fluffer', 'weak fluffer', 'regular bluffer', 'strong bluffer']

class Player {
    constructor(playerName, playersDiceFace) {
        this.playerName = playerName;
        this.playersDiceFace = playersDiceFace;
        this.playerAttributes = [];
    }
    numOfDice = 5;
    loseDie(diceLost) {
        this.numOfDice -= diceLost;
        const diceArray = document.querySelector(`${this.playerName} .dice-bids`).children;
        for (let i = 1; i <= diceLost; i++) {
            diceArray[diceArray.length - 1].remove();
        }
    }
    bids = []
    chooseAttribute() {
        const randomIndex = Math.floor(Math.random() * 20);
        return this.playerAttributes[randomIndex];
    }

    evaluateBid(currentBid, currentRoll) {
    const riskFactor = currentRoll.probabilityIndex[currentBid.value] - currentBid.number - ((20 - gameState.totalDiceValues.totalDice) * 0.2);
    const currentAttribute = this.chooseAttribute();
    if (currentBid.number <= (currentRoll.diceValues[currentBid.value]) + currentRoll.diceValues.wild) {
        this.makeBid();
    } else if (currentBid.number > ((gameState.totalDiceValues.totalDice - this.numOfDice) + currentRoll.diceValues[currentBid.value] + currentRoll.diceValues.wild)) {
        this.fluff();
    } else if (riskFactor >= 2) {
        this.makeBid();
    } else if (riskFactor === 1) {
        if (currentAttribute === 'strong fluffer') {
            this.fluff();
        } else if (currentAttribute === 'regular fluffer') {
            const randomNumber = Math.floor(Math.random * 4);
            if (randomNumber === 0) {
                this.fluff();
            } else {
                this.makeBid();
            }
        } else if (currentAttribute === 'weak fluffer') {
            this.makeBid();
        }
    } else if (riskFactor === 0) {
        if (currentAttribute === 'strong fluffer') {
            this.fluff();
        } else if (currentAttribute === 'regular fluffer') {
            const randomNumber = Math.floor(Math.random() * 2);
            if (randomNumber === 0) {
                this.fluff();
            } else if (randomNumber === 1) {
                this.makeBid();
            }
        } else if (currentAttribute === 'weak fluffer') {
            this.makeBid();
        }      
    } else if (riskFactor === -1) {
        if (currentAttribute === 'strong fluffer') {
            this.fluff();
        } else if (currentAttribute === 'regular fluffer') {
            const randomNumber = Math.floor(Math.random() * 4);
            if (randomNumber === 0) {
                this.makeBid();
            } else {
                this.fluff();
            }
        } else if (currentAttribute === 'weak fluffer') {
            this.makeBid();
        }     
    } else if (riskFactor <= -2) {
        this.fluff();
    }
    
    }
    makeBid() {
        //high first bid adds +2; bid that jumps up by 3 or more adds 2

    }

};



const gameState = {
    totalDiceValues: {
        totalDice: 0,
        wild: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
        six: 0
    },
    currentBid: null


}

const rollButton = document.getElementById('roll');
rollButton.addEventListener('click', () => {
    const mainPlayer = new Player('#main-player', '#main-player i');
    const newRoll = new DiceRoll(mainPlayer.numOfDice, mainPlayer.playersDiceFace);
    newRoll.updateDisplay();
    const player1 =  new Player('#player-1', '#player-1 i');
    const newRoll2 = new DiceRoll(player1.numOfDice, player1.playersDiceFace);
    newRoll2.updateDisplay();
    const player2 = new Player('#player-2', '#player-2 i');
    const newRoll3 = new DiceRoll(player2.numOfDice, player2.playersDiceFace);
    newRoll3.updateDisplay();
    const player3 = new Player('#player-3', '#player-3 i');
    const newRoll4 = new DiceRoll(player3.numOfDice, player3.playersDiceFace);
    newRoll4.updateDisplay();



})

// bid is an object {number: 1, value: 'two'}



