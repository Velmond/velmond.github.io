var drawModule = (function () {
    'using strict';

    var Renderer = (function () {
        var FIELD = dataModule.FIELD,
            COLOR = dataModule.COLOR,
            renderer;

        var Renderer = function (parentSelector) {
            var parent = document.querySelector(parentSelector),
                canvas = document.createElement('canvas'),
                context = canvas.getContext('2d');

            this._context = context;

            canvas.width = FIELD.WIDTH * FIELD.GRID_INCREMENT;
            canvas.height = FIELD.HEIGHT * FIELD.GRID_INCREMENT;
            canvas.style.border = '1px solid black';
            parent.appendChild(canvas);
        };

        Renderer.prototype.draw = function (elements) {
            var i, len;

            for (i = 0, len = elements.length; i < len; i += 1) {
                if (elements[i] instanceof objectMaker.Snake) {
                    drawSnake(this._context, elements[i]);
                } else if (elements[i] instanceof objectMaker.Food) {
                    drawFood(this._context, elements[i]);
                } else {
                    drawObstacle(this._context, elements[i]);
                }
            }
        };

        Renderer.prototype.clear = function () {
            this._context.clearRect(
                0,
                0,
                (FIELD.WIDTH * FIELD.GRID_INCREMENT),
                (FIELD.HEIGHT * FIELD.GRID_INCREMENT)
            );
        };

        function drawSegment(context, element, fillColor, strokeColor) {
            context.fillStyle = fillColor || 'white';
            context.strokeStyle = strokeColor || 'black';
            context.lineWidth = 3;
            context.beginPath();
            context.arc(
                (element._x * FIELD.GRID_INCREMENT + FIELD.GRID_INCREMENT / 2),
                (element._y * FIELD.GRID_INCREMENT + FIELD.GRID_INCREMENT / 2),
                (FIELD.GRID_INCREMENT / 2),
                0,
                (2 * Math.PI)
            );
            context.closePath();
            context.fill();
            context.stroke();
        }

        function drawSnake(context, snake) {
            var i, len;

            drawSegment(context, snake._head, COLOR.SNAKE_FILL, COLOR.SNAKE_STROKE);

            for (i = 0, len = snake._body.length; i < len; i++) {
                drawSegment(context, snake._body[i], COLOR.SNAKE_FILL, COLOR.SNAKE_STROKE);
            }
        }

        function drawFood(context, food) {
            drawSegment(context, food, COLOR.FOOD_FILL, COLOR.FOOD_STROKE);
        }

        function drawObstacle(context, obstacle) {
            drawSegment(context, obstacle, COLOR.OBSTACLE_FILL, COLOR.OBSTACLE_STROKE);
        }

        return {
            getRenderer: function (selector) {
                if (!renderer) {
                    renderer = new Renderer(selector);
                }
                return renderer;
            }
        }
    }());

    return {
        Renderer: function (selector) {
            if (!selector) {
                selector = 'body';
            }
            return Renderer.getRenderer(selector);
        }
    };
}());
