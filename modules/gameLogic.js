import {bidFactory, getRandomNumber} from './utilities.js';


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
        gameState.totalDiceValues.totalDice -= diceLost;
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
        } else if (riskFactor < 2 && riskFactor > 0) {
            if (currentAttribute === 'strong fluffer') {
                this.fluff();
            } else if (currentAttribute === 'regular fluffer') {
                const randomNumber = getRandomNumber(4);
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
                const randomNumber = getRandomNumber(2);
                if (randomNumber === 0) {
                    this.fluff();
                } else if (randomNumber === 1) {
                    this.makeBid();
                }
            } else if (currentAttribute === 'weak fluffer') {
                this.makeBid();
            }      
        } else if (riskFactor < 0 && riskFactor > -2) {
            if (currentAttribute === 'strong fluffer') {
                this.fluff();
            } else if (currentAttribute === 'regular fluffer') {
                const randomNumber = getRandomNumber(4);
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
        const currentAttribute = 'bluffer';
        const diceArray = ['two', 'three', 'four', 'five', 'six'];
        let finalBid;
        if (currentBid) {
            const minimumRiskArray = [];
            const bidNumbers = [];
            for (let i = 0; i < diceArray.length; i++) {
                if (diceArray.indexOf(currentBid.value) < diceArray.indexOf(diceArray[i])) {
                    const testBid = bidFactory(currentBid.number, diceArray[i]);
                    minimumRiskArray.push(this.calculateRiskFactor(testBid));
                    bidNumbers.push(currentBid.number)
                } else {
                    const testBid = bidFactory((currentBid.number + 1), diceArray[i]);
                    minimumRiskArray.push(this.calculateRiskFactor(testBid));
                    bidNumbers.push(currentBid.number + 1);
                }
            }
            const maxBids = [];
            const minBids = [];
            const remainingBids = [];
            const max = Math.max(...minimumRiskArray);
            const min = Math.min(...minimumRiskArray);
            for (let i = 0; i < diceArray.length; i++) {
                if (minimumRiskArray[i] === max) {
                    maxBids.push(bidFactory(bidNumbers[i], diceArray[i]));
                } else if (minimumRiskArray[i] === min) {
                    minBids.push(bidFactory(bidNumbers[i], diceArray[i]));
                } else {
                    remainingBids.push(bidFactory(bidNumbers[i], diceArray[i]));
                }
            }
            if (currentAttribute === 'bluffer') {
                if (this.bids.length && (currentBid.number >= 7)) {
                   const randomIndex = getRandomNumber(maxBids.length);
                    finalBid = maxBids[randomIndex]; 
                } else {
                    const randomIndex = getRandomNumber(minBids.length);
                    finalBid = minBids[randomIndex];
                }
            } else if (currentAttribute === 'regular bidder') {
                const randomIndex = getRandomNumber(maxBids.length);
                finalBid = maxBids[randomIndex];
                if (this.calculateRiskFactor(finalBid) >= 3) {
                    finalBid.number = this.currentRoll.probabilityIndex[finalBid.value];
                }
            } else if (currentAttribute === 'strong bidder') {
                const randomIndex = getRandomNumber(remainingBids.length);
                finalBid = remainingBids[randomIndex];
                if (this.calculateRiskFactor(finalBid) >= 2) {
                    finalBid.number = this.currentRoll.probabilityIndex[finalBid.value];
                }
            }
            if (this.calculateRiskFactor(finalBid) <= -2) {
                this.fluff()
            } else {
                finalBid.player = this.playerName;
                gameState.currentBid = finalBid;
                if ((finalBid.number - currentBid.number) >= 3) {
                    gameState.playerArray.forEach((player) => {
                        if (player.playerName !== finalBid.player) {
                        player.currentRoll.probabilityIndex[finalBid.value] += 2;
                        }
                    })
                } else {
                    gameState.playerArray.forEach((player) => {
                        if (player.playerName !== finalBid.player) {
                        player.currentRoll.probabilityIndex[finalBid.value] += 1;
                        }
                    })
                }

            }  
        } else {
            const probabilityArray = [];
            for (let i = 0; i < diceArray.length; i ++) {
                probabilityArray.push(this.currentRoll.probabilityIndex[diceArray[i]]);
            }
            const maxBids = [];
            const minBids = [];
            const remainingBids = [];
            const max = Math.max(...probabilityArray);
            const min = Math.min(...probabilityArray);
            for (let i = 0; i < diceArray.length; i++) {
                if (probabilityArray[i] === max) {
                    maxBids.push(bidFactory(probabilityArray[i], diceArray[i]));
                } else if (probabilityArray[i] === min) {
                    minBids.push(bidFactory(probabilityArray[i], diceArray[i]));
                } else {
                    remainingBids.push(bidFactory(probabilityArray[i], diceArray[i]));
                }

            }
            if (currentAttribute === 'bluffer') {
                const randomIndex = getRandomNumber(minBids.length);
                finalBid = minBids[randomIndex];
                const randomNumber = getRandomNumber(4);
                if (randomNumber === 0) {
                    finalBid.number += getRandomNumber(4);
                }
                 if (finalBid.number > ((gameState.totalDiceValues.totalDice - this.numOfDice) + this.currentRoll.diceValues[finalBid.value] + this.currentRoll.diceValues.wild)) {
                    finalBid.number = this.currentRoll.probabilityIndex[finalBid.value];
                } 
            } else if (currentAttribute === 'regular bidder') {
                const randomIndex = getRandomNumber(maxBids.length);
                finalBid = maxBids[randomIndex];
                const randomNumber = getRandomNumber(5);
                if (randomNumber = 0) {
                    finalBid.number += getRandomNumber(2);
                } else {
                    finalBid.number -= getRandomNumber(4) + 1;
                }
                if (finalBid.number <= 0) {
                    finalBid.number = 1;
                }
                if (finalBid.number > ((gameState.totalDiceValues.totalDice - this.numOfDice) + this.currentRoll.diceValues[finalBid.value] + this.currentRoll.diceValues.wild)) {
                    finalBid.number = this.currentRoll.probabilityIndex[finalBid.value];
                }
            } else if (currentAttribute === 'strong bidder') {
                const randomIndex = getRandomNumber(remainingBids.length);
                finalBid = remainingBids[randomIndex];
                const randomNumber = getRandomNumber(5);
                if (randomNumber = 0) {
                    finalBid.number += getRandomNumber(2);
                } else {
                    finalBid.number -= getRandomNumber(4) + 1;
                }
                if (finalBid.number <= 0) {
                    finalBid.number = 1;
                }
                if (finalBid.number > ((gameState.totalDiceValues.totalDice - this.numOfDice) + this.currentRoll.diceValues[finalBid.value] + this.currentRoll.diceValues.wild)) {
                    finalBid.number = this.currentRoll.probabilityIndex[finalBid.value];
                }
            }
            finalBid.player = this.playerName;
            gameState.currentBid = finalBid;
            if ((finalBid.number) >= 7) {
                gameState.playerArray.forEach((player) => {
                    if (player.playerName !== finalBid.player) {
                    player.currentRoll.probabilityIndex[finalBid.value] += 2;
                    }
                })
            } else {
                gameState.playerArray.forEach((player) => {
                    if (player.playerName !== finalBid.player) {
                    player.currentRoll.probabilityIndex[finalBid.value] += 1;
                    }
                })
            }
        }
    }

}

const gameState = {
    totalDiceValues: {
        totalDice: 20,
        wild: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
        six: 0
    },
    currentBid: null,
    diceStart: 20,
    playerArray: ['main player object', 'player1 object', 'player2 object', 'player3 object']


}


    const mainPlayer = new Player('#main-player', '#main-player i');
    mainPlayer.currentRoll = new DiceRoll(mainPlayer.numOfDice);
    const player1 =  new Player('#player-1', '#player-1 i');
    player1.currentRoll = new DiceRoll(player1.numOfDice, player1.playersDiceFace);
    const player2 = new Player('#player-2', '#player-2 i');
    player2.currentRoll = new DiceRoll(player2.numOfDice, player2.playersDiceFace);
    const player3 = new Player('#player-3', '#player-3 i');
    player3.currentRoll = new DiceRoll(player3.numOfDice, player3.playersDiceFace);
    
    const newBid = bidFactory(5, 'three');
    mainPlayer.makeBid();
