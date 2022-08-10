# Four Ace Poker

A free to use, online multiplayer poker website. No actual monetary transactions of any kind take place; all amounts are purely within the game.

## Home Page

The home page consists of two sections: single player and multiplayer. In single player, there is exactly one option, the regular single player option. 

### Singleplayer (TODO)

In regular singleplayer, there are a certain number of bots (from 1 to 7) to choose from, and when the user gives a valid nickname and presses the create game button, a new single player game will be created. 

### Create Game

When a user inputs their nickname and presses the create game button, a new multiplayer online game is created. This game has a join code which can be used by other players online to join the new game. In addition, the user that created the game has the ability to start the game as well.

### Join Game

When a user inputs their nickname and the correct join code and presses the join game button, they will be sent to the game with the associated code. However, they will not be able to start the game since they are not the one who created the game (unless the creator happened to leave). Passing in a nickname that is already in use within the game or an invalid code wil result in an error, which will be seen below the input fields.

## Game Interface

The Game Interface is where the actual poker game is played. The top right corner of the screen has the leave game button and the game code. The title is also displayed, although smaller, as 'Four Ace Poker'. Below the title is the start game button for the creator of the game. 

### Table Cards

Once the game has started, and the preflop round is over, 3 cards will be displayed in the top of the screen, under the title. More cards are added to the table once more rounds are completed. Once a showdown occurs, or someone wins through folding, the cards on the table are reset.

### The Pot 

In the beginning of the round, right before the preflop, the small and big blinds are paid, depending on the position of the dealer, and the value of the blinds, which are shown under the pot amount. Money is added to the pot as players call or raise. When a victor is declared, the pot is given to them. Finally, the called amount at the time is shown under the value of the pot as well. The called amount shows how much it costs to call at a specific time.

### Players

For each player in the game, a player 'box' is added to the DOM. This box has information like the player's name, current amount left, and icon. In addition, it can also contain each player's cards as well as their game actions, if it is their turn to play. Depending on the player, it will show the cards for themselves at all times during the round, but only reveal other player's cards after a showdown.