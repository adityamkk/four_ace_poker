'use strict'

const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

/*
// CLASS DEFINITIONS
*/

//Game Class
class Game {
    constructor(code) {
        this.allPlayers = []; //Array of all players in the game
        this.dealerPos = 0; //Position of the dealer in allPlayers
        this.currPlayer = 0; //Position of the current player in allPlayers
        this.currRound = 0; //The round number (preflop, flop, turn, river)
        this.cardsOnBoard = []; //Array of cards located on the board
        this.minBlind = 2; //Current minimum blind amount
        this.calledAmt = 2; //This is the AMOUNT deposited in the pot in the last raise
        this.lastRaise = 2; //This is the POSITION of the player that made the last raise
        this.winnerPos = 0; //Position of the winner of the previous round
        this.potAmt = 0; //Amount in the pot
        this.gameDeck = new Deck(); //Deck of Cards used in game
        this.message = '';
        this.code = code;
    }

    addPlayer (url) {
        this.allPlayers.push(new Player(url.searchParams.get('name'), (url.searchParams.get('amt') != null) ? parseInt(url.searchParams.get('amt')) : 1000));
        console.log(`Player \"${url.searchParams.get('name')}\" added to allPlayers.`);
        return url.searchParams.get('name');
    }

    //Removes a player from the game, based on their name
    removePlayer (url) {
        const remName = url.searchParams.get('name');
        for(var i = 0; i < this.allPlayers.length; i++) {
            if(remName === this.allPlayers[i].name) {
                this.allPlayers.splice(i,1);
                console.log(`Player \"${remName}\" removed from allPlayers.`);
                i = this.allPlayers.length;
            }
        }
    }

    //Begins a round
    beginRound () {
        this.gameDeck.shuffle();
        // TESTING CASES
        //this.cardsOnBoard = [new Card('A','H'), new Card('5','D'), new Card('4','C'), new Card('2','S'), new Card('3','H')];
        //
        //small blind
        console.log(smallBlindPos(this.code));
        updateAmt(this.allPlayers[smallBlindPos(this.code)], ~~(this.minBlind/2)*(-1));
        this.allPlayers[smallBlindPos(this.code)].currPaidAmt = 1;
        updatePot(~~(this.minBlind/2),this.code);
        //big blind
        updateAmt(this.allPlayers[bigBlindPos(this.code)], this.minBlind*(-1));
        this.allPlayers[bigBlindPos(this.code)].currPaidAmt = 2;
        updatePot(this.minBlind,this.code);
        //deal cards
        for(var i = 0; i < this.allPlayers.length; i++) {
            this.gameDeck.deal(this.allPlayers[i],2);
        }
        this.currPlayer = recalPos(bigBlindPos(this.code)+1,this.code);
        this.lastRaise = bigBlindPos(this.code);

        console.log(`Round has started, ${this.allPlayers.at(this.currPlayer).name} is starting`);
    }

    //Has the current player do a specific action
    gameAction (url) {
        const action = url.searchParams.get('action');
        const player = this.allPlayers.at(this.currPlayer);
        console.log(`${action} is used by the player \"${player.name}\"`);
        switch(action) {
            case 'call' :
                call(player,this.code);
                break;
            case 'raise' :
                raise(player, parseInt(url.searchParams.get('amt')),this.code);
                break;
            case 'fold' :
                fold(player,this.code);
                break;
            default:
                console.log(`Invalid Action ${action}`);
        }
        updateRoundStatus(this.code);
        checkFoldConditions(this.code);
    }

    //Ends a round and prepares for the next round
    endRound () {
        findWinner(this.code);
        for(var i = 0; i < this.allPlayers.length; i++) {
            this.allPlayers[i].cards = [];
        }
        this.gameDeck = new Deck();
        this.allPlayers.at(this.winnerPos).amt += this.potAmt;
        this.potAmt = 0;
        this.cardsOnBoard = [];
        this.calledAmt = 2;
        this.currRound = 0;
        rotateDealerPos(this.code);
        resetFoldStatus(this.code);
        console.log('Round Has Ended, Next Round Starting');
        console.log('---------------------------------------------------------------------------------\n');
    }

