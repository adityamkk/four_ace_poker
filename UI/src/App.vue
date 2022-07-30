<template>
<div>

  <img alt="Vue logo" src="./assets/poker.webp"> 

  <h1>Poker Game Tester</h1>

  <h2>GameState</h2>

  <h3> Players :</h3>
  <div v-for="player in allPlayers" :key="player" id="playerList" style="display: inline-block; margin:3%">
    <h3>{{player.name}} (${{player.amt}})</h3>
    <div v-for="card in player.cards" :key="card" id="playerCards" style="display: inline-block">
      <vue-playing-card :signature="getCard(card)" width="150"></vue-playing-card>
    </div>
  </div>

  <h3> Current Player : {{ displayPlayer(allPlayers[currPlayer]) }} </h3> 

  <h3> Cards</h3>
  <div v-for="card in cardsOnBoard" :key="card" id="cardsOnBoard" style="display: inline-block; margin:1%">
    <vue-playing-card :signature="getCard(card)"></vue-playing-card>
  </div>

  <h3> Blinds : {{ minBlind/2 }}/{{ minBlind }} </h3>

  <h3> Called Amount : {{ calledAmt }} </h3>

  <h3> Pot : {{ potAmt }} </h3>

  <h2>Functions</h2>
  <button v-on:click="getGameState">Get GameState</button><br>
  <input type="text" id="pname" name="pname">
  <button v-on:click="addPlayer">Add Player</button><br>
  <input type="text" id="rname" name="rname">
  <button v-on:click="removePlayer">Remove Player</button><br>
  <button v-on:click="beginRound">Begin Round</button><br>
  
  <button v-on:click="call"> Call </button>
  <button v-on:click="raise"> Raise </button>
  <input type="text" id="raiseamt" name="raiseamt">
  <button v-on:click="fold"> Fold </button><br>

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
    cardsOnBoard : [],
    minBlind : 2,
    calledAmt : 0,
    lastRaise : 0,
    potAmt : 0
  }),
  methods: {
    displayPlayer (player) {
      return (player != undefined) ? (`${player.name}`) : (`N/A`);
    },
    displayPlayers (allPlayers) {
      let listOfPlayers = '';
      for(const p of allPlayers) {
        listOfPlayers += p.name + '(';
        for(const c of p.cards) {
          listOfPlayers += ((c != null) ? c.rank + c.suite + ', ' : '');
        }
        listOfPlayers += '), ';
      }
      return listOfPlayers;
    },
    displayCardsOnBoard (cardsOnBoard) {
      cardsOnBoard.forEach(function(card) {
        document.getElementById("cardsOnBoard").innerHTML += `<vue-playing-card signature="${card.rank}${card.suite}"></vue-playing-card>`;
      });
    },
    getCard (card) {
      const rank = (card.rank === '10') ? ('t') : (card.rank.toLowerCase());
      return '' + rank + card.suite.toLowerCase();
    },
    async getGameState () {
      let vm = this;
      axios.get('http://localhost:3000/gamestate')
      .then(function (response) {
       // handle success
        console.log(response.data);
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, potAmt: vm.potAmt} = response.data);
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
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, potAmt: vm.potAmt} = response.data);
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
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, potAmt: vm.potAmt} = response.data);
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
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, potAmt: vm.potAmt} = response.data);
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
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, potAmt: vm.potAmt} = response.data);
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
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, potAmt: vm.potAmt} = response.data);
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
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, potAmt: vm.potAmt} = response.data);
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
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, potAmt: vm.potAmt} = response.data);
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
        ({allPlayers: vm.allPlayers, dealerPos: vm.dealerPos, currPlayer: vm.currPlayer, cardsOnBoard: vm.cardsOnBoard, minBlind: vm.minBlind, calledAmt: vm.calledAmt, lastRaise: vm.lastRaise, potAmt: vm.potAmt} = response.data);
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

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  text-align: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

button {
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
  background-color: #ff8800;
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
</style>
