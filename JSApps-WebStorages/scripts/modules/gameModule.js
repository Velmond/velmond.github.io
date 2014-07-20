define(['config'], function (Config) {
    'use strict';
    Array.prototype.contains = function (element) {
        var i,
            len;
        for (i = 0, len = this.length; i < len; i += 1) {
            if (this[i] === element) {
                return true;
            }
        }
        return false;
    };

    var NUMBER_OF_DIGITS = Config.NUMBER_OF_DIGITS,
        MAX_DIGIT = Config.MAX_DIGIT,
        generateNumberToGuess,
        getGuess,
        evaluateGuess;

    function extractValidDigits(minValue, maxValue, forbiddenValues) {
        var validDigits = [],
            i;

        for (i = minValue; i <= maxValue; i += 1) {
            if (!forbiddenValues.contains(i)) {
                validDigits.push(i);
            }
        }

        return validDigits;
    }

    function getRandomNumber(minValue, maxValue, forbiddenValues) {
        var validDigits = extractValidDigits(minValue, maxValue, forbiddenValues),
            randomDigitIndex = (Math.random() * validDigits.length) | 0;

        return validDigits[randomDigitIndex];
    }

    generateNumberToGuess = function generateNumberToGuess() {
        var numberToGuess = [],
            minDigit,
            i;

        for (i = 0; i < NUMBER_OF_DIGITS; i += 1) {
            minDigit = (i === 0 ? 1 : 0);
            numberToGuess[i] = getRandomNumber(minDigit, MAX_DIGIT, numberToGuess);
        }

        return numberToGuess.join('');
    };

    function isValidChar(char) {
        var validChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        return validChars.contains(char) ? true : false;
    }

    function hasInvalidValues(guess) {
        for (var i = 0; i < guess.length; i += 1) {
            if (!isValidChar(guess[i] * 1)) {
                return true;
            }
        }
        return false;
    }

    getGuess = function getGuess(selector) {
        var guess = document.body.querySelector(selector).value;

        if (!guess || (typeof guess !== 'string') || guess.length !== NUMBER_OF_DIGITS) {
            throw Error('The guess has to be a four-digit number (ex. "1234").');
        }

        if (hasRepeatingElements(guess)) {
            throw Error('The guess should have unique digits only (no repeating whatsoever).');
        }

        if (hasInvalidValues(guess)) {
            throw Error('The guess can only contain digits [0...9]');
        }

        return guess;
    };

    function hasRepeatingElements(string) {
        var i, keys = {};

        for (i = 0; i < NUMBER_OF_DIGITS; i += 1) {
            if (keys.hasOwnProperty(string[i])) {
                return true;
            } else {
                keys[string[i]] = 0;
            }
        }

        return false;
    }

    evaluateGuess = function evaluateGuess(guess, numberToGuess) {
        var rams,
            sheep,
            i;

        rams = 0;
        sheep = 0;

        for (i = 0; i < NUMBER_OF_DIGITS; i += 1) {
            if (guess[i] === numberToGuess[i]) {
                rams += 1;
            } else if (numberToGuess.indexOf(guess[i]) !== -1) {
                sheep += 1;
            }
        }

        return {
            rams: rams,
            sheep: sheep
        }
    };

    return {
        generateNumber: generateNumberToGuess,
        getGuess: getGuess,
        evaluateGuess: evaluateGuess
    }
});
