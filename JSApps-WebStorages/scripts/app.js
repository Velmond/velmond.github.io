// 01. Create a simple number guessing game
//   - The computer generates a random number with four different digits
//     = The leftmost digit must not be 0 (zero)
//     = For simplicity called abcd
//   - At each turn the player enters a four-digit number
//     = For simplicity called xyzw
//   - When the game ends:
//     = Ask the player for a nickname
//     = Save the nickname inside the localStorage
//   - Implement a high-score list
//   - Sheep means that a digit from xyzw is contained in abcd, but not on the same position
//     = If two such digits exists, the sheep are 2
//   - Ram means that a digit from xyzw is contained in abcd and it is on the same position
//     = If two such digits exists, the rams are 2
//   - The game continues until the player guesses the number abcd
//     = i.e. has 4 rams

(function () {
    'use strict';
    require.config({
        paths: {
            'game': 'modules/gameModule',
            'score': 'modules/scoreModule',
            'storage': 'modules/storageModule',
            'config': 'modules/gameConfigModule'
        }});

    require(['game', 'storage'], function (Game, Storage) {
        var numberToGuess,
            guess,
            ramsAndSheep,
            log = '',
            score = 0,
            resultContainer = document.getElementById('result-container');

        document.getElementById('evaluate-btn').addEventListener('click', processGuess);
        document.getElementById('reset-btn').addEventListener('click', resetVariables);
        document.getElementById('scores-btn').addEventListener('click', displayScores);
        document.getElementById('clear-scores-btn').addEventListener('click', Storage.clear);

        numberToGuess = Game.generateNumber();

        function processGuess() {
            log = (resultContainer.innerHTML ? resultContainer.innerHTML + '<br/>' : '');

            try {
                guess = Game.getGuess('#guess-input');
                ramsAndSheep = Game.evaluateGuess(guess, numberToGuess);

                log += 'Rams: ' + ramsAndSheep.rams + '; Sheep: ' + ramsAndSheep.sheep;

                score = (score || 0) + 1;

                if (ramsAndSheep.rams === 4) {
                    log += 'Congratulations! You guessed the number.';
                    var name = prompt('Please input your name.');
                    Storage.addScore(name, score);
                    resetVariables();
                }
            } catch (err) {
                log += '<span class="highlight">' + err.message + '</span>'
            }

            resultContainer.innerHTML = log;
            resultContainer.scrollTop = resultContainer.scrollHeight;
        }

        function resetVariables() {
            numberToGuess = Game.generateNumber();
            score = 0;
            log = '';
            resultContainer.innerHTML = log;
        }

        function displayScores() {
            var highScores = Storage.load();
            log = resultContainer.innerHTML;
            log += (log ? '<br/>' : '') + 'HIGH SCORES:';

            if (!highScores.length) {
                log += (log ? '<br/>' : '') +'There are no saved high scores.';
            } else {
                for (var i = 0; i < highScores.length; i += 1) {
                    log += '<br/>' + (i + 1) + '. ' + highScores[i]._name + ' - ' + highScores[i]._score;
                }
            }

            resultContainer.innerHTML = log;
            resultContainer.scrollTop = resultContainer.scrollHeight;
        }
    })
}());
