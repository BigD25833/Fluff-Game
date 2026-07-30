import {bidFactory, getRandomNumber, getRandomArrayItem, getWeightedBehavior} from './utilities.js';
import {playerProfiles} from './playerBehavior.js';

// a new instance of the DiceRoll class will be created on the currentRoll property of each player object on every roll
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
    }
    currentRoll = null;
    numOfDice = 5;
    bids = [];
    loseDie(diceLost) {
        this.numOfDice -= diceLost;
        gameState.totalDiceValues.totalDice -= diceLost;
        loseDieUI(this.playerName, diceLost);
    }
    calculateRiskFactor(currentBid) {
        return this.currentRoll.probabilityIndex[currentBid.value] - currentBid.number;
    }
    evaluateBid(currentBid) {
        //get the riskFactor of the currentBid and the current player behavior used to evaluate it
        const riskFactor = this.calculateRiskFactor(currentBid); 
        const currentBehavior = getWeightedBehavior(playerProfiles[this.playerName].evaluateBid);

        //check for obvious catch-all situations based purely on the number of dice remaining and/or a player's own dice
        if (currentBid.number <= (this.currentRoll.diceValues[currentBid.value]) + this.currentRoll.diceValues.wild) {
            this.makeBid();
        } else if (currentBid.number > ((gameState.totalDiceValues.totalDice - this.numOfDice) + this.currentRoll.diceValues[currentBid.value] + this.currentRoll.diceValues.wild)) {
            this.fluff();

        //decided to bid or fluff based on the value of the currentBid's riskFactor and the current player behavior    
        } else if (riskFactor >= 2) {
            this.makeBid();

        } else if (riskFactor < 2 && riskFactor > 0) {
            if (currentBehavior === 'strong fluffer') {
                this.fluff();
            } else if (currentBehavior === 'regular fluffer') {
                getRandomNumber(4) === 0 ? this.fluff() : this.makeBid();
            } else if (currentBehavior === 'weak fluffer') {
                this.makeBid();
            }

        } else if (riskFactor === 0) {
            if (currentBehavior === 'strong fluffer') {
                this.fluff();
            } else if (currentBehavior === 'regular fluffer') {
               getRandomNumber(2) === 0 ? this.fluff() : this.makeBid();
            } else if (currentBehavior === 'weak fluffer') {
                this.makeBid();
            }

        } else if (riskFactor < 0 && riskFactor > -2) {
            if (currentBehavior === 'strong fluffer') {
                this.fluff();
            } else if (currentBehavior === 'regular fluffer') {
                getRandomNumber(4) === 0 ? this.makeBid() : this.fluff();
            } else if (currentBehavior === 'weak fluffer') {
                this.makeBid();
            }    

        } else if (riskFactor <= -2) {
            this.fluff();
        }
    }

    generateLegalNextBids(currentBid) {
        const diceArray = ['two', 'three', 'four', 'five', 'six'];
        const legalBids = [];
        for (let i = 0; i < diceArray.length; i++) {
            if (diceArray.indexOf(currentBid.value) < diceArray.indexOf(diceArray[i])) {
                const nextBid = bidFactory(currentBid.number, diceArray[i], this.playerName);
                nextBid.risk = this.calculateRiskFactor(nextBid);
                legalBids.push(nextBid);
            } else {
                const nextBid = bidFactory(currentBid.number + 1, diceArray[i], this.playerName);
                nextBid.risk = this.calculateRiskFactor(nextBid);
                legalBids.push(nextBid);
            }
        }
        return legalBids;  

    }
    generatePossibleFirstBids() {
        const diceArray = ['two', 'three', 'four', 'five', 'six'];
        const possibleBids = [];
        for (let i = 0; i < diceArray.length; i++) {
            const firstBid = bidFactory(this.currentRoll.probabilityIndex[diceArray[i]], diceArray[i], this.playerName);
            firstBid.risk = firstBid.number;
            possibleBids.push(firstBid);
        }
        return possibleBids;
    }
    sortBidsByRisk(possibleBids) {
        const minRisk = Math.max(...possibleBids.map((bid) => bid.risk));
        const maxRisk = Math.min(...possibleBids.map((bid) => bid.risk));
        const minRiskBids = possibleBids.filter((bid) => bid.risk === minRisk);
        const maxRiskBids = possibleBids.filter((bid) => bid.risk === maxRisk);
        const mediumRiskBids = possibleBids.filter((bid) => bid.risk !== minRisk && bid.risk !== maxRisk);
        return { minRiskBids, maxRiskBids, mediumRiskBids};
    }
    chooseBidByBehavior(behavior, possibleBids) {
        let { minRiskBids, maxRiskBids, mediumRiskBids } = this.sortBidsByRisk(possibleBids);
        let chosenBids;
        if (behavior === 'bluffer') {
            chosenBids = this.bids.length ? maxRiskBids.filter((bid) => bid.risk > -2) : maxRiskBids;
            chosenBids.behavior = 'bluffer';
        } else if (behavior === 'strong bidder') {
            chosenBids = this.bids.length ? mediumRiskBids.filter((bid) => bid.risk > -1) : mediumRiskBids;
        } else if (behavior === 'regular bidder') {
            chosenBids = minRiskBids;
        }
        if (!chosenBids.length) {
            chosenBids = minRiskBids;
        }
        if (this.bids.length && minRiskBids.risk <= -1) {
            chosenBids = 'fluff';
        }
        return chosenBids;
    }

    refineNextBidByTendency(tendency, chosenBids) {
        let finalBid;
        if (tendency === 'conservative') {
            const previousValues = this.bids.map((bid) => bid.value);
            const matchingBids = chosenBids.filter((bid) => previousValues.includes(bid.value));
            finalBid = matchingBids.length ? matchingBids[0] : chosenBids[0]; 
        } else if (tendency === 'aggressive') {
            finalBid = chosenBids[chosenBids.length -1];
        } else if (tendency === 'risky') {
            finalBid = getRandomArrayItem(chosenBids);
            finalBid.number += getRandomNumber(2);
            if (this.calculateRiskFactor(finalBid) >= 2) {
                finalBid.number = this.currentRoll.probabilityIndex[finalBid.value];
            }
        }
        return finalBid;

    }
    refineFirstBidByTendency(tendency, chosenBids) {
        let finalBid;
        if (chosenBids.behavior === 'bluffer') {
            if (tendency === 'conservative') {
                finalBid = chosenBids[0];
                finalBid.number -= getRandomNumber(3); 

            } else if (tendency === 'aggressive') {
                finalBid = chosenBids[chosenBids.length -1];

            } else if (tendency === 'risky') {
                finalBid = getRandomArrayItem(chosenBids);
                finalBid.number += getRandomNumber(3) + 1;
            }

        } else {
            if (tendency === 'conservative') {
                finalBid = chosenBids[0];
                finalBid.number -= getRandomNumber(4) + 1; 

            } else if (tendency === 'aggressive') {
                finalBid = chosenBids[chosenBids.length -1];
                finalBid.number -= getRandomNumber(2) + 1;

            } else if (tendency === 'risky') {
                finalBid = getRandomArrayItem(chosenBids);
            }

        }
        
        return finalBid;
    }
    updateGameWithNewBid(finalBid) {
        if ((!gameState.currentBid && finalBid.number >= 8) || (finalBid.number - gameState.currentBid.number) >= 3) {
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
        gameState.currentBid = finalBid;
        this.bids.push(finalBid);
    }
    makeBid(currentBid) {
        const currentBehavior = getWeightedBehavior(playerProfiles[this.playerName].makeBid);
        const currentTendency = getWeightedBehavior(playerProfiles[this.playerName].tendency);
        let finalBid;
        if (currentBid) {
            const possibleBids = this.generateLegalNextBids(currentBid);
            const chosenBids = this.chooseBidByBehavior(currentBehavior, possibleBids);
            if (chosenBids === 'fluff') {
                this.fluff();
                return;
            } else {
                finalBid = this.refineNextBidByTendency(currentTendency, chosenBids);
            }
        } else {
            const possibleBids = this.generatePossibleFirstBids();
            const chosenBids = this.chooseBidByBehavior(currentBehavior, possibleBids);
            finalBid = this.refineFirstBidByTendency(currentTendency, chosenBids);
        }
        this.updateGameWithNewBid(finalBid);
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



    const mainPlayer = new Player('[data-player="daniel"]', '[data-player="daniel"] i');
    mainPlayer.currentRoll = new DiceRoll(mainPlayer.numOfDice);
    const player1 =  new Player('[data-player="matthew"]', '[data-player="matthew"] i');
    player1.currentRoll = new DiceRoll(player1.numOfDice, player1.playersDiceFace);
    const player2 = new Player('[data-player="evelyn"]', '[data-player="evelyn"] i');
    player2.currentRoll = new DiceRoll(player2.numOfDice, player2.playersDiceFace);
    const player3 = new Player('[data-player="mama"]', '[data-player="mama"] i');
    player3.currentRoll = new DiceRoll(player3.numOfDice, player3.playersDiceFace);
    
    console.log(mainPlayer.currentRoll.diceValues);
    const firstBids = mainPlayer.generatePossibleFirstBids();
  
    const chosenBids = mainPlayer.chooseBidByBehavior('bluffer', firstBids);
    
    console.log(mainPlayer.refineFirstBidByTendency('aggressive', chosenBids));





    /* Maybe refactor the bidding  */