import GameLevel from './gameLevel.js';

const levels = [
    new GameLevel(1, "normal",14, 2, 15, 1, 0, 2),
    new GameLevel(2, "normal",15, 2, 16, 1 ,0, 2),
    new GameLevel(3, "alt",18, 8, 25,1,  0, 2),
    new GameLevel(4, "normal",17, 4, 18,1, 0, 3),
    new GameLevel(5, "normal",18, 4, 19,1, 0,3),
    new GameLevel(6, "alt:2-6", 19, 10, 25,1, 0, 3),
    new GameLevel(7, "normal",20, 6, 22,1, 0, 3),
    new GameLevel(8, "normal",21, 6, 23,1, 0, 3),
    new GameLevel(9, "static:2,33,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,33",21, 0, 0,1, 0, 4),
    new GameLevel(10, "normal",20, 8, 27,1, 0, 4),
    new GameLevel(11, "alt:15-15", 21, 20, 31,1, 0, 5),
    new GameLevel(12, "normal",20, 13, 31,1, 0,6 ),
    new GameLevel(13, "normal",20, 15, 32,1, 0, 7),
    new GameLevel(14, "normal",21, 17, 33, 2, 0, 8),
    new GameLevel(15, "static:24,24,24,24,26,26,26,26,28,28,28,28,26,26,26,26,24,24,24,24",20, 0, 0,1, 0, 4),
    new GameLevel(16, "alt:30-30", 18, 33, 33, 2, 0, 10),
    new GameLevel(17, "static:33,33,24,24,26,26,26,26,28,28,28,28,26,26,26,26,24,24,33,33",20, 0, 0,2, 0, 4),
    new GameLevel(18, "normal",21, 31, 32,3, 0, 4),
];

export default levels;