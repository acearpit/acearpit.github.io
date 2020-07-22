/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

// getElementById is faster than querySelector

var scores, roundScore, currentPlayer, flag;

init();

document.querySelector('.btn-roll').addEventListener('click', function () {

    if (flag) {
        // Generating Random Dice Number
        var dice = Math.floor(Math.random() * 6) + 1;
        var _dice = Math.floor(Math.random() * 6) + 1;
        // Displaying Corresponding Dice
        // Dice1
        var _diceDOM = document.querySelector('._dice');
        _diceDOM.style.display = 'block';
        _diceDOM.src = 'dice-' + _dice + '.png';
        // Dice2
        var diceDOM = document.querySelector('.dice');
        diceDOM.style.display = 'block';
        diceDOM.src = 'dice-' + dice + '.png';
        // Updating scores correspondingly
        if (dice === 1 || _dice === 1 || (dice === 6 && _dice === 6)) {
            roundScore = 0;
            document.querySelector('.dice').style.display = 'none';
            document.querySelector('._dice').style.display = 'none';
            document.getElementById('current-' + currentPlayer).textContent = roundScore;
            document.querySelector('.player-' + currentPlayer + '-panel').classList.remove('active');
            currentPlayer = (currentPlayer + 1) % 2;
            document.querySelector('.player-' + currentPlayer + '-panel').classList.add('active');
        } else {
            roundScore += (dice + _dice);
            document.getElementById('current-' + currentPlayer).textContent = roundScore;
        }
    }

});

document.querySelector('.btn-hold').addEventListener('click', function () {

    if (flag) {
        // Updating scores correspondingly
        scores[currentPlayer] += roundScore;
        roundScore = 0;
        // hiding the dice
        document.querySelector('.dice').style.display = 'none';
        document.querySelector('._dice').style.display = 'none';
        // displaying the scores
        document.getElementById('current-' + currentPlayer).textContent = roundScore;
        document.getElementById('score-' + currentPlayer).textContent = scores[currentPlayer];

        // getting MaxScore
        var maxScore;
        var input = document.getElementById('score').value;
        if (input) {
            maxScore = input;
        } else {
            maxScore = 100;
        }

        // declaring the WINNER
        if (scores[currentPlayer] >= maxScore) {
            flag = false;
            document.querySelector('.player-' + currentPlayer + '-panel').classList.toggle('active');
            document.querySelector('.player-' + currentPlayer + '-panel').classList.toggle('winner');
            document.getElementById('name-' + currentPlayer).textContent = 'WINNER!';
        } else {
            document.querySelector('.player-' + currentPlayer + '-panel').classList.toggle('active');
            currentPlayer = (currentPlayer + 1) % 2;
            document.querySelector('.player-' + currentPlayer + '-panel').classList.toggle('active');
        }
    }

});

document.querySelector('.btn-new').addEventListener('click', init);

function init() {
    scores = [0, 0];
    roundScore = 0;
    currentPlayer = 0;
    maxScore = 100;
    flag = true;

    // document.getElementById('score').value = 100;

    document.querySelector('.dice').style.display = 'none';
    document.querySelector('._dice').style.display = 'none';

    document.getElementById('score-0').textContent = 0;
    document.getElementById('score-1').textContent = 0;
    document.getElementById('current-0').textContent = 0;
    document.getElementById('current-1').textContent = 0;

    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';

    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
}