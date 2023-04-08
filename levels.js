import GameLevel from './gameLevel.js';

const levels = [
    new GameLevel(1, "normal",14, 2, 15, 1, 0, 2),
    new GameLevel(2, "normal",15, 2, 16, 1 ,0, 2),
    new GameLevel(3, "normal",16, 3, 17,1,  0, 2),
    new GameLevel(4, "normal",17, 4, 18,1, 0, 3),
    new GameLevel(5, "normal",18, 4, 19,1, 0,3),
    new GameLevel(6, "alt", 18, 5, 20,1, 0, 3),
    new GameLevel(7, "normal",18, 6, 22,1, 0, 3),
    new GameLevel(8, "normal",19, 6, 23,1, 0, 3),
    new GameLevel(9, "normal",20, 6, 24,1, 0, 4),
    new GameLevel(10, "normal",20, 7, 25,1, 0, 4),
    new GameLevel(11, "alt", 20, 8, 31,1, 0, 5),
    new GameLevel(12, "normal",20, 13, 33,1, 0,6 ),
    new GameLevel(13, "normal",20, 15, 33,1, 0, 7),
    new GameLevel(14, "normal",20, 20, 33, 2, 0, 8),
    new GameLevel(15, "alt", 20, 33, 33, 2, 0, 10)
];

export default levels;