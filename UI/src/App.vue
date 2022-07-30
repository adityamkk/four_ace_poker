<template>
<div>

  <img alt="Vue logo" src="./assets/poker.webp"> 
  <h1>GameState</h1>

  <h3> Players : {{ displayPlayers(allPlayers) }} </h3>

  <h3> Current Player : {{ displayPlayer(allPlayers[currPlayer]) }} </h3> 

  <h3> Cards</h3>
  <div v-for="card in cardsOnBoard" :key="card" id="cardsOnBoard">
    <vue-playing-card :signature="getCard(card)"></vue-playing-card>
  </div>

  <h3> Blinds : {{ minBlind/2 }}/{{ minBlind }} </h3>

  <h3> Called Amount : {{ calledAmt }} </h3>

  <h3> Pot : {{ potAmt }} </h3>

  <h1>Functions</h1>
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
//import card from './components/PlayingCard.vue';

//import Vue from 'vue';
// @ts-ignore
//import VuePlayingCard from 'vue-playing-card';
//const VuePlayingCard = require('vue-playing-card');
 
//Vue.use(VuePlayingCard);


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
      return card.rank.toLowerCase() + card.suite.toLowerCase();
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
</style>
<style src="./assets/cards.css"></style>
