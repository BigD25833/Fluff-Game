import {bidFactory} from 'utilities.js';


class DiceRoll {
    constructor(numOfDice) {
        this.numOfDice = numOfDice;
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

class Player {
    constructor(playerName, playersDiceFace) {
        this.playerName = playerName;
        this.playersDiceFace = playersDiceFace;
        this.playerAttributes = [];
    }
    currentRoll = null;
    numOfDice = 5;
    bids = [];
    loseDie(diceLost) {
        this.numOfDice -= diceLost;
        loseDieUI(this.playerName, diceLost);
    }
    chooseAttribute() {
        const randomIndex = Math.floor(Math.random() * 20);
        return this.playerAttributes[randomIndex];
    }
    calculateRiskFactor(currentBid) {
        return this.currentRoll.probabilityIndex[currentBid.value] - currentBid.number - ((gameState.diceStart - gameState.totalDiceValues.totalDice) * 0.1);
    }
    evaluateBid(currentBid) {
        const riskFactor = this.calculateRiskFactor(currentBid); 
        const currentAttribute = this.chooseAttribute();
        if (currentBid.number <= (this.currentRoll.diceValues[currentBid.value]) + this.currentRoll.diceValues.wild) {
            this.makeBid();
        } else if (currentBid.number > ((gameState.totalDiceValues.totalDice - this.numOfDice) + this.currentRoll.diceValues[currentBid.value] + this.currentRoll.diceValues.wild)) {
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
    makeBid(currentBid) {
        const diceArray = ['two', 'three', 'four', 'five', 'six'];
        const minimumRiskArray = [];
        if (currentBid) {
            for (let i = 0; i < diceArray.length; i++) {
                if (diceArray.indexOf(currentBid.value) < diceArray.indexOf(diceArray[i])) {
                    const testBid = this.bidFactory(currentBid.number, diceArray[i]);
                    minimumRiskArray.push(this.calculateRiskFactor(testBid, this.currentRoll));
                } else {
                    const testBid = this.bidFactory((currentBid.number + 1), diceArray[i]);
                    minimumRiskArray.push(this.calculateRiskFactor(testBid, this.currentRoll));
                }
            }
            const maxBids = [];
            const minBids = [];
            const remainingBids = [];
            const max = Math.max(...minimumRiskArray);
            const min = Math.min(...minimumRiskArray);
            for (let i = 0; i < minimumRiskArray.length; i++) {
                if (minimumRiskArray[i] === max) {
                    maxBids.push(diceArray[i]);
                } else if (minimumRiskArray[i] === min) {
                    minBids.push(diceArray[i]);
                } else {
                    remainingBids.push(diceArray[i]);
                }
            }

        } else {
        

        }
    }

}



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
    currentBid: null,
    diceStart: null,
    playerArray: ['main player object', 'player1 object', 'player2 object', 'player3 object']


}