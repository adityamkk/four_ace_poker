<template>
<div>

  <div id="playerBox">
    <div v-for="player in allPlayers" :key="player.id" id="playerList" :data-status="player.hasFolded" :curr-player="isCurrPlayer(player)" style="display: inline-block; margin:3%">
      <div style="display:inline-flex">
        <img alt="Icon" :src="assignIcon(player)" width="100px" height="100px" class="userIcon" :id="player.id">
        <div>
          <h2 id="playerName">{{player.name}}</h2>
          <h2 id="playerAmt">${{player.amt}}</h2>
        </div>
      </div> <br>
      <div v-for="card in player.cards" :key="card.id" id="playerCards" style="display: inline-block">
        <vue-playing-card :signature="getCard(card)" width="100"></vue-playing-card>
      </div><br>
      <button v-on:click="call" id="call"> {{callOrCheck()}} </button>
      <button v-on:click="raise" id="raise"> Raise </button>
      <input type="text" class="raiseamt" :id="player.name" name="raiseamt" size="2px">
      <button v-on:click="fold" id="fold"> Fold </button>
    </div><br>
    <div style="display:inline-block">
      <img alt="Poker Chips" src="./assets/poker_chips.png" width="170px">
      <h2 id="potAmt">${{potAmt}}</h2>
    </div><br>
    <div style="display:inline">
      <h2>Blinds: {{ minBlind/2 }}/{{ minBlind }}</h2>
      <h2>Current Bet: {{ calledAmt }}</h2>
      <h2>{{message}}</h2>
      <h2>Code : {{code}}</h2>
    </div><br>
    <div v-for="card in cardsOnBoard" :key="card.id" style="display: inline-block; margin:1%">
      <vue-playing-card :signature="getCard(card)" width="150"></vue-playing-card>
    </div>

    <h2>Developer Tools</h2>
    <div>
      <button v-on:click="getGameState" style="margin-right:50px">Get GameState</button>
      <input type="text" id="pname" name="pname">
      <button v-on:click="addPlayer" style="margin-right:50px">Add Player</button>
      <input type="text" id="rname" name="rname">
      <button v-on:click="removePlayer" style="margin-right:50px">Remove Player</button>
      <button v-on:click="beginRound">Begin Round</button>

      <button v-on:click="endRound">End Round</button>
      <button v-on:click="endGame">End Game</button>
    </div>
  </div>
</div>
</template>

<script>

import axios from 'axios';
//axios.defaults.withCredentials = true;

export default {
  name: 'poker-game',
  data: () => ({
    isLoading: false,
    isError: false,
    allPlayers : [],
    dealerPos : 0,
    currPlayer : 0,
    currRound : 0,
    cardsOnBoard : [],
    minBlind : 2,
    calledAmt : 0,
    lastRaise : 0,
    winnerPos: 0,
    potAmt : 0,
    gameDeck : {},
    message : '',
    code: -1
  }),
  methods: {
    displayCardsOnBoard (cardsOnBoard) {
      cardsOnBoard.forEach(function(card) {
        document.getElementById("cardsOnBoard").innerHTML += `<vue-playing-card signature="${card.rank}${card.suite}"></vue-playing-card>`;
      });
    },
    getCard (card) {
      const rank = (card.rank === '10') ? ('t') : (card.rank.toLowerCase());
      return '' + rank + card.suite.toLowerCase();
    },
    callOrCheck () {
      const vm = this;
      if(vm.currRound > 0 && vm.calledAmt === 0) {
        return 'Check';
      }
      return 'Call';
    },
    isCurrPlayer (player) {
      const vm = this;
      if(player == vm.allPlayers.at(vm.currPlayer)) {
        return true;
      }
      return false;
    },
    assignIcon (player) {
      const vm = this;
      for(let i = 0; i < vm.allPlayers.length; i++) {
        if(player == vm.allPlayers.at(i)) {
          return require('./assets/icon_' + i%10 + '.png');
        }
      }
    },  
    async getGameState () {
      let vm = this;
      axios.get('/gamestate')
      .then(function (response) {
       // handle success
        console.log(response.data);
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt, gameDeck: vm.gameDeck, message: vm.message, code: vm.code} = response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    },
    async addPlayer () {
      let vm = this;
      axios.get(`/addPlayer?name=${document.getElementById('pname').value}&amt=1000`)
      .then(function (response) {
        //handle success
        console.log(response.data);
        document.getElementById('pname').value = '';
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt, gameDeck: vm.gameDeck, message: vm.message, code: vm.code} = response.data);
      })
      .catch(function (error) {
        //handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      })
    },
    async removePlayer () {
      let vm = this;
      axios.get(`/removePlayer?name=${document.getElementById('rname').value}`)
      .then(function (response) {
        //handle success
        console.log(response.data);
        document.getElementById('pname').value = '';
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt, gameDeck: vm.gameDeck, message: vm.message, code: vm.code} = response.data);
      })
      .catch(function (error) {
        //handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      })
    },
    async beginRound () {
      let vm = this;
      axios.get(`/beginRound`)
      .then(function (response) {
        //handle success
        console.log(response.data);
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt, gameDeck: vm.gameDeck, message: vm.message, code: vm.code} = response.data);
      })
      .catch(function (error) {
        //handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      })
    },
    async call() {
      let vm = this;
      axios.get(`/gameaction?action=call`)
      .then(function (response) {
        //handle success
        console.log(response.data);
        //console.log(`${vm.allPlayers.at(vm.currPlayer).amt}`);
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt, gameDeck: vm.gameDeck, message: vm.message, code: vm.code} = response.data);
      })
      .catch(function (error) {
        //handle error
        console.log("Error: " + error);
      })
      .then(function () {
        // always executed
      })
    },
    async raise() {
      let vm = this;
      axios.get(`/gameaction?playerpos=${vm.currPlayer}&action=raise&amt=${document.getElementById(`${vm.allPlayers.at(vm.currPlayer).name}`).value}`)
      .then(function (response) {
        //handle success
        document.getElementsByClassName('raiseamt').innerHTML = '';
        console.log(response.data);
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt, gameDeck: vm.gameDeck, message: vm.message, code: vm.code} = response.data);
      })
      .catch(function (error) {
        //handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      })
    },
    async fold() {
      let vm = this;
      axios.get(`/gameaction?playerpos=${vm.currPlayer}&action=fold`)
      .then(function (response) {
        //handle success
        console.log(response.data);
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt, gameDeck: vm.gameDeck, message: vm.message, code: vm.code} = response.data);
      })
      .catch(function (error) {
        //handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      })
    },
    async endRound () {
      let vm = this;
      axios.get('/endRound')
      .then(function (response) {
        //handle success
        console.log(response.data);
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt, gameDeck: vm.gameDeck, message: vm.message, code: vm.code} = response.data);
      })
      .catch(function (error) {
        //handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      })
    },
    async endGame() {
      let vm = this;
      axios.get(`/endGame`)
      .then(function (response) {
        //handle success
        console.log(response.data);
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt, gameDeck: vm.gameDeck, message: vm.message, code: vm.code} = response.data);
      })
      .catch(function (error) {
        //handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      })
    }
  }
}
//Avenir, Helvetica, Arial, sans-serif
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');

