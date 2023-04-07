import Const from "./constants.js";

class Score {
    constructor() {
        this.score = 0;
        this.highScore = 0;
        this.level = 0;
        this.testMode = false;
    }

    increment(amount) {
        this.score += amount;

        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
    }

    saveGameData() {
        localStorage.setItem(Const.GAME_NAME + '.currentLevel', this.level);
        localStorage.setItem(Const.GAME_NAME + '.highScore', this.highScore);
        console.log("Saved level: " + this.level)
    }

    loadGameData() {
        const currentLevel = localStorage.getItem(Const.GAME_NAME + '.currentLevel') || 0;
        const highScore = localStorage.getItem(Const.GAME_NAME + '.highScore') || 0;

        this.level = parseInt(currentLevel);
        this.highScore = parseInt(highScore);

        console.log("loaded level: " + this.level)
    }

    reset() {
        this.level = 0;
        this.saveGameData();
    }

    // Test mode is here as this object can be passed around easily
    toggleTestMode() {
        this.testMode = !this.testMode;
    }
}

export default Score;