    //Ends the entire game
    endGame () {
        this.allPlayers = [];
        this.dealerPos = 0;
        this.currPlayer = 0;
        this.cardsOnBoard = [];
        this.potAmt = 0;
        this.calledAmt = 2;
        this.currRound = 0;
        this.gameDeck = new Deck();
        console.log('Game Has Ended');
    }

}

//Player Class
class Player {

    static counter = 0;
    //Defines a player's name, amount owned, amount paid, cards, and whether they have folded or not.
    constructor(name, amt) {
        this.name = name;
        this.id = Player.counter;
        Player.counter++;
        this.amt = amt;
        this.currPaidAmt = -1;
        this.cards = [];
        this.hasFolded = false;
    }

    //compares the hands of this player and that player. 
    //Returns 1 if this > that, -1 if this < that, and 0 if this = that
    compareHands(that,code) {
        const thisScore = Hands.calcScore(this,code);
        const thatScore = Hands.calcScore(that,code);
        if(arrEquals(thisScore,thatScore)) {
            if(Hands.calcRawScore(this,code) > Hands.calcRawScore(that,code)) {
                return 1;
            } else if(Hands.calcRawScore(this,code) < Hands.calcRawScore(that,code)) {
                return -1;
            } else {
                return 0;
            }
        } else {
            for(let i = 0; i < thisScore.length; i++) {
                if(thisScore.at(i) != thatScore.at(i)) {
                    if(thisScore.at(i) === false) {
                        return -1;
                    }
                    if(thatScore.at(i) === false) {
                        return 1;
                    }
                    if(thisScore.at(i) > thatScore.at(i)) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            }
        }
    }

    //Finds the type of hand this player has and returns it as a string
    handType(code) {
        const thisScore = Hands.calcScore(this,code);
        for(let i = 0; i < thisScore.length; i++) {
            if(thisScore.at(i) != false) {
                switch(i) {
                    case 0: return 'Straight Flush';
                    case 1: return 'Four of a Kind';
                    case 2: return 'Full House'; 
                    case 3: return 'Flush';
                    case 4: return 'Straight';
                    case 5: return 'Three of a Kind';
                    case 6: return 'Two Pair';
                    case 7: return 'Pair';
                }
            }
        }
        return 'High Card';
    }
}

//Card Class
class Card {

    static counter = 0;
    //Defines the card's rank and suite (string)
    constructor(rank, suite) {
        this.id = Card.counter;
        Card.counter++;
        this.rank = rank;
        this.suite = suite;
    }

    //Returns the name of the card, as a string
    displayName() {
        return (this.rank + this.suite);
    }
}

//Deck Class
class Deck {

    //Constructs the 52 Card array cardsArr
    constructor() {
        this.cardsArr = [];
        for(var i = 0; i < Hands.suites.length; i++) {
            for(var j = 0; j < Hands.ranks.length; j++) {
                this.cardsArr.push(new Card(Hands.ranks[j],Hands.suites[i]));
            }
        }
    }

    //Deals cards to a specific player
    deal(player, numCards) {
        for(var i = 0; i < numCards; i++) {
            player.cards.push(this.cardsArr.shift());
        }
    }

