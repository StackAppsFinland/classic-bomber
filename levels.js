import GameLevel from './gameLevel.js';

const levels = [
    new GameLevel(1, "normal",1, 10, 20, 1, 0, 4),
    new GameLevel(2, "normal",5, 5, 12, 1 ,0, 4),
    new GameLevel(3, "normal",2, 20, 30,1,  0, 6),
    new GameLevel(4, "normal",10, 2, 14,1, 0, 7),
    new GameLevel(5, "normal",16, 2, 16,1, 0),
    new GameLevel(6, "alt", 20, 15, 20,1, 0),
    new GameLevel(7, "normal",20, 2, 18,1, 0),
    new GameLevel(8, "normal",20, 2, 20,1, 0),
    new GameLevel(9, "normal",20, 2, 24,1, 0),
    new GameLevel(10, "normal",20, 7, 25,1, 0),
    new GameLevel(11, "alt", 20, 8, 31,1, 0),
    new GameLevel(12, "normal",20, 13, 33,1, 0),
    new GameLevel(13, "normal",20, 15, 33,1, 0),
    new GameLevel(14, "normal",20, 20, 33, 2, 0),
    new GameLevel(15, "alt", 20, 33, 33, 2, 0)
];

export default levels;