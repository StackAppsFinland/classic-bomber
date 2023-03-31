import Score from './score.js';
import Building from './building.js';
import levels from './levels.js';

const groundHeight = 10;
const buildingGap = 8;
const buildingWidth = 40;
const testModeActive = 4;
const currentScore = new Score();
let buildings = [];
let currentBuilding = 0;
let buildingCount = 0;
let bombs = [];
let allowedNumberOfBombs = 1;
let specialEffects = [];
let destroying = [];
let directHitBonus = 0;
let bonusPoints = 0;
let testModeCounter = 0;
let bombDropStartTime = 0;
const clouds = [];
const cloudSpeed = 1;


// let aircraft = new Aircraft(1, ctx, currentScore);

// Create a PixiJS Application
const app = new PIXI.Application({
    width: 1000,
    height: 700,
    backgroundColor: 0x87CEEB, // Sky blue color
    resolution: window.devicePixelRatio || 1,
});

// Add after app created
const canvasWidth = app.screen.width;
const canvasHeight = app.screen.height;
const scoreDisplay = drawScoreDisplay();

// Add the application view to the HTML body
document.body.appendChild(app.view);

// Define the game loop
function gameLoop(delta) {
    updateScoreDisplay();
    currentScore.add(1);
}

// Add the game loop to the PixiJS Ticker
app.ticker.add(gameLoop);

function drawScoreDisplay() {
    const scoreStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 'black',
    });

    const scoreText = new PIXI.Text("SCORE: " + currentScore.score, scoreStyle);
    scoreText.x = 10;
    scoreText.y = 4;

    const levelText = new PIXI.Text("LEVEL: " + currentScore.level, scoreStyle);
    levelText.x = 350;
    levelText.y = 4;

    const highScoreText = new PIXI.Text("HIGH SCORE: " + currentScore.highScore, scoreStyle);
    highScoreText.x = 750;
    highScoreText.y = 4;

    app.stage.addChild(scoreText, levelText, highScoreText);
    return { scoreText, levelText, highScoreText };
}

function updateScoreDisplay() {
    scoreDisplay.scoreText.text = "SCORE: " + currentScore.score;
    scoreDisplay.levelText.text = "LEVEL: " + currentScore.level;
    scoreDisplay.highScoreText.text = "HIGH SCORE: " + currentScore.highScore;
}

function drawDashedLine(graphics, startX, startY, endX, endY, dashLength, color, alpha) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const lineLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const numDashes = Math.floor(lineLength / (dashLength + 1));
    const dashX = deltaX / (numDashes * 2);
    const dashY = deltaY / (numDashes * 2);

    graphics.lineStyle(1, color, alpha);

    for (let i = 0.0; i < numDashes; i++) {
        const x1 = startX + i * dashX * 2;
        const y1 = startY + i * dashY * 2;
        const x2 = x1 + dashX;
        const y2 = y1 + dashY;

        graphics.moveTo(x1, y1);
        graphics.lineTo(x2, y2);
    }
}

function drawStaticParts() {
    const groundGraphics = new PIXI.Graphics();
    groundGraphics.beginFill(0x37AE0F); // Green color
    groundGraphics.drawRect(0, app.screen.height - groundHeight, app.screen.width, groundHeight);
    groundGraphics.endFill();

    drawDashedLine(groundGraphics, 0, canvasHeight - groundHeight, canvasWidth,
        canvasHeight - groundHeight, 1, 0x006400, 1.0)

    // Draw the faded purple test lines
   for (let y = canvasHeight - groundHeight; y >= 0; y -= 16) {
       drawDashedLine(groundGraphics, 0, y, canvasWidth, y, 2, 0x800080, 0.25)
        // Display the y value just under the purple line on the left
        const yText = new PIXI.Text(Math.round(y), { fontFamily: 'Arial', fontSize: 12, fill: 'black' });
        yText.alpha = 0.5;
        yText.x = 0;
        yText.y = y + 12;
        groundGraphics.addChild(yText);
    }

    app.stage.addChild(groundGraphics);
    return groundGraphics;
}

const staticParts = drawStaticParts();
createBuildings()


// Create buildings
function createBuildings() {
    //aircraft.reset();
    //aircraft.isCrashed = false

    //if (testModeCounter < 4) aircraft.x = -500;

    buildings = [];
    currentBuilding = 0;
    bonusPoints = 0;

    let gameLevel = levels.find(level => level.id === currentScore.level);
    if (!gameLevel) gameLevel = levels.find(level => level.id === 1);
    log("Game level id: " + gameLevel.id);
    allowedNumberOfBombs = gameLevel.numberOfBombs;
    buildingCount = gameLevel.buildingCount;

    // Place buildings in the centre outwards
    const totalWidth = buildingCount * buildingWidth + (buildingCount - 1) * buildingGap;
    const startX = (canvasWidth - totalWidth) / 2;

    for (let i = 0; i < buildingCount; i++) {
        let maxHeight = gameLevel.maxHeight;
        let minHeight = gameLevel.minHeight;

        if (gameLevel.ruleName.startsWith('alt')) {
            if (i % 2 === 0) {
                if (gameLevel.ruleName === 'alt') {
                    continue;
                }
                if (gameLevel.ruleName === 'alt2') {
                    minHeight = 2;
                    maxHeight = 2
                }
            }
        }

        const x = startX + i * (buildingWidth + buildingGap);
        let blocks = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        const building = new Building(x, blocks, currentScore, testModeCounter > 3)
        log("Add child building child i to container")
        app.stage.addChild(building.getBuildingContainer());
        buildings.push();
    }
}

function log(message) {
    if (testModeCounter === testModeActive) console.log(message)
}

// Resize function to maintain aspect ratio and handle padding
function resize() {
    const padding = 10;
    const aspectRatio = 10 / 7;
    const windowWidth = window.innerWidth - 2 * padding;
    const windowHeight = window.innerHeight - 2 * padding;

    let newWidth = windowWidth;
    let newHeight = newWidth / aspectRatio;

    if (newHeight > windowHeight) {
        newHeight = windowHeight;
        newWidth = newHeight * aspectRatio;
    }

    const scaleFactor = newWidth / app.screen.width;
    staticParts.scale.set(scaleFactor, 1);

    app.view.style.width = `${newWidth}px`;
    app.view.style.height = `${newHeight}px`;
    app.view.style.position = 'absolute';
    app.view.style.left = `${(window.innerWidth - newWidth) / 2}px`;
    app.view.style.top = `${(window.innerHeight - newHeight) / 2}px`;
}

// Call resize function initially and on window resize
resize();
window.addEventListener('resize', resize);
