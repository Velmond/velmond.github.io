define(['score', 'config'], function (Score, Config) {
    'use strict';
    var STORAGE_KEY = Config.STORAGE_KEY,
        SCORES_TO_KEEP = Config.SCORES_TO_KEEP,
        addScore,
        loadHighScores,
        clearHighScores;

    addScore = function (name, points) {
        var score = new Score(name, points),
            highScores = loadHighScores(),
            i,
            len;

        if (!highScores.length) {
            highScores.push(score);
        } else if (highScores.length < SCORES_TO_KEEP) {
            for (i = 0, len = highScores.length; i < len; i += 1) {
                if (score.getScore() < highScores[i]._score) {
                    highScores.splice(i, 0, score);
                    break;
                } else if (i === len - 1) {
                    highScores.push(score);
                }
            }
        } else {
            for (i = 0; i < SCORES_TO_KEEP; i += 1) {
                if (score.getScore() < highScores[i]._score) {
                    highScores.splice(i, 0, score);
                    highScores = highScores.slice(0, SCORES_TO_KEEP);
                    break;
                }
            }
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(highScores));
    };

    loadHighScores = function () {
        var highScores = localStorage.getItem(STORAGE_KEY);
        return (highScores ? JSON.parse(highScores) : []);
    };

    clearHighScores = function () {
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        addScore: addScore,
        load: loadHighScores,
        clear: clearHighScores
    };
});
