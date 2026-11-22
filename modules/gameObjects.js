import {bidFactory, getRandomNumber, getRandomArrayItem, getWeightedBehavior, getNextIndex, sleep} from './utilities.js';
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
        {value: 'six', display: 'fa-solid fa-dice-six'}]
    static getDisplay(value) {
        return this.dicePool.find((die) => die.value === value).display;
    }    
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
        let probabilityFactor;
        if (gameState.totalDiceValues.totalDice <= 6) {
            probabilityFactor = Math.floor((gameState.totalDiceValues.totalDice - this.numOfDice) / 3);
            if (probabilityFactor < 1) {
                probabilityFactor = 1;
            }
        } else {
            probabilityFactor = Math.ceil((gameState.totalDiceValues.totalDice - this.numOfDice) / 3);
        }
        this.probabilityIndex = {
            two: this.diceValues.wild + this.diceValues.two + probabilityFactor,
            three: this.diceValues.wild + this.diceValues.three + probabilityFactor,
            four: this.diceValues.wild + this.diceValues.four + probabilityFactor,
            five: this.diceValues.wild + this.diceValues.five + probabilityFactor,
            six: this.diceValues.wild + this.diceValues.six + probabilityFactor
        }
    }
}



class Player {
    constructor(playerName, playersDice, playerAttributes) {
        this.playerName = playerName;
        this.playersDice = playersDice;
        this.playerAttributes = playerAttributes;
    }
    currentRoll = null;
    numOfDice = 5;
    bids = [];
    loseDie(diceLost) {
        this.numOfDice -= diceLost;
        gameState.totalDiceValues.totalDice -= diceLost;
        gameState.fluffData.playerLosing = this;
        gameState.fluffData.diceLost = diceLost;
    }
    calculateRiskFactor(currentBid) {
        return this.currentRoll.probabilityIndex[currentBid.value] - currentBid.number;
    }
    evaluateBid(currentBid) {
        if (!currentBid) {
            this.makeBid(currentBid);
            return
        }
        //get the riskFactor of the currentBid and the current player behavior used to evaluate it
        const riskFactor = this.calculateRiskFactor(currentBid); 
        console.log('fluffing risk ' + riskFactor)
        const currentBehavior = getWeightedBehavior(this.playerAttributes.evaluateBid);
        console.log('fluffing attribute' + currentBehavior)

        //check for obvious catch-all situations based purely on the number of dice remaining and/or a player's own dice
        if (currentBid.number <= (this.currentRoll.diceValues[currentBid.value]) + this.currentRoll.diceValues.wild) {
            this.makeBid(currentBid);
        } else if (currentBid.number > ((gameState.totalDiceValues.totalDice - this.numOfDice) + this.currentRoll.diceValues[currentBid.value] + this.currentRoll.diceValues.wild)) {
            this.fluff(currentBid);

        //decided to bid or fluff based on the value of the currentBid's riskFactor and the current player behavior    
        } else if (riskFactor >= 0.25) {
            this.makeBid(currentBid);

        } else if (riskFactor < 0.25 && riskFactor > 0) {
            if (currentBehavior === 'strong fluffer') {
                this.fluff(currentBid);
            } else if (currentBehavior === 'regular fluffer') {
                getRandomNumber(4) === 0 ? this.fluff(currentBid) : this.makeBid(currentBid);
            } else if (currentBehavior === 'weak fluffer') {
                this.makeBid(currentBid);
            }

        } else if (riskFactor === 0) {
            if (currentBehavior === 'strong fluffer') {
                this.fluff(currentBid);
            } else if (currentBehavior === 'regular fluffer') {
               getRandomNumber(2) === 0 ? this.fluff(currentBid) : this.makeBid(currentBid);
            } else if (currentBehavior === 'weak fluffer') {
                this.makeBid(currentBid);
            }

        } else if (riskFactor < 0 && riskFactor > -0.75) {
            if (currentBehavior === 'strong fluffer') {
                this.fluff(currentBid);
            } else if (currentBehavior === 'regular fluffer') {
                getRandomNumber(4) === 0 ? this.makeBid(currentBid) : this.fluff(currentBid);
            } else if (currentBehavior === 'weak fluffer') {
                this.makeBid(currentBid);
            }    

        } else if (riskFactor <= -0.75) {
            this.fluff(currentBid);
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
        return {minRiskBids, maxRiskBids, mediumRiskBids};
    }
    chooseBidByBehavior(behavior, possibleBids) {
        console.log('behavior' + behavior)
        console.log('bid groups' + JSON.stringify(this.sortBidsByRisk(possibleBids)));
        let { minRiskBids, maxRiskBids, mediumRiskBids } = this.sortBidsByRisk(possibleBids);
        if (!mediumRiskBids.length) {
            mediumRiskBids = minRiskBids;
        }
        let chosenBids;
        let biddingRisk;
        if (gameState.currentBid && this.currentRoll.diceValues[gameState.currentBid.value] >=2 || gameState.totalDiceValues.totalDice <= 8) {
            biddingRisk = -1;
        } else {
            biddingRisk = -0.75;
        }
     /*   if (gameState.totalDiceValues.totalDice <= 10) {
            if (behavior === 'strong bidder') {
                behavior = getRandomNumber(2) === 0 ? 'bluffer' : 'regular bidder'; 
            }    
        } */
        if (behavior === 'bluffer') {
            chosenBids = maxRiskBids.filter((bid) => bid.risk > biddingRisk);
            if (!chosenBids.length) {
                chosenBids = minRiskBids.filter((bid) => bid.risk > biddingRisk);
            }
        } else if (behavior === 'strong bidder') {
            chosenBids = mediumRiskBids.filter((bid) => bid.risk > biddingRisk);
            if (!chosenBids.length) {
                chosenBids = minRiskBids.filter((bid) => bid.risk > biddingRisk);
            }
        } else if (behavior === 'regular bidder') {
            chosenBids = minRiskBids.filter((bid) => bid.risk > biddingRisk);
        }
        console.log('chosenBids: ' + chosenBids);
        if (!chosenBids.length) {
            chosenBids = 'fluff';
            console.log('the bidding fluff option has been activated')
        }      
        return chosenBids;    
    }

    refineNextBidByTendency(tendency, chosenBids) {
        console.log('tendency' + tendency)
        let finalBid;
        if (this.bids.length || gameState.totalDiceValues.totalDice < 8) {
            if (tendency === 'risky') {
                tendency = getRandomNumber(2) === 0 ? 'conservative' : 'aggressive';
            }
        }
        if (tendency === 'conservative') {
            const previousValues = this.bids.map((bid) => bid.value);
            const matchingBids = chosenBids.filter((bid) => previousValues.includes(bid.value));
            finalBid = matchingBids.length ? matchingBids[0] : chosenBids[0]; 
        } else if (tendency === 'aggressive') {
            finalBid = chosenBids[chosenBids.length -1];
        } else if (tendency === 'risky') {
            finalBid = {...getRandomArrayItem(chosenBids)};
            if (finalBid.number > gameState.currentBid.number) {
                finalBid.number += 1;
            } else {
                finalBid.number += getRandomNumber(2) + 1;
            }
            if (gameState.currentBid && this.currentRoll.diceValues[finalBid.value] / finalBid.number < 0.375) {
                console.log('conservative options')
                return this.refineNextBidByTendency('conservative', chosenBids)
            }
        }
        return finalBid;

    }
    refineFirstBidByTendency(tendency, chosenBids, behavior) {
        let finalBid;
        if (gameState.totalDiceValues.totalDice <= 10 && gameState.totalDiceValues.totalDice > 4) {
            if (tendency === 'risky') {
                tendency = getRandomNumber(2) === 0 ? 'conservative' : 'aggressive';
            }
        }
        if (gameState.totalDiceValues.totalDice <= 4 && behavior === 'bluffer') {
            if (tendency === 'risky') {
                tendency = getRandomNumber(2) === 0 ? 'conservative' : 'aggressive';
            }     
        }
        if (behavior === 'bluffer') {
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
        let increase; 
        let diceNumber = gameState.totalDiceValues.totalDice;
        if (diceNumber > 14) {
            increase = 0.75;
        } else if (diceNumber > 8) {
            increase = 0.65;
        } else if (diceNumber > 4) {
            increase = 0.35;
        } else {
            increase = 0.25;
        }
        if ((!gameState.currentBid && finalBid.number >= 8) || (gameState.currentBid && (finalBid.number - gameState.currentBid.number >= 3))) {
            gameState.playerArray.forEach((player) => {
                if (player.playerName !== finalBid.player) {
                    player.currentRoll.probabilityIndex[finalBid.value] += 1.5;
                }
            })
        } else {
            gameState.playerArray.forEach((player) => {
                if (player.playerName !== finalBid.player) {
                    if (player.bids.length >= 1 && increase > 0.6) {
                        player.currentRoll.probabilityIndex[finalBid.value] += 0.6;
                    } else {
                        player.currentRoll.probabilityIndex[finalBid.value] += increase;
                    }
                }
            })
        }
        gameState.currentBid = finalBid;
        this.bids.push(finalBid);
    }
    makeBid(currentBid) {
        const currentBehavior = getWeightedBehavior(this.playerAttributes.makeBid);
        const currentTendency = getWeightedBehavior(this.playerAttributes.tendency);
        let finalBid;
        if (currentBid) {
            const possibleBids = this.generateLegalNextBids(currentBid);
            const chosenBids = this.chooseBidByBehavior(currentBehavior, possibleBids);
            if (chosenBids === 'fluff') {
                this.fluff(currentBid);
                return;
            } else {
                finalBid = this.refineNextBidByTendency(currentTendency, chosenBids);
                
            }
        } else {
            const possibleBids = this.generatePossibleFirstBids();
            const chosenBids = this.chooseBidByBehavior(currentBehavior, possibleBids);
            finalBid = this.refineFirstBidByTendency(currentTendency, chosenBids, currentBehavior);
            if ((gameState.totalDiceValues.totalDice < 18) && (this.calculateRiskFactor(finalBid) < 0)) {
                this.makeBid(currentBid)
                return;
            }
        }
        let biddingRisk;
        if (gameState.currentBid && this.currentRoll.diceValues[gameState.currentBid.value] >=2 || gameState.totalDiceValues.totalDice <= 8) {
            biddingRisk = -1;
        } else {
            biddingRisk = -0.75;
        }
        if (this.calculateRiskFactor(finalBid) <= biddingRisk) {
                    this.makeBid(currentBid)
                    return;
                }
        if (finalBid.number > gameState.totalDiceValues.totalDice || finalBid.number < 1) {
            finalBid.number = 1;
        }
        finalBid.type = currentBehavior;
        console.log('bidding risk' + this.calculateRiskFactor(finalBid));
        this.updateGameWithNewBid(finalBid);
    }
    updatePlayerAttributes(success, currentBid) {
        const playerFluffed = gameState.playerArray.find((player) => player.playerName === currentBid.player);
        if (success) {
            if (this.playerName !== 'mainPlayer') {
                this.playerAttributes.evaluateBid.find((trait) => trait.value === 'strong fluffer').weight += 1;
                this.playerAttributes.evaluateBid.find((trait) => trait.value === 'weak fluffer').weight -= 1;
            }
            if (playerFluffed.playerName !== 'mainPlayer') {
                playerFluffed.playerAttributes.tendency.find((trait) => trait.value === 'conservative').weight += 1;
                playerFluffed.playerAttributes.tendency.find((trait) => trait.value === 'risky').weight -= 1;
                if (currentBid.type === 'bluffer') {
                    playerFluffed.playerAttributes.makeBid.find((trait) => trait.value === 'bluffer').weight -= 1;
                    playerFluffed.playerAttributes.makeBid.find((trait) => trait.value === 'regular bidder').weight += 1;
                }
            }
            
        } else {
            if (this.playerName !== 'mainPlayer') {
                this.playerAttributes.evaluateBid.find((trait) => trait.value === 'strong fluffer').weight -= 1;
                this.playerAttributes.evaluateBid.find((trait) => trait.value === 'weak fluffer').weight += 1;
            }
            if (playerFluffed.playerName !== 'mainPlayer') {
                playerFluffed.playerAttributes.tendency.find((trait) => trait.value === 'conservative').weight -= 1;
                playerFluffed.playerAttributes.tendency.find((trait) => trait.value === 'risky').weight += 1;
                if (currentBid.type === 'bluffer') {
                    playerFluffed.playerAttributes.makeBid.find((trait) => trait.value === 'bluffer').weight += 1;
                    playerFluffed.playerAttributes.makeBid.find((trait) => trait.value === 'regular bidder').weight -= 1;
                }
            }            
        }
    }
    async fluff(currentBid) {
        gameState.fluffing = true;
        gameState.disableButtons?.(['fluff', 'bid']);
        let playerLosing;
        let success;
        let diceLost;
        console.log('total of dice fluffed' + JSON.stringify(gameState.totalDiceValues[currentBid.value] + gameState.totalDiceValues.wild));
        if ((gameState.totalDiceValues[currentBid.value] + gameState.totalDiceValues.wild) >= currentBid.number) {
            playerLosing = this;
            success = false;
        } else {
            playerLosing = gameState.playerArray.find((player) => player.playerName === currentBid.player);
            success = true;
        }
        this.updatePlayerAttributes(success, currentBid);
        if (playerLosing.playerName !== gameState.currentPlayer.playerName && playerLosing.playerName !== currentBid.player) {
            diceLost = 2;
        } else {
            diceLost = 1;
        }
        await gameState.onFluffing?.(this, playerLosing, success, diceLost);
        playerLosing.loseDie(diceLost);
        if (playerLosing.numOfDice <= 0) {
            gameState.currentPlayerIndex = gameState.playerArray.findIndex((player) => player.playerName === playerLosing.playerName);
            if (gameState.playerArray[gameState.playerArray.length -1] === gameState.playerArray[gameState.currentPlayerIndex]) {
                gameState.currentPlayerIndex = 0;
            }
            gameState.playerArray = gameState.playerArray.filter((player) => player.playerName !== playerLosing.playerName);
            gameState.onEliminated?.(playerLosing);      
        } else {
            gameState.currentPlayerIndex = gameState.playerArray.findIndex((player) => player.playerName === playerLosing.playerName);
        }
        gameState.enableButtons?.(['next']);     
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
    playerArray: [],
    fluffing: false,
    fluffData: {
        playerLosing: null,
        diceLost: 0
    },
    isAutoScrolling: false,
    mode: 'determineFirstPlayer',
    currentPlayerIndex: 0,
    get currentPlayer() {
        return this.playerArray[this.currentPlayerIndex];
    },
    resetDiceValues() {
        for (const key of Object.keys(this.totalDiceValues).slice(1)) {
            this.totalDiceValues[key] = 0;
        }

    },
    initiatePlayerObjects(players) {
        players.forEach((player) => {
            if (player) {
                this.playerArray.push(new Player(player, `[data-player="${player}"] i`, playerProfiles[player]))
            }
        });
        this.totalDiceValues.totalDice = this.playerArray.length === 4 ? 20 : 15;
    },
    rollDice(players) {
        players.forEach((player) => {
            player.currentRoll = new DiceRoll(player.numOfDice);
        });
    },
    determineMostWilds(players) {
        const numberOfWilds = players.map((player) => player.currentRoll.diceValues.wild);
        const maxWild = Math.max(...numberOfWilds);
        const playersWithMostWilds = players.filter((player) => player.currentRoll.diceValues.wild === maxWild);
        return playersWithMostWilds;
    },
    async determineFirstPlayer() {
        this.disableButtons?.(['roll']);
        this.rollDice(this.playerArray);
        await this.onInitialRoll?.(this.playerArray);
        let playersWithMostWilds = this.determineMostWilds(this.playerArray);
        while (playersWithMostWilds.length > 1) {
            const playersToReroll = playersWithMostWilds;
            await this.onBeforeReroll?.(playersToReroll)
            this.rollDice(playersToReroll);
            playersWithMostWilds = this.determineMostWilds(playersToReroll);
            const playersEliminated = playersToReroll.filter((player) => !playersWithMostWilds.includes(player));
            await this.onAfterReroll?.(playersToReroll, playersEliminated);
        }
        await this.onWinner?.(playersWithMostWilds[0]);
        this.currentPlayerIndex = this.playerArray.findIndex((player) => player.playerName === playersWithMostWilds[0].playerName);
        this.mode = 'beginGame';
        this.enableButtons?.(['roll']);
    },
    async continueRound() {
        while (!this.fluffing && this.currentPlayer.playerName !== 'mainPlayer') {
            await this.beforeBidding?.(this.currentPlayer)
            if (!this.fluffing) {
                this.disableButtons?.(['fluff'])
                this.currentPlayer.evaluateBid(this.currentBid);
            }
            if (!this.fluffing) {
                await this.afterBidding?.(this.currentPlayer);
                this.currentPlayerIndex = getNextIndex(this.currentPlayerIndex, this.playerArray);
                this.enableButtons?.(['fluff']);
                this.fluffOutofTurn(this.currentBid);
            }       
        }
        if (!this.fluffing) {
            this.currentBid ? this.enableButtons?.(['fluff', 'bid']) : this.enableButtons?.(['bid']);
            await this.beforeMainPlayerBid?.(this.currentPlayer);
        }  
    },
    async beginNewRound() {
        this.disableButtons?.(['next']);
        this.fluffing = false;
        this.currentBid = null;
        this.resetDiceValues();
        this.playerArray.forEach((player) => {
            player.bids = [];
        })
        this.onNewRound?.(this.fluffData.playerLosing, this.fluffData.diceLost);
        this.rollDice(this.playerArray);
        await this.onReroll?.(this.playerArray);
        await this.continueRound();
    },
    async beginGame() {
        this.resetDiceValues();
        this.beginGameUI?.();
        this.rollDice(this.playerArray);
        this.attachObserver?.(this.currentBid);

        await this.onReroll?.(this.playerArray);
        await this.continueRound();
    },
    async mainplayerBid(bid) {
        this.disableButtons?.(['fluff', 'bid']);
        this.currentPlayer.updateGameWithNewBid(bid);
        await this.afterBidding?.(this.currentPlayer);
        this.currentPlayerIndex = getNextIndex(this.currentPlayerIndex, this.playerArray);
        this.fluffOutofTurn(this.currentBid);
        await this.continueRound()
    },
    async mainPlayerFluff(currentBid) {
        await this.playerArray.find((player) => player.playerName === 'mainPlayer').fluff(currentBid);
    },
    async waitToFluff(player) {
        const randomTime = (getRandomNumber(13) + 1) * 500;
        await sleep(randomTime);
        return player;
    },
    async fluffOutofTurn(finalBid) {
        const playersToFluff = [];
        for (const player of this.playerArray) {
            if (player.playerName !== 'mainPlayer' && player.playerName !== finalBid.player && player.playerName !== this.playerArray[getNextIndex(this.playerArray.findIndex((player) => player.playerName === finalBid.player), this.playerArray)].playerName) {
                const currentBehavior = getWeightedBehavior(player.playerAttributes.evaluateBid);
                if (player.calculateRiskFactor(finalBid) <= -2) {
                    console.log(player.calculateRiskFactor(finalBid))
                    playersToFluff.push(player);
                } else if (player.calculateRiskFactor(finalBid) <= -1.25 && currentBehavior === 'strong fluffer') {
                    if (player.currentRoll.diceValues[finalBid.value] / finalBid.number <= 0.15) {
                        console.log(player.calculateRiskFactor(finalBid))
                        playersToFluff.push(player);
                    }
                }
            }
        }
        if (!playersToFluff.length) return
        Promise.race(playersToFluff.map((player) => this.waitToFluff(player))).then((player) => {
            if (!this.fluffing) {
                player.fluff(this.currentBid)
            }
        });

    } 
    
}

export {DiceRoll, Player, gameState}