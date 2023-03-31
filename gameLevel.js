class GameLevel {
    constructor(id = 1,
                ruleName ="none",
                buildingCount = 1,
                minHeight = 10,
                maxHeight = 20,
                numberOfBombs = 1,
                linkId = 0,
                clouds=0,
                cloudSize="small") {
        this.id = id;
        this.ruleName = ruleName;
        this.buildingCount = buildingCount;
        this.minHeight = minHeight;
        this.maxHeight = maxHeight;
        this.numberOfBombs = numberOfBombs;
        this.linkId = linkId;
        this.clouds = clouds;
        this.cloudSize = cloudSize;
    }
}

export default GameLevel;