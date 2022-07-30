<template>
<div>
  <h1>Poker Game Tester</h1>
  <!--<img alt="Vue logo" src="./assets/poker.webp"> -->

  <h2>GameState</h2>

  <h3> Players :</h3>
  <div id="playerBox">
  <div v-for="player in allPlayers" :key="player" id="playerList" :data-status="player.hasFolded" :curr-player="isCurrPlayer(player)" style="display: inline-block; margin:3%">
    <img alt="Icon" src="./assets/person-outline.svg" width="40px" class="userIcon">
    <h2 id="playerName">{{player.name}}</h2>
    <h2 id="playerAmt">${{player.amt}}</h2>
    <div v-for="card in player.cards" :key="card" id="playerCards" style="display: inline-block">
      <vue-playing-card :signature="getCard(card)" width="100"></vue-playing-card>
    </div>
  </div>
  </div>

  <h3> Cards</h3>
  <div id="cardsOnBoard">
    <div v-for="card in cardsOnBoard" :key="card" style="display: inline-block; margin:1%">
      <vue-playing-card :signature="getCard(card)" width="150"></vue-playing-card>
    </div>
  </div>
  
  <h3> Blinds : {{ minBlind/2 }}/{{ minBlind }} </h3>
  <h3> Pot : {{ potAmt }} </h3>
  <h3> Called Amount : {{ calledAmt }} </h3>
  

  <h2>Functions</h2>
  <button v-on:click="getGameState">Get GameState</button><br>
  <input type="text" id="pname" name="pname">
  <button v-on:click="addPlayer">Add Player</button><br>
  <input type="text" id="rname" name="rname">
  <button v-on:click="removePlayer">Remove Player</button><br>
  <button v-on:click="beginRound">Begin Round</button><br>
  
  <button v-on:click="call" id="call"> {{callOrCheck()}} </button>
  <button v-on:click="raise" id="raise"> Raise </button>
  <input type="text" id="raiseamt" name="raiseamt">
  <button v-on:click="fold" id="fold"> Fold </button><br>

  <button v-on:click="endRound">End Round</button><br>
  <button v-on:click="endGame">End Game</button>
</div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'App',
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
    potAmt : 0
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
    async getGameState () {
      let vm = this;
      axios.get('http://localhost:3000/gamestate')
      .then(function (response) {
       // handle success
        console.log(response.data);
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt} = response.data);
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
      axios.get(`http://localhost:3000/addPlayer?name=${document.getElementById('pname').value}&amt=1000`)
      .then(function (response) {
        //handle success
        console.log(response.data);
        document.getElementById('pname').value = '';
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt} = response.data);
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
      axios.get(`http://localhost:3000/removePlayer?name=${document.getElementById('rname').value}`)
      .then(function (response) {
        //handle success
        console.log(response.data);
        document.getElementById('pname').value = '';
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt} = response.data);
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
      axios.get(`http://localhost:3000/beginRound`)
      .then(function (response) {
        //handle success
        console.log(response.data);
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt} = response.data);
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
      axios.get(`http://localhost:3000/gameaction?action=call`)
      .then(function (response) {
        //handle success
        console.log(response.data);
        //console.log(`${vm.allPlayers.at(vm.currPlayer).amt}`);
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt} = response.data);
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
      axios.get(`http://localhost:3000/gameaction?playerpos=${vm.currPlayer}&action=raise&amt=${document.getElementById('raiseamt').value}`)
      .then(function (response) {
        //handle success
        console.log(response.data);
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt} = response.data);
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
      axios.get(`http://localhost:3000/gameaction?playerpos=${vm.currPlayer}&action=fold`)
      .then(function (response) {
        //handle success
        console.log(response.data);
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt} = response.data);
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
      axios.get('http://localhost:3000/endRound')
      .then(function (response) {
        //handle success
        console.log(response.data);
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt} = response.data);
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
      axios.get(`http://localhost:3000/endGame`)
      .then(function (response) {
        //handle success
        console.log(response.data);
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, currRound: vm.currRound, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, winnerPos: vm.winnerPos, potAmt: vm.potAmt} = response.data);
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

#playerBox {
  background-image: url("./assets/felt_table.jpg");
  padding: 10px;
  border-radius: 25px;
}

#playerList {
  padding: 20px;
  border-style: none;
  border-radius: 25px;
}

#playerList[data-status="true"] {
  background-color: #1ea1a1;
  border-color: #008080;
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
  background-color: #90EE90;
  border-color: #559900;
}

#raise {
  background-color: #aa0000;
  border-color: #880000;
}

#fold {
  background-color: #008080;
  border-color: #007a7a;
}

.userIcon {
  background-color:#1ea1a1;
  border-radius: 100px;
}
</style>
