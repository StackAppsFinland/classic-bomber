import GameLevel from './gameLevel.js';

const levels = [
    new GameLevel(1, "normal",1, 10, 20),
    new GameLevel(2, "normal",5, 5, 12),
    new GameLevel(3, "normal",2, 20, 30),
    new GameLevel(4, "normal",10, 2, 14),
    new GameLevel(5, "normal",16, 2, 16),
    new GameLevel(6, "alt", 20, 15, 20),
    new GameLevel(7, "normal",20, 2, 18),
    new GameLevel(8, "normal",20, 2, 20),
    new GameLevel(9, "normal",20, 2, 24),
    new GameLevel(10, "normal",20, 7, 25),
    new GameLevel(11, "alt", 20, 8, 31),
    new GameLevel(12, "normal",20, 13, 33),
    new GameLevel(13, "normal",20, 15, 33),
    new GameLevel(14, "normal",20, 20, 33, 2),
    new GameLevel(15, "alt", 20, 33, 33, 2),
];

export default levels;