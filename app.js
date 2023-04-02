import Score from './score.js';
import Building from './building.js';
import Aircraft from "./aircraft.js";
import BuildingExplosion from "./buildingExplosion.js";
import Bomb from "./bomb.js";
import levels from './levels.js';
import ParticleExplosion from "./particleExplosion.js";

const groundHeight = 10;
const buildingGap = 8;
const buildingWidth = 40;
const testModeActive = 4;
const currentScore = new Score();
let buildings = [];
let currentBuilding = 0;
let buildingCount = 0;
let allowedNumberOfBombs = 1;
let specialEffects = [];
let destroying = [];
let directHitBonus = 0;
let bonusPoints = 0;
let testModeCounter = 4;
let bombDropStartTime = 0;
const clouds = [];
const cloudSpeed = 1;
let initialDelay = 0;




// Create a PixiJS Application
const app = new PIXI.Application({
    width: 1000,
    height: 600,
    backgroundColor: 0x87CEEB, // Sky blue color
    resolution: window.devicePixelRatio || 1,
});

handleInput()
// Add after app created
const canvasWidth = app.screen.width;
const canvasHeight = app.screen.height;
const scoreDisplay = drawScoreDisplay();

// Add the application view to the HTML body
document.body.appendChild(app.view);

const staticParts = drawStaticParts();
const buildingsContainer = new PIXI.Container();
app.stage.addChild(buildingsContainer);
const buildingDamageContainer = new PIXI.Container();
app.stage.addChild(buildingDamageContainer);

createBuildings()

// add bombs before aircraft for them to appear behind
const bombContainer = new PIXI.Container();
app.stage.addChild(bombContainer);

const aircraft = new Aircraft(app, currentScore, 1.5);
app.stage.addChild(aircraft.getContainer());
app.stage.addChild(aircraft.bombSightContainer);
app.ticker.add(gameLoop);

// Define the game loop
function gameLoop(delta) {
    updateScoreDisplay();

    revealBuildings();
    aircraft.updatePosition();
    updateBombs();
    updateBuildingDamage();
    updateSpecialEffects();
}

function updateSpecialEffects() {
    for (let i = specialEffects.length - 1; i >= 0; i--) {
        specialEffects[i].update();

        // Clean up finished explosions
        if (specialEffects[i].isFinished) {
            app.stage.removeChild(specialEffects[i].container);
            specialEffects.splice(i, 1);
        }
    }
}

function dropBomb() {
    const bombX = aircraft.container.x + aircraft.halfWidth;
    const bombY = aircraft.container.y + 10;
    const bomb = new Bomb(bombX - 4, bombY, 4);
    const bombSpriteContainer = bomb.getContainer();
    bombSpriteContainer.bombInstance = bomb;
    bombContainer.addChild(bombSpriteContainer);
}

function updateBuildingDamage() {
    for (let j = 0; j < buildingsContainer.children.length; j++) {
        const buildingSpriteContainer = buildingsContainer.children[j];
        const building = buildingSpriteContainer.buildingInstance;
        building.removalBlock(app.stage, specialEffects);
    }
}

function updateBombs() {
    for (let i = bombContainer.children.length - 1; i >= 0; i--) {
        const bombSpriteContainer = bombContainer.children[i];
        bombSpriteContainer.bombInstance.updatePosition();

        if (bombSpriteContainer.y > canvasHeight) {
            bombContainer.removeChild(bombSpriteContainer);
        } else {
            for (let j = 0; j < buildingsContainer.children.length; j++) {
                const buildingRect = buildingsContainer.children[j].getBounds()
                buildingRect.width = buildingRect.width - 6;
                buildingRect.x = buildingRect.x + 3;

                if (bombSpriteContainer.getBounds().intersects(buildingRect)) {
                    const buildingSpriteContainer = buildingsContainer.children[j];
                    const building = buildingSpriteContainer.buildingInstance;
                    const bounds = buildingSpriteContainer.getBounds();

                    bombContainer.removeChild(bombSpriteContainer);
                    building.setRemovalAmount(2);

                    // calculate distance from center of building.
                    const center = buildingRect.x + (buildingRect.width / 2)
                    const difference = Math.abs(bombSpriteContainer.x - center);

                    if (difference < 15) {
                        building.setRemovalAmount(2);
                        currentScore.add(1);
                        console.log("< 15 diff - 2 blocks !")
                    }

                    if (difference < 10) {
                        building.setRemovalAmount(4);
                        console.log("< 10 diff - 4 blocks !")
                        currentScore.add(2);
                    }

                    if (difference < 7) {
                        building.setRemovalAmount(6);
                        console.log("< 6 diff - 6 blocks !")
                        currentScore.add(4);
                    }

                    if (difference < 4) {
                        console.log("< 4 diff  bonus 8")
                        building.setRemovalAmount(8);
                        currentScore.add(8);
                        directHitBonus++;
                        bonusPoints += 10;
                        if (directHitBonus > 2) {
                            const amount = directHitBonus * directHitBonus * 10;
                            currentScore.add(amount);
                            //specialEffects.push(new Message("+" + amount + "!", center, building.topBlockY));
                        } else {
                            //specialEffects.push(new Message("+10!", center, building.topBlockY));
                        }
                    } else {
                        directHitBonus = 0;
                    }

                    // hitBuildingTop = true;
                    createExplosion(bombSpriteContainer.x, bounds.y + 8, 1000, 100);
                    createBuildingExplosion(bombSpriteContainer.x, bounds.y + 16, 2000, 100);
                    // specialEffects.push(new ParticleExplosion(bomb.x, building.topBlockY, 100, 50));
                    // building.startRemove();
                    // destroying.push(building);
                    break;
                }


                // buildingSprite.removeChildAt(buildingSprite.children.length - 1);
            }
        }
    }
}