    //Shuffles the entire deck randomly
    shuffle() {
        var ctr = this.cardsArr.length, temp, index;

        // While there are elements in the array
        while (ctr > 0) {
            // Pick a random index
            index = Math.floor(Math.random() * ctr);
            // Decrease ctr by 1
            ctr--;
            // And swap the last element with it
            temp = this.cardsArr[ctr];
            this.cardsArr[ctr] = this.cardsArr[index];
            this.cardsArr[index] = temp;
        }
    }
}

/*
// GLOBAL FUNCTIONS
*/

//Checks if the contents of 2 arrays are equal
//Returns true if the contents are equal, false otherwise
function arrEquals(arr1, arr2) {
    if(arr1.length != arr2.length) {
        return false;
    }
    for(let i = 0; i < arr1.length; i++) {
        if(arr1[i] != arr2[i]) {
            return false;
        }
    }
    return true;
}

//Creates and returns a deep copy of the array passed in to the function
function copyArr(arr) {
    let newArr = [];
    arr.forEach(function(entry) {
        newArr.push(entry); 
    });
    return newArr;
}

//Finds and returns the correct position of the position argument passed in
//If the position argument is greater than the length of the allPlayers array, loops the position to the beginning
function recalPos(pos,code) {
    //console.log(`recalPos: ${pos}%${findGame(code).allPlayers.length}=`+(pos)%(findGame(code).allPlayers.length));
    return (pos)%(findGame(code).allPlayers.length);
}

//Rotates the position of the dealer
function rotateDealerPos(code) {
    findGame(code).dealerPos = recalPos(findGame(code).dealerPos+1,code);
}

//Rotates the current player's position
function rotateCurrPos(code) {
    findGame(code).currPlayer = recalPos(findGame(code).currPlayer+1,code);
    while(findGame(code).allPlayers.at(findGame(code).currPlayer).hasFolded === true) {
        findGame(code).currPlayer = recalPos(findGame(code).currPlayer+1,code);
    }
    return findGame(code).currPlayer;
}

//Makes all players immediately unfold
function resetFoldStatus(code) {
    for(var i = 0; i < findGame(code).allPlayers.length; i++) {
        findGame(code).allPlayers[i].hasFolded = false;
        findGame(code).allPlayers[i].currPaidAmt = -1;
    }
}

//Updates the amount a player has
function updateAmt(player, amount) {
    player.amt += amount;
    return player;
}

//Adds a card to the table from the findGame().gameDeck
function showCard(code) {
    findGame(code).cardsOnBoard.push(findGame(code).gameDeck.cardsArr.shift());
}

//Finds and returns the position of the small blind
function smallBlindPos(code) {
    return recalPos(findGame(code).dealerPos+1,code);
}

//Finds and returns the position of the big blind
function bigBlindPos(code) {
    return recalPos(findGame(code).dealerPos+2,code);
}

//Updates the amount in the pot
function updatePot(amt,code) {
    findGame(code).potAmt += amt;
}

//On their turn, has the player do the "call" action, which makes them pay the same amount as the current paid amount
function call(player,code) {
    console.log(`${player.name} called $${findGame(code).calledAmt}`);
    if(player.currPaidAmt === -1) {player.currPaidAmt = 0;}
    if(findGame(code).calledAmt <= player.amt) {
        updateAmt(player, (-1)*findGame(code).calledAmt + player.currPaidAmt);
        updatePot(findGame(code).calledAmt - player.currPaidAmt,code);
        console.log(`updated amount: $${findGame(code).calledAmt - player.currPaidAmt}`);
        player.currPaidAmt = findGame(code).calledAmt;
        rotateCurrPos(code);
        return findGame(code).calledAmt;
    } else {
        return -1;
    }
}

//On their turn, has the player do the "raise" action, which makes them pay a certain specified amount, as long as it is greater than the standard
function raise(player, amt,code) {
    console.log(`${player.name} raised $${amt}`);
    if(amt > findGame(code).calledAmt && amt <= player.amt) {
        findGame(code).calledAmt = amt;
        updateAmt(player, (-1)*amt);
        updatePot(amt , code);
        console.log(`updated amount: $${amt}`);
        player.currPaidAmt = findGame(code).calledAmt;
        rotateCurrPos(code);
        return amt;
    } else {
        return -1;
    }
}

//On their turn, has the player do the "fold" action, which sets their fold status to true
//Their turn is skipped for remaining plays
function fold(player,code) {
    player.hasFolded = true;
    rotateCurrPos(code);
    checkFoldConditions(code);
}

//Updates the round status and checks if bets have been equalized
function updateRoundStatus(code) {
    //console.log('ROUND STATUS');
    let areEqualized = true;
    let q = {};
    for(const p of findGame(code).allPlayers) {
        if(!p.hasFolded) {q = p;}
    }
    for(const p of findGame(code).allPlayers) {
        //console.log( `default value:  ${q.currPaidAmt} , currPaidAmt:  ${p.currPaidAmt}`);
        if(!p.hasFolded && (p.currPaidAmt < 0 || q.currPaidAmt != p.currPaidAmt)) {
            areEqualized = false;
        }
    }
    if(areEqualized) {
        startNewRound(code);
    }
    console.log('---------------------');
}

//Prepares for the start of a new round, recalibrates current player, and updates the type of round
function startNewRound(code) {
    findGame(code).currPlayer = recalPos(bigBlindPos(code),code);
    rotateCurrPos(code);
    //console.log(`Current Position: ${findGame().currPlayer}`);
    findGame(code).calledAmt = 0; findGame(code).lastRaise = 0;
    for(const p of findGame(code).allPlayers) {
        p.currPaidAmt = -1;
    }
    findGame(code).currRound++;
    //console.log(`Current Round: ${findGame().currRound}`)
    switch(findGame(code).currRound) {
        case 1: for(let i = 0; i < 3; i++) {showCard(code);}
                console.log(`3 cards shown (flop)`);
                findGame(code).message = '';
                break;
        case 2: showCard(code);
                console.log(`1 card shown (turn)`);
                break;
        case 3: showCard(code);
                console.log(`1 card shown (river)`);
                break;
        case 4: findGame(code).currRound = 0;
                console.log(`Last round over, time for the showdown!`);
                findGame(code).endRound();
                findGame(code).beginRound();
    }
}

//Check if there is exactly one player left to play
//If so, automatically make them the winner and start the next round
function checkFoldConditions(code) {
    let countRemPlayers = findGame(code).allPlayers.length;
    for(const p of findGame(code).allPlayers) {
        if(p.hasFolded === true) {countRemPlayers--;}
    }
    if(countRemPlayers === 1) {
        for(let i = 0; i < findGame(code).allPlayers.length; i++) {
            if(findGame(code).allPlayers[i].hasFolded === false) {
                findGame(code).winnerPos = i;
                console.log(`Everyone except ${findGame(code).allPlayers.at(findGame(code).winnerPos).name} folded!`);
                findGame(code).endRound();
                findGame(code).beginRound();
                i = findGame(code).allPlayers.length + 1;
            }
        }

    }
}

//Finds the player with the strongest hand, and declares them the winner
function findWinner(code) {
    let highPos = 0;
    let players = copyArr(findGame(code).allPlayers);
    for(let i = 0; i < players.length; i++) {
        highPos = i;
        for(let j = i+1; j < players.length; j++) {
            if(players.at(highPos).compareHands(players.at(j),code) < 0) {
                highPos = j;
            }
        }
        [players[highPos],players[i]] = [players[i],players[highPos]];
    }
    let foundWinner = false;
    players.forEach(function(player,i) {
        if(!player.hasFolded && !foundWinner) {
            foundWinner = true;
            findGame(code).winnerPos = i;
            declareWinner(player,code);
            return player;
        }
    });
}

//Gives the entire amount in the pot to the winning player
function declareWinner(player,code) {
    console.log(`${player.name} won the round with a ${player.handType(code)}!`);
    findGame(code).message = `${player.name} won the round with a ${player.handType(code)}!`;
    updateAmt(player, (findGame(code).potAmt));
    findGame(code).allPlayers.forEach(function(player) {
        player.currPaidAmt = -1;
    });
    findGame(code).potAmt = 0;
}

/*
// GLOBAL OBJECTS
*/

//Hands Object
const Hands = {

    //Array of all the ranks and suites for a card
    ranks : ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    suites : ['H','D','C','S'],

    //Method that converts from a rank to a corresponding numerical value
    rankToNum : function (rank) {
        switch (rank) {
            case '2' : return 0;
            case '3' : return 1;
            case '4' : return 2;
            case '5' : return 3;
            case '6' : return 4;
            case '7' : return 5;
            case '8' : return 6;
            case '9' : return 7;
            case '10' : return 8;
            case 'J' : return 9;
            case 'Q' : return 10;
            case 'K' : return 11;
            case 'A' : return 12;
            default : return -1;
        }
    },

    //Sorts an array of cards from least to greatest
    sortByRank : function (cards) {
        let smallest = 0;
        for(let i = 0; i < cards.length; i++) {
            smallest = i;
            for(let j = i+1; j < cards.length; j++) {
                if(this.rankToNum(cards[j].rank) < this.rankToNum(cards[smallest].rank)) {
                    smallest = j;
                }
            }
            [cards[i], cards[smallest]] = [cards[smallest], cards[i]];
        }
        return cards;
    },

    //Removes duplicate ranks from an array of cards
    removeDuplRanks : function (cards) {
        let sortedCards = copyArr(this.sortByRank(cards));
        for(let i = 1; i < sortedCards.length; i++) {
            if(this.rankToNum(sortedCards[i].rank) === this.rankToNum(sortedCards[i-1].rank)) {
                sortedCards.splice(i,i+1);
                i--;
            }
        }
        return this.sortByRank(sortedCards);
    },

    //Groups all cards passed in into a 2 dimensional array of cards, grouped by suite
    groupBySuite : function (cards) {
        let arrCards = [[],[],[],[]];
        for(const c of cards) {
            switch(c.suite) {
                case 'H': arrCards[0].push(c); break;
                case 'D': arrCards[1].push(c); break;
                case 'C': arrCards[2].push(c); break;
                case 'S': arrCards[3].push(c);
            }
        }
        for(let i = 0; i < arrCards.length; i++) {
            arrCards[i] = this.sortByRank(arrCards[i]);
        }
        return arrCards;
    },

    //Checks if a player has a Straight Flush, returns the value of the highest card in the straight if true
    isStraightFlush : function (player,code) {
        const allCards = this.groupBySuite(findGame(code).cardsOnBoard.concat(player.cards));
        for(let i = 0; i < allCards.length; i++) {
            if(allCards.at(i).length >= 5) {
                for(let j = 0; j < allCards.at(i).length; j++) {
                    try {
                        const f = this.rankToNum(allCards.at(i)[j].rank);
                        if(arrEquals([f+1,f+2,f+3,f+4],[this.rankToNum(allCards.at(i)[j+1].rank),this.rankToNum(allCards.at(i)[j+2].rank),this.rankToNum(allCards.at(i)[j+3].rank),this.rankToNum(allCards.at(i)[j+4].rank)])) {
                            return f+4;
                        }
                    } catch (error) {
                        if(this.rankToNum(allCards.at(i).at(0).rank) === 0 && this.rankToNum(allCards.at(i).at(-1).rank) === 12) {
                            const f = -1;
                            if(arrEquals([f+1,f+2,f+3,f+4],[this.rankToNum(allCards.at(i)[0].rank),this.rankToNum(allCards.at(i)[1].rank),this.rankToNum(allCards.at(i)[2].rank),this.rankToNum(allCards.at(i)[3].rank)])) {
                                return f+4;
                            }
                        }
                        j = allCards.at(i).length;
                    }
                }
            }
        }
        return false;
    },

    //Checks if a player has a Flush, returns true if it exists, false if not
    isFlush : function (player,code) {
        let suiteCounts = [0,0,0,0];
        const allCards = findGame(code).cardsOnBoard.concat(player.cards);
        for(let c of allCards) {
            switch(c.suite) {
                case 'H' : suiteCounts[0]++; break;
                case 'D' : suiteCounts[1]++; break;
                case 'C' : suiteCounts[2]++; break;
                case 'S' : suiteCounts[3]++;
            }
        }
        for(let i of suiteCounts) {
            if(i >= 5) {
                return true;
            }
        }
        return false;
    },

    //Checks if a player has a Straight, returns the value of the highest card in the Straight if there
    isStraight : function (player,code) {
        const allCards = this.removeDuplRanks(findGame(code).cardsOnBoard.concat(player.cards));
        //console.log(allCards);
        for(let i = 0; i < allCards.length; i++) {
            try {
                const f = this.rankToNum(allCards[i].rank);
                if(arrEquals([f+1,f+2,f+3,f+4],[this.rankToNum(allCards[i+1].rank),this.rankToNum(allCards[i+2].rank),this.rankToNum(allCards[i+3].rank),this.rankToNum(allCards[i+4].rank)])) {
                    return f+4;
                }
            } catch (error) {
                if(this.rankToNum(allCards.at(0).rank) === 0 && this.rankToNum(allCards.at(-1).rank) === 12) {
                    const f = -1;
                    if(arrEquals([f+1,f+2,f+3,f+4],[this.rankToNum(allCards[0].rank),this.rankToNum(allCards[1].rank),this.rankToNum(allCards[2].rank),this.rankToNum(allCards[3].rank)])) {
                        return f+4;
                    }
                }
                return false;
            }
        }
        return false;
    },

    //Checks if a player has a 4 of a kind, returns the value of the rank if there
    is4s : function (player,code) {
        const allCards = this.sortByRank(findGame(code).cardsOnBoard.concat(player.cards));
        let countRanks = [0,0,0,0,0,0,0,0,0,0,0,0,0];
        let num4s = 0;
        let fourPos = -1;
        for(let c of allCards) {
            countRanks[this.rankToNum(c.rank)]++;
        }
        countRanks.forEach(function(numCards,i) {
            if(numCards === 4) {
                num4s++;
                fourPos = i;
            }
        });
        if(num4s > 0) {
            return fourPos;
        }
        return false;
    },

    //Checks if a player has a Full House, returns a numerical value representative of the strength of the full house
    isFullHouse : function (player,code) {
        const allCards = this.sortByRank(findGame(code).cardsOnBoard.concat(player.cards));
        let countRanks = [0,0,0,0,0,0,0,0,0,0,0,0,0];
        let num3s = 0; 
        let threePos = -1;
        let num2s = 0;
        let twoPos = -1;
        for(let c of allCards) {
            countRanks[this.rankToNum(c.rank)]++;
        }
        countRanks.forEach(function(numCards, i) {
            if(numCards >= 3) {
                num3s++;
                threePos = i;
            }
            if(numCards === 2) {
                num2s++;
                twoPos = i;
            }
        });
        if(num3s >= 1 && num2s >= 1) {
            return 13*threePos + twoPos;
        }
        return false;
    },

    //Checks if a player has a 3 of a kind, returns the value of its rank if there
    is3s : function (player,code) {
        const allCards = this.sortByRank(findGame(code).cardsOnBoard.concat(player.cards));
        let countRanks = [0,0,0,0,0,0,0,0,0,0,0,0,0];
        let num3s = 0;
        let threePos = -1;
        for(let c of allCards) {
            countRanks[this.rankToNum(c.rank)]++;
        }
        countRanks.forEach(function(numCards,i) {
            if(numCards >= 3) {
                num3s++;
                threePos = i;
            }
        });
        if(num3s > 0) {
            return threePos;
        }
        return false;
    },

    //Checks if a player has a 2 pair, returns the value of the rank of the higher pair, if there
    is22s : function (player,code) {
        const allCards = this.sortByRank(findGame(code).cardsOnBoard.concat(player.cards));
        let countRanks = [0,0,0,0,0,0,0,0,0,0,0,0,0];
        let num2s = 0;
        let twoPos = -1;
        for(let c of allCards) {
            countRanks[this.rankToNum(c.rank)]++;
        } 
        countRanks.forEach(function(numCards, i) {
            if(numCards >= 2) {
                num2s++;
                twoPos = i;
            }
        });
        if(num2s >= 2) {
            return twoPos;
        }
        return false;
    },

    //Checks if a player has a pair, returns the value of the rank of the pair, if there
    is2s : function (player,code) {
        const allCards = this.sortByRank(findGame(code).cardsOnBoard.concat(player.cards));
        let countRanks = [0,0,0,0,0,0,0,0,0,0,0,0,0];
        let num2s = 0;
        let twoPos = -1;
        for(let c of allCards) {
            countRanks[this.rankToNum(c.rank)]++;
        } 
        countRanks.forEach(function(numCards, i) {
            if(numCards >= 2) {
                num2s++;
                twoPos = i;
            }
        });
        if(num2s === 1) {
            return twoPos;
        }
        return false;
    },

    //Returns an array of the results from all the functions above for a specific player
    calcScore : function (player,code) {
        //const allCards = this.sortByRank(findGame().cardsOnBoard.concat(player.cards));
        let scoreArr = [this.isStraightFlush(player,code),this.is4s(player,code),this.isFullHouse(player,code),this.isFlush(player,code),this.isStraight(player,code),this.is3s(player,code),this.is22s(player,code),this.is2s(player,code)];
        return scoreArr;
    },

    //Returns the sum of the numerical values of all the cards in the hand
    calcRawScore : function (player,code) {
        const allCards = this.sortByRank(findGame(code).cardsOnBoard.concat(player.cards));
        let score = 0;
        for(let c of allCards) {
            score += this.rankToNum(c.rank);
        } 
        return score;
    }
}

//Map of Games
const games = new Map();
games.set(0,new Game());

//Finds and returns a specified Game from the games map, and returns the one at key 0 if not found
function findGame(reqCode) {
    try {
        if(games.get(reqCode) != undefined) {return games.get(reqCode)};
    } catch {
        return games.get(0);
    }
    return games.get(0);
}

/*
// POKER PROJECT SERVER
*/

//TODO
function newMultiGame(url) {
    const code = Math.floor(Math.random()*10000000);
    games.set(code, new Game(code));
    const name = findGame(code).addPlayer(url);
    return [code,name];
}

function getCode(req) {
    const codeStr = req.headers.cookie;
    const code = codeStr.substring(
        codeStr.indexOf("=")+1,
        codeStr.indexOf(";")
    );
    return parseInt(code);
}

function getCodeFromUrl(url) {
    const code = parseInt(url.searchParams.get('code'));
    return code;
}

//Server Response
const server = http.createServer((req, res) => {

    //Finds the url
    const url = new URL(req.url,'http://localhost:3000');

    //Different responses based on different urls
    switch(url.pathname) {

        //Creates a new multiplayer game and adds the creator to the list of players
        case '/newMultiGame' :
            const [code,name] = newMultiGame(url);
            res.setHeader('Set-Cookie',[`code=${code}; path=/`,`name=${name}; path=/`]);
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
            res.write(JSON.stringify('success:1'));  
            res.end();
            break;

        //Adds a player to the game, with a specifc name and amount
        case '/addPlayer' :
            const pname = findGame(getCodeFromUrl(url)).addPlayer(url);
            res.setHeader('Set-Cookie',[`code=${getCodeFromUrl(url)}; path=/`,`name=${pname}; path=/`]);
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.write(JSON.stringify(findGame(getCodeFromUrl(url))));  
            res.end();
            break;
        
        //Refreshes the gamestate
        case '/gamestate' :
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.write(JSON.stringify(findGame(getCode(req)))); 
            res.end();
            break;
        
        //Removes a player from the game, based on their name
        case '/removePlayer' :
            findGame(getCode(req)).removePlayer(url);
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.write(JSON.stringify(findGame(getCode(req))));  
            res.end();
            break;

        //Begins a round
        case '/beginRound' :
            findGame(getCode(req)).beginRound();
            res.writeHead(200, { 'Content-Type': 'application/json' , 'Access-Control-Allow-Origin': '*'});
            res.write(JSON.stringify(findGame(getCode(req))));  
            res.end();
            break;
        
        //Has the current player do a specific action
        case '/gameaction' :
            findGame(getCode(req)).gameAction(url);
            res.writeHead(200, { 'Content-Type': 'application/json' , 'Access-Control-Allow-Origin': '*'});
            res.write(JSON.stringify(findGame(getCode(req))));  
            res.end();
            break;
        
        //Ends a round and prepares for the next round
        case '/endRound' :
            findGame(getCode(req)).endRound();
            res.writeHead(200, { 'Content-Type': 'application/json' , 'Access-Control-Allow-Origin': '*'});
            res.write(JSON.stringify(findGame(getCode(req))));  
            res.end();
            break;
        
        //Ends the entire game
        case '/endGame' :
            findGame(getCode(req)).endGame();
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.write(JSON.stringify(findGame(getCode(req))));  
            res.end();
            break;
        
        //Refreshes gamestate
        default:  
            res.writeHead(200, { 'Content-Type': 'application/json' , 'Access-Control-Allow-Origin': '*'});
            res.write(JSON.stringify(findGame(getCode(req))));  
            res.end();
    }
});

//Server Listen
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

