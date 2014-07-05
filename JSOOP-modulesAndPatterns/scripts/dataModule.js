var dataModule = (function () {
    return {
        FIELD: {
            WIDTH: 81,
            HEIGHT: 41,
            GRID_INCREMENT: 15
        },
        DIRECTION: {
            UP: { x: 0, y: -1 },
            DOWN: { x: 0, y: 1 },
            LEFT: { x: -1, y: 0 },
            RIGHT: { x: 1, y: 0 }
        },
        GAME_SPEED: 150,  // milliseconds between rendering each frame
        SEGMENTS_TO_LEVEL_UP: 10,
        INITIAL_SNAKE : {
            X: 10,
            Y: 10,
            SIZE: 5
        },
        OBSTACLES: {
            INITIAL_COUNT: 20,
            MAX_COUNT: 300
        },
        COLOR: {
            SNAKE_FILL: 'lightgreen',
            SNAKE_STROKE: 'darkgreen',
            FOOD_FILL: 'red',
            FOOD_STROKE: 'darkred',
            OBSTACLE_FILL: 'gray',
            OBSTACLE_STROKE: 'darkgray'
        },
        SCORES_TO_REMEMBER: 5
    }
}());
