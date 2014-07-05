var objectMaker = (function () {
    'using strict';

    var DIRECTION = dataModule.DIRECTION,
        SnakeBodySegment,
        Snake,
        Food,
        Obstacle;

    Snake = (function () {
        SnakeBodySegment = function (x, y) {
            this._x = x;
            this._y = y;
        };

        function generateSnakeBody(x, y, direction, length) {
            var snakeBody = [],
                i;

            for (i = 0; i < length; i += 1) {
                x -= direction.x;
                y -= direction.y;
                snakeBody[i] = new SnakeBodySegment(x, y);
            }

            return snakeBody;
        }

        var Snake = function (x, y, length) {
            this.isAlive = true;
            this.direction = DIRECTION.RIGHT;
            this._head = new SnakeBodySegment(x, y);
            this._body = generateSnakeBody(x, y, this.direction, length - 1);
        };

        Snake.prototype.move = function () {
            var i,
                len = this._body.length;

            for (i = len - 1; i >= 0; i -= 1) {
                if (i != 0) {
                    this._body[i]._x = this._body[i - 1]._x;
                    this._body[i]._y = this._body[i - 1]._y;
                } else {
                    this._body[i]._x = this._head._x;
                    this._body[i]._y = this._head._y;
                }
            }

            this._head._x += this.direction.x;
            this._head._y += this.direction.y;
        };

        Snake.prototype.eat = function () {
            var lastElementIndex = this._body.length - 1,
                lastElementX = this._body[lastElementIndex]._x,
                lastElementY = this._body[lastElementIndex]._y,
                newSegment = new SnakeBodySegment(lastElementX, lastElementY);

            this._body.push(newSegment);
        };

        return Snake;
    }());

    Food = (function () {
        function Food(x, y) {
            this._x = x;
            this._y = y;
        }

        return Food;
    }());

    Obstacle = (function () {
        function Obstacle(x, y) {
            this._x = x;
            this._y = y;
        }

        return Obstacle;
    }());

    return {
        Snake: Snake,
        Food: Food,
        Obstacle: Obstacle
    };
}());

