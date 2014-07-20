define(function () {
    'use strict';
    var Score;

    Score = (function () {
        function Score(playerName, score) {
            this._name = playerName;
            this._score = score;
        }

        Score.prototype.getName = function () {
            return this._name;
        };

        Score.prototype.getScore = function () {
            return this._score;
        };

        return Score;
    }());

    return Score;
});