function createBuildingExplosion(x, y, duration, numberOfParticles) {
    const explosion = new BuildingExplosion(x, y, duration, numberOfParticles);
    app.stage.addChild(explosion.container);
    specialEffects.push(explosion);
}

function createExplosion(x, y, duration, numberOfParticles) {
    const explosion = new ParticleExplosion(x, y, duration, numberOfParticles);
    app.stage.addChild(explosion.container);
    specialEffects.push(explosion);
}

function handleInput() {
    window.addEventListener('keydown', (event) => {
        if (event.code === 'KeyT') {
            testModeCounter++;

            if (testModeCounter > 3) {
                aircraft.speed = 0;
            }

            return;
        }

        if (testModeCounter <= 3)
            testModeCounter = 0;

        if (event.code === 'Space') {
            dropBomb();
        }

        if (event.code === 'Enter' && aircraft.mode !== 'flying') {
            currentScore.level = currentScore.level + 1;
            createBuildings();
        }

        if (event.code === 'KeyR' && aircraft.isCrashed) {
            createBuildings();
        }

        if (event.code === "KeyP") {
            // skip to next level when complete without watching plane land
        }

        if (event.code === 'KeyP') {
            aircraft.togglePause()
        }

        if (testModeCounter > 3) {
            if (event.code === 'Escape') {
                aircraft.isPaused = false;
                testModeCounter = 0;
            }
            if (event.code === 'ArrowRight') {
                aircraft.step()
            }
            if (event.code === 'ArrowLeft') {
                aircraft.stepBack()
            }
            if (event.code === 'KeyX') {
                aircraft.stepAmount(10)
            }
            if (event.code === 'KeyZ') {
                aircraft.stepAmount(-10)
            }
            if (event.code === 'KeyE') {
                aircraft.levelFlight()
            }
            if (event.code === 'ArrowDown') {
                aircraft.stepDown()
            }
            if (event.code === 'ArrowUp') {
                aircraft.stepUp()
            }
            if (event.code === 'KeyQ') {
                aircraft.rotateCounterClockwise()
            }
            if (event.code === 'KeyW') {
                aircraft.rotateClockwise()
            }
            if (event.code === 'ArrowUp') {
                aircraft.stepUp()
            }
            if (event.code === 'KeyL') {
                currentScore.level = currentScore.level + 1;
                if (currentScore.level > levels.length) currentScore.level = 1;
                createBuildings();
            }
            if (event.code === 'KeyK') {
                currentScore.level = currentScore.level -1;
                if (currentScore.level < 1) currentScore.level = levels.length;
                createBuildings();
            }
            if (event.code === 'KeyJ') {
                createBuildings();
            }
        }
    });
}

function revealBuildings() {
    initialDelay++;
    if (initialDelay > 60) {

        const unrevealedBuilding = buildings.find(building => !building.isRevealed);

        if (unrevealedBuilding) {
            unrevealedBuilding.reveal(16);
        }
    }
}

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

// Create buildings
function createBuildings() {
    for (let i = buildingsContainer.children.length - 1; i >= 0; i--) {
        const child = buildingsContainer.children[i];
        child.destroy();
    }

    buildingsContainer.removeChildren();
    //aircraft.reset();
    //aircraft.isCrashed = false

    //if (testModeCounter < 4) aircraft.x = -500;

    buildings = [];
    currentBuilding = 0;
    bonusPoints = 0;

    currentScore.level = 15;
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
        const building = new Building(x, canvasHeight - groundHeight, blocks)
        const buildingSpriteContainer = building.getBuildingContainer();
        buildingSpriteContainer.buildingInstance = building;
        buildingsContainer.addChild(buildingSpriteContainer)
        buildingDamageContainer.addChild(building.damageContainer);
        buildings.push(building);
    }
}

function log(message) {
    if (testModeCounter === testModeActive) console.log(message)
}

// Resize function to maintain aspect ratio and handle padding
function resize() {
    const padding = 50;
    const aspectRatio = 10 / 6;
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
