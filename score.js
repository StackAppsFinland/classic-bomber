class Score {
    constructor() {
        this.score = 0;
        this.highScore = 0;
        this.level = 1;
        this.testMode = false;
    }

    increment(amount) {
        this.score += amount;

        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
    }

    // Test mode is here as this object can be passed around easily
    toggleTestMode() {
        this.testMode = !this.testMode;
    }
}

export default Score;