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
    constructor(numOfDice) {
        this.numOfDice = numOfDice;
        this.rollDice(); 
    }
    static dicePool = [
        {value: 'wild', display: 'fa-solid fa-square-virus'},
        {value: 'two', display: 'fa-solid fa-dice-two'}, 
        {value: 'three', display: 'fa-solid fa-dice-three'}, 
        {value: 'four', display: 'fa-solid fa-dice-four'}, 
        {value: 'five', display: 'fa-solid fa-dice-five'}, 
        {value: 'six', display: 'fa-solid fa-dice-six'}]; 
    rollDice = () => {
       this.diceRolledValues = [];
       this.diceRolledFaces = [];
       for (let i = 0; i < this.numOfDice; i++) {
        const randomIndex = Math.floor(Math.random() * 6);
        const dieRolled = DiceRoll.dicePool[randomIndex];
        this.diceRolledValues.push(dieRolled.value);
        this.diceRolledFaces.push(dieRolled.display);
       }
    }
    updateDisplay = (playerName, boxName) => {
        const diceArray  =  Array.from(document.querySelectorAll(playerName));
        const boxArray = Array.from(document.querySelectorAll(boxName));
        for (let i = 0; i < this.numOfDice; i++) {
            diceArray[i].className = this.diceRolledFaces[i];
        }
    }
}




 

const rollButton = document.getElementById('roll');
rollButton.addEventListener('click', () => {
    const mainPlayerRoll = new DiceRoll(5);
    mainPlayerRoll.updateDisplay('.main-player i', '.main-player .die');
    const player1Roll = new DiceRoll(5);
    player1Roll.updateDisplay('#player-1 i', '#player-1 .die');
    const player2Roll = new DiceRoll(5);
    player2Roll.updateDisplay('#player-2 i', '#player-2 .die');
    const player3Roll = new DiceRoll(5);
    player3Roll.updateDisplay('#player-3 i', '#player-3 .die');

})