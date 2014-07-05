var engineModule = (function () {
    'using strict';

    var Engine = (function () {
        var DIRECTION = dataModule.DIRECTION,
            FIELD = dataModule.FIELD,
            INITIAL_SNAKE = dataModule.INITIAL_SNAKE,
            SPEED = dataModule.GAME_SPEED,
            OBSTACLES = dataModule.OBSTACLES,
            SEGMENTS_TO_LEVEL_UP = dataModule.SEGMENTS_TO_LEVEL_UP,
            SCORES_TO_REMEMBER = dataModule.SCORES_TO_REMEMBER,
            Player,
            Engine,
            snake,
            food,
            obstacles,
            gameElements,
            player,
            renderer,
            isPaused,
            gameID,
            resultContainer,
            segmentsToNextLevel,
            infoDiv,
            level;

        function onKeyDownHandler(e) {
            if (!e) {
                e = window.event;
            }

            if (!isPaused) {
                if (e.keyCode == 38) {
                    if (snake.direction !== DIRECTION.DOWN) {
                        snake.direction = DIRECTION.UP;
                    }
                } else if (e.keyCode == 40) {
                    if (snake.direction !== DIRECTION.UP) {
                        snake.direction = DIRECTION.DOWN;
                    }
                } else if (e.keyCode == 37) {
                    if (snake.direction !== DIRECTION.RIGHT) {
                        snake.direction = DIRECTION.LEFT;
                    }
                } else if (e.keyCode == 39) {
                    if (snake.direction !== DIRECTION.LEFT) {
                        snake.direction = DIRECTION.RIGHT;
                    }
                }
            }
        }

        function generateRandomPosition(min, max) {
            return min + ((Math.random() * (max - min)) | 0);
        }

        function generateNewObstacle() {
            var nextObstacle = {};

            // The possible coordinates are all odd numbers between 1 and (maximum - 1)
            nextObstacle.x = generateRandomPosition(1, FIELD.WIDTH);
            nextObstacle.y = generateRandomPosition(1, FIELD.HEIGHT);

            if (nextObstacle.x > 0 && nextObstacle.x % 2 === 0) {
                nextObstacle.x -= 1;
            }

            if (nextObstacle.y > 0 && nextObstacle.y % 2 === 0) {
                nextObstacle.y -= 1;
            }

            return new objectMaker.Obstacle(nextObstacle.x, nextObstacle.y);
        }

        function generateNewFood() {
            var newFoodPosition,
                newFood;

            while (!newFoodPosition || !isValidPosition(newFoodPosition)) {
                newFoodPosition = {};
                newFoodPosition.x = generateRandomPosition(1, FIELD.WIDTH - 1);
                newFoodPosition.y = generateRandomPosition(1, FIELD.HEIGHT - 1);
            }

            newFood = new objectMaker.Food(newFoodPosition.x, newFoodPosition.y);
            return newFood;
        }

        function getAllGameElements(snake, food, obstacles) {
            var gameElements = [snake, food],
                i,
                len;

            for (i = 0, len = obstacles.length; i < len; i += 1) {
                gameElements.push(obstacles[i]);
            }

            return gameElements;
        }

        Player = function () {
            this.name = '';
            this.score = 0;
        };

        Engine = function () {
            renderer = drawModule.Renderer();
            document.body.addEventListener('keydown', onKeyDownHandler);
            infoDiv = createInfoContainer();
            displayInfo('Click to initialize the game.\n\n' +
                'Press R to restart.\n' +
                'Press Space to pause/unpause.\n' +
                'The speed increases with each 10 segments the snake eats.\n' +
                'Watch out for the gray obstacles. One gets added each time the snake eats.');
        };

        Engine.prototype.start = function () {
            displayInfo('');
            if (!player) {
                player = new Player();
            }

            if (!resultContainer) {
                resultContainer = createResultContainer();
                resultContainer.innerText = 'SCORE: ' + (player.score | 0).toString();
            }

            // If game was paused it has a snake, food and obstacles that shouldn't be replaced by new ones.
            // If snake doesn't exist the game was not initialized yet.
            if (!snake) {
                snake = new objectMaker.Snake(INITIAL_SNAKE.X, INITIAL_SNAKE.Y, INITIAL_SNAKE.SIZE);
                obstacles = [];

                for (var i = 0; i < OBSTACLES.INITIAL_COUNT; i += 1) {
                    obstacles.push(generateNewObstacle())
                }

                food = generateNewFood();
                gameElements = getAllGameElements(snake, food, obstacles);
                segmentsToNextLevel = SEGMENTS_TO_LEVEL_UP;
                level = 0;
            }

            renderer.draw(gameElements);
            gameID = setInterval(drawFrame, SPEED);
        };

        Engine.prototype.restart = function () {
            if (infoDiv) {
                infoDiv.innerHTML = '';
            }

            renderer.clear();
            snake = undefined;
            player.score = 0;
            clearInterval(gameID);
            this.start();
        };

        Engine.prototype.pause = function () {
            if (isPaused) {
                isPaused = false;
                displayInfo('');
                this.start();
            } else {
                isPaused = true;
                displayInfo('PAUSED');
                clearInterval(gameID);
            }
        };

        function drawFrame() {
            resultContainer.innerText = 'SCORE: ' + (player.score | 0).toString();
            snake.move();
            detectCollision();

            if (!snake.isAlive) {
                clearInterval(gameID);
                displayInfo('GAME OVER');
                infoDiv.appendChild(getHighScoresInfo());
                return;
            }

            if (segmentsToNextLevel === 0) {
                increaseLevel();
                segmentsToNextLevel = SEGMENTS_TO_LEVEL_UP;
            }

            player.score += 0.1;
            renderer.clear();
            renderer.draw(gameElements);
        }

        function getHighScoresInfo() {
            var highScores = document.querySelector('.high-scores'),
                visibleHighScores,
                thisScoreEntry = document.createElement('li'),
                individualScores = document.querySelectorAll('.high-scores-entry'),
                currentHighScore,
                wasAdded,
                i,
                len;

            if (individualScores.length < SCORES_TO_REMEMBER || player.score > individualScores[individualScores.length - 1].dataset.score * 1) {
                player.name = prompt('Please input your name:');
                thisScoreEntry.classList.add('high-scores-entry');
                thisScoreEntry.dataset.name = player.name;
                thisScoreEntry.dataset.score = player.score | 0;
                thisScoreEntry.innerText = player.name + ' | ' + (player.score | 0);

                wasAdded = false;
                len = individualScores.length > SCORES_TO_REMEMBER ? SCORES_TO_REMEMBER : individualScores.length;

                for (i = 0; i < len; i += 1) {
                    currentHighScore = individualScores[i].dataset.score * 1;

                    if (player.score >= currentHighScore) {
                        highScores.insertBefore(thisScoreEntry, individualScores[i]);
                        wasAdded = true;
                        break;
                    }
                }

                if (individualScores.length < SCORES_TO_REMEMBER && !wasAdded) {
                    highScores.appendChild(thisScoreEntry);
                }

                while (highScores.children.length > SCORES_TO_REMEMBER) {
                    highScores.removeChild(individualScores[individualScores.length - 1]);
                }
            }

            visibleHighScores = highScores.cloneNode(true);
            visibleHighScores.classList.remove('hidden');

            return visibleHighScores;
        }

        function increaseLevel() {
            level += 1;
            player.score += 100;
            clearInterval(gameID);
            gameID = setInterval(drawFrame, SPEED - (0.1 * level) * SPEED);
        }

        function detectCollision() {
            var i,
                len;

            for (i = 0, len = snake._body.length; i < len; i += 1) {
                if (snake._body[i]._x === snake._head._x &&
                        snake._body[i]._y === snake._head._y) {
                    snake.isAlive = false;
                    break;
                }
            }

            if (isOutOfField(snake) || isAtObstacles(snake, obstacles)) {
                snake.isAlive = false;
            } else if (isAtFood(snake, food)) {
                feedSnake();
            }
        }

        function feedSnake() {
            snake.eat();
            segmentsToNextLevel -= 1;
            player.score += 10;
            gameElements.splice(gameElements.indexOf(food), 1);

            if (obstacles.length < OBSTACLES.MAX_COUNT) {
                var newObstacle = generateNewObstacle();
                obstacles.push(newObstacle);
                gameElements.push(newObstacle);
            }

            food = generateNewFood();
            gameElements.push(food);
        }

        function isValidPosition(position) {
            var i,
                len;

            for (i = 0, len = obstacles.length; i < len; i += 1) {
                if (position.x === obstacles[i]._x && position.y === obstacles[i]._y) {
                    return false;
                }
            }

            return true;
        }

        function isOutOfField(snake) {
            return (snake._head._x < 0 ||
                snake._head._x >= FIELD.WIDTH ||
                snake._head._y < 0 ||
                snake._head._y >= FIELD.HEIGHT);
        }

        function isAtObstacles(snake, obstacles) {
            var i, len;

            for (i = 0, len = obstacles.length; i < len; i += 1) {
                if (snake._head._x === obstacles[i]._x && snake._head._y === obstacles[i]._y) {
                    return true;
                }
            }

            return false;
        }

        function isAtFood(snake, food) {
            return (snake._head._x === food._x &&
                snake._head._y === food._y);
        }

        var displayInfo = function (info) {
            infoDiv.innerText = info;
        };

        function createResultContainer() {
            resultContainer = document.createElement('div');
            resultContainer.style.fontSize = '18px';
            resultContainer.style.border = '1px solid black';
            resultContainer.style.padding = '5px 10px';
            resultContainer.style.width = '200px';
            document.body.appendChild(resultContainer);
            return resultContainer;
        }

        function createInfoContainer() {
            infoDiv = document.createElement('div');
            infoDiv.style.position = 'absolute';
            infoDiv.style.top = '250px';
            infoDiv.style.zIndex = '100';
            infoDiv.style.color = 'red';
            infoDiv.style.fontSize = '28px';
            infoDiv.style.textAlign = 'center';
            infoDiv.style.width = '99%';
            document.body.appendChild(infoDiv);
            return infoDiv;
        }

        return Engine;
    }());

    return {
        Engine: Engine
    };
}());