#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  padding:5px;
  margin:0;
  background-image: url("./assets/felt_table.jpg");
}

button {
  font-family: 'Montserrat', sans-serif;
  padding: 10px;
  margin: 5px;
  background-color: #ff8800;
  border-style: none;
  border-radius: 25px;
  transition: 0.5s;
}

button:hover {
  background-color: #ff4400;
  transition: 0.5s;
}

button:active {
  background-color: #ff2200;
}

input {
  font-family: 'Montserrat', sans-serif;
  padding: 10px;
  margin: 5px;
  background-color: #ffcc00;
  border-style: none;
  border-radius: 25px;
  transition: 0.5s;
}

input:hover {
  background-color: #ffaa00;
  transition: 0.5s;
}

h1 {
  padding: 20px;
  margin: 15px;
  background-color: #aa0000;
  border-style: none;
  border-radius: 25px;
  transition: 0.5s;
}

h2 {
  padding: 15px;
  margin: 10px;
  color: #ffffff;
  border-style: none;
  border-radius: 25px;
  transition: 0.5s;
}

h3 {
  padding: 10px;
  margin: 5px;
  background-color: #ffcc00;
  border-style: none;
  border-radius: 25px;
  transition: 0.5s;
}

h3:hover {
  background-color: #ffaa00;
  transition: 0.5s;
}

#cardsOnBoard {
  padding: 50px;
  background-image: url("./assets/felt_table.jpg");
  border-style:double;
  border-color: #559900;
  border-radius: 25px;
}

#potAmt {
  padding-top:0px;
  padding-bottom:50px;
}

#playerBox {
  background-image: url("./assets/felt_table.jpg");
}

#playerList {
  padding: 20px;
  border-style: none;
  border-radius: 25px;
}

#playerList[data-status="true"] {
  background-color: #5DADE2;
  border-color: #5DADE2;
}

#playerList[curr-player="true"] {
  background-color:#ff8800;
  border-color: #ff4400;
}

#playerName {
  background-color:none;
  border:none;
  padding-bottom:3px;
  font-weight:300px;
}

#playerAmt {
  padding-top: 3px;
  font-weight:25;
}

#call {
  color:#ffffff;
  background-color: #48C9B0;
  border-color: #48C9B0;
  transition: 0.5s;
}

#call:hover {
  background-color: #1ABC9C;
  border-color: #1ABC9C;
  transition: 0.5s;
}

#raise {
  color:#ffffff;
  background-color: #EC7063;
  border-color: #EC7063;
  transition: 0.5s;
}

#raise:hover {
  background-color: #E74C3C;
  border-color: #E74C3C;
  transition: 0.5s;
}

.raiseamt {
  background-color: #F5B7B1;
  border-color: #F5B7B1;
  transition: 0.5s;
}

.raiseamt:hover {
  background-color: #F1948A;
  border-color: #F1948A;
  transition: 0.5s;
}

#fold {
  color:#ffffff;
  background-color: #5DADE2;
  border-color: #5DADE2;
  transition: 0.5s;
}

#fold:hover {
  background-color: #5499C7;
  border-color: #5499C7;
  transition: 0.5s;
}

.userIcon {
  border-radius: 100px;
}
</style>
