<template>
<div>
    <div id="title">
        <h1 id="title_text">Four Ace Poker</h1>
        <vue-playing-card signature="ah" width="100"></vue-playing-card>
        <vue-playing-card signature="as" width="100"></vue-playing-card>
        <vue-playing-card signature="ad" width="100"></vue-playing-card>
        <vue-playing-card signature="ac" width="100"></vue-playing-card>
    </div><br>
    <div id="options">
        <h2 class="subtitle">Multiplayer</h2>
        <div style="display: inline-flex">
            <div id="create">
                <h2>Create New Game</h2>
                <div style="display:inline-flex">
                    <div>
                        <h3>Name</h3>
                        <input type="text" id="cname" name="cname">
                    </div>
                    <button v-on:click="multiPlayerNewGame" id="cbutton">Create</button>
                </div>
            </div>
            <div id="join">
                <h2>Join Game</h2>
                <div style="display:inline-flex">
                    <div>
                        <h3>Name</h3>
                        <input type="text" id="jname" name="jname">
                    </div>
                    <div>
                        <h3>Code</h3>
                        <input type="text" id="jcode" name="jcode">
                    </div>
                    <button v-on:click="joinGame" id="jbutton">Join</button> 
                </div>
                <h4 id="error" style="display:none">Name or Code Invalid, Please Try Again</h4>
            </div>
        </div>
        <h2 class="subtitle">Singleplayer</h2>
        <div id="single">
            <h2>Single Player (Coming Soon!)</h2>
            <div style="display:inline-flex;">
                <div>
                    <h3>Name</h3>
                    <input type="text" id="sname" name="sname">
                </div>
                <div>
                    <h3>Bots</h3>
                    <select name="num-bots" id="bots">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                    </select>
                </div>
                <button id="sbutton">Start</button> 
            </div>
        </div>
    </div>
</div>
</template>

<script>
    import axios from 'axios';
    //axios.defaults.withCredentials = true;

    import router from './router';

    export default {
        name: 'home-page',
        data : () => ({
            gameInfo: []
        }),
        methods : {
            async multiPlayerNewGame() {
                axios.get(`/newMultiGame?name=${document.getElementById('cname').value}`)
                .then(function (response) {
                    // handle success
                    router.push('/game');
                    console.log(response.data);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
            },
            async joinGame() {
                axios.get(`/addPlayer?code=${document.getElementById('jcode').value}&name=${document.getElementById('jname').value}`)
                .then(function (response) {
                    // handle success
                    router.push('/game');
                    console.log(response.data);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    //alert('Name invalid, please try again');
                    document.getElementById('error').style.display = 'block';
                })
                .then(function () {
                    // always executed
                });
            },
        }
    }
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Ultra&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Stint+Ultra+Condensed&family=Stint+Ultra+Expanded&family=Ultra&display=swap');

#app {
  font-family: 'Stint Ultra Expanded', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
}

body {
  text-align: center;
  color: #ffffff;
  font-family: 'Stint Ultra Expanded', sans-serif;
  padding:5px;
  margin:0;
  background-image: url("./assets/texture.jpg");
}

input, button, select {
    color: #ffffff;
    font-family: 'Stint Ultra Expanded', sans-serif;
    border-radius: 100px;
    border-style: none;
    padding: 10px;
    margin: 5px;
    display:inline;
}

input {
    color: #111111;
}

button {
    color: #222222;
    font-weight: 600;
    width: 100px;
}

select {
    color: #111111;
}

h1 {
    font-family: 'Ultra', 'Montserrat', sans-serif;
    color:#ffffff;
    padding: 25px;
    margin: 5px;
}

h2 {
    color: #ffffff;
}

h3 {
    color: #ffffff;
    margin-bottom: 5px;
}

h4 {
    color: #ffffff;
}

#title {
    font-family:'Ultra', 'Montserrat', sans-serif;
    display: inline-block;
    padding: 10px;
    margin: 10px;
}

#title_text {
    font-size: 100px;
    font-weight: 100;
}

.subtitle {
    text-decoration: underline dotted;
}

#options {
    display: inline-block;
    padding: 5px;
    margin: 5px;
}

#create, #join , #single{
    padding: 25px;
    margin: 25px;
    border-radius: 25px;
    border-style:none;
}

#single {
    background-color:#5DADE2;
}
#sbutton {
    background-color:#AED6F1;
    transition: 0.5s;
}
#sbutton:hover {
    background-color:#85C1E9;
    transition: 0.5s;
}

#create {
    background-color:#99A3A4;
}
#cbutton {
    background-color:#CCD1D1;
    transition: 0.5s;
}
#cbutton:hover {
    background-color:#B2BABB;
    transition: 0.5s;
}


#join {
    background-color:#EC7063;
    transition: 0.5s;
}
#jbutton {
    background-color:#F5B7B1;
    transition: 0.5s;
}
#jbutton:hover {
    background-color:#F1948A;
    transition: 0.5s;
}

</style>