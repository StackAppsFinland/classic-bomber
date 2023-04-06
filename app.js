import ImageLoader from './imageLoader.js';
import Score from './score.js';
import Building from './building.js';
import Aircraft from "./aircraft.js";
import BuildingExplosion from "./buildingExplosion.js";
import Bomb from "./bomb.js";
import levels from './levels.js';
import ParticleExplosion from "./particleExplosion.js";
import BonusMessage from "./bonusMessage.js";
import Const from "./constants.js";


WebFont.load({
    custom: {
        families: ['space-font'],
        urls: ['SHPinscher-Regular.otf']
    },
    active: function() {
        // Initialize your PIXI.js application here
        classBomber();
    }
});

/* function initPIXI() {
    // Your PIXI.js initialization and rendering code here
}

const imageLoader = new ImageLoader();
imageLoader.loadImages(() => {
    classBomber();
}); */

function classBomber() {
    const soundsBombFalling = new Howl({
        src: ['sounds/bomb-falling.mp3']
    });

    const explodeSound = new Howl({
        src: ['sounds/player-explode.wav']
    });

    const revealSound = new Howl({
        src: ['sounds/ascending_sound.wav'],
        volume: 0.1
    });

    const notes = [
        'sounds/note1.wav',
        'sounds/note2.wav',
        'sounds/note3.wav',
        'sounds/note4.wav',
        'sounds/note5x.wav',
        'sounds/note6.wav',
    ];

    const noteSounds = notes.map(note => {
        return new Howl({
            src: [note],
            sprite: {
                short: [0, 100], // start at 0ms, end at 100ms
            },
        });
    });

    const groundHeight = 10;
    const buildingGap = 8;
    const testModeActive = 4;
    const currentScore = new Score();
    let buildings = [];
    let currentBuilding = 0;
    let buildingCount = 0;
    let allowedNumberOfBombs = 1;
    let specialEffects = [];
    let directHitBonus = 0;
    let bonusPoints = 0;
    let testModeCounter = 4;
    const clouds = [];
    const cloudSpeed = 1;
    let initialDelay = 0;
    let aircraftSpeed = 1.35;

// Create a PixiJS Application
    const app = new PIXI.Application({
        width: 1000,
        height: 600,
        backgroundColor: 0x87CEEB, // Sky blue color
        resolution: window.devicePixelRatio || 1,
    });

    gsap.registerPlugin(PixiPlugin);

    handleInput()
// Add after app created
    const canvasWidth = app.screen.width;
    const canvasHeight = app.screen.height;
    drawScoreText();
    const scoreDisplay = drawScores();
    const bombsAvailableContainer = createBombsAvailable()
    app.stage.addChild(bombsAvailableContainer);

// Add the application view to the HTML body
    document.body.appendChild(app.view);

    const staticParts = drawStaticParts();
    const buildingsContainer = new PIXI.Container();
    app.stage.addChild(buildingsContainer);
    const buildingDamageContainer = new PIXI.Container();
    app.stage.addChild(buildingDamageContainer);
    const aircraft = new Aircraft(app, currentScore, aircraftSpeed, perfTestReady);
    const retryContainer = createRetryContainer();
    const nextLevelContainer = createNextLevelContainer();
    const bombContainer = new PIXI.Container();
    app.stage.addChild(bombContainer);

    createBuildings()


    app.stage.addChild(aircraft.getContainer());
    app.stage.addChild(aircraft.bombSightContainer);
    const bonusMessageContainer = new PIXI.Container();
    app.stage.addChild(bonusMessageContainer);
    app.stage.addChild(retryContainer);
    app.stage.addChild(nextLevelContainer);

    app.ticker.add(gameLoop);

    function perfTestReady() {
        aircraftSpeed = aircraft.originalSpeed;
        console.log(aircraftSpeed)
    }

// Define the game loop
    function gameLoop() {
        updateScoreDisplay();
        revealBuildings();
        updateAircraft();
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
        if (aircraft.mode === Const.FLYING) {
            if (bombContainer.children.length >= allowedNumberOfBombs) {
                return;
            }

            const bombX = aircraft.container.x + aircraft.halfWidth;

            if (bombX - 4 < 0 || bombX + 5 > canvasWidth)  return;

            const bombY = aircraft.container.y + 10;
            const bomb = new Bomb(bombX - 4, bombY, aircraftSpeed * 2);
            const bombSpriteContainer = bomb.getContainer();
            bombSpriteContainer.bombInstance = bomb;
            bombContainer.addChild(bombSpriteContainer);
            soundsBombFalling.play();

            updateBombsAvailable();
        }
    }

    function updateBombsAvailable() {
        const numChildren = bombsAvailableContainer.children.length;

        for (let i = 0; i < numChildren; i++) {
            bombsAvailableContainer.children[i].visible = i < allowedNumberOfBombs;
        }

        for (let i = 0; i < bombContainer.children.length; i++) {
            bombsAvailableContainer.children[i].visible = false;
        }
    }

    function updateBuildingDamage() {
        for (let j = 0; j < buildingsContainer.children.length; j++) {
            const buildingSpriteContainer = buildingsContainer.children[j];
            const building = buildingSpriteContainer.buildingInstance;
            building.removalBlock(noteSounds, app.stage, specialEffects);
        }
    }

    function updateBombs() {
        for (let i = bombContainer.children.length - 1; i >= 0; i--) {
            const bombSpriteContainer = bombContainer.children[i];
            bombSpriteContainer.bombInstance.updatePosition();

            if (bombSpriteContainer.y > canvasHeight) {
                bombContainer.removeChild(bombSpriteContainer);
                soundsBombFalling.stop();
                updateBombsAvailable()
                createExplosion(bombSpriteContainer.x, bombSpriteContainer.y - 10, 500, 40);
                bonusPoints = 0;
                directHitBonus = 0;
            } else {
                for (let j = 0; j < buildingsContainer.children.length; j++) {
                    const buildingRect = buildingsContainer.children[j].getBounds()
                    buildingRect.width = buildingRect.width - 6;
                    buildingRect.x = buildingRect.x + 3;

                    if (bombSpriteContainer.getBounds().intersects(buildingRect)) {
                        const buildingSpriteContainer = buildingsContainer.children[j];
                        const building = buildingSpriteContainer.buildingInstance;
                        const bounds = buildingSpriteContainer.getBounds();
                        soundsBombFalling.stop();

                        bombContainer.removeChild(bombSpriteContainer);
                        updateBombsAvailable()
                        building.setRemovalAmount(2);

                        // calculate distance from center of building.
                        const center = buildingRect.x + (buildingRect.width / 2)
                        const difference = Math.abs(bombSpriteContainer.x - center);

                        if (difference < 22) {
                            building.setRemovalAmount(1);
                            currentScore.increment(1);
                        }

                        if (difference < 16) {
                            building.setRemovalAmount(2);
                            currentScore.increment(2);
                        }

                        if (difference < 12) {
                            building.setRemovalAmount(3);
                            currentScore.increment(3);
                        }

                        if (difference < 8) {
                            building.setRemovalAmount(4);
                            currentScore.increment(4);
                        }

                        if (difference < 5) {
                            building.setRemovalAmount(6);
                            currentScore.increment(6);
                            directHitBonus++;
                            bonusPoints += 10;
                            if (directHitBonus > 2) {
                                const amount = directHitBonus * directHitBonus * 10;
                                currentScore.increment(amount);
                                bonusMessageContainer.addChild(new BonusMessage(bombSpriteContainer.x, bounds.y, amount + "!!"))
                                if (directHitBonus === 3) bonusMessageContainer.addChild(new BonusMessage(bombSpriteContainer.x, bounds.y + 30, "AWESOME!"))
                                if (directHitBonus === 4) bonusMessageContainer.addChild(new BonusMessage(bombSpriteContainer.x, bounds.y + 30, "ACCURACY!"))
                                if (directHitBonus === 5) bonusMessageContainer.addChild(new BonusMessage(bombSpriteContainer.x, bounds.y + 30, "AMAZING!"))
                                if (directHitBonus === 6) bonusMessageContainer.addChild(new BonusMessage(bombSpriteContainer.x, bounds.y + 30, "PHENOMENAL!"))
                                if (directHitBonus === 7) bonusMessageContainer.addChild(new BonusMessage(bombSpriteContainer.x, bounds.y + 30, "SUPREME!"))
                                if (directHitBonus > 7) bonusMessageContainer.addChild(new BonusMessage(bombSpriteContainer.x, bounds.y + 30, "GODLY!"))
                            } else {
                                bonusMessageContainer.addChild(new BonusMessage(bombSpriteContainer.x, bounds.y, bonusPoints + "!"))
                            }
                        } else {
                            bonusPoints = 0;
                            directHitBonus = 0;
                        }

                        createExplosion(bombSpriteContainer.x, bounds.y + 8, 1000, 100);
                        createBuildingExplosion(bombSpriteContainer.x, bounds.y + 20, 2000, 100);
                        break;
                    }
                }
            }
        }
    }

    function updateAircraft() {
        if (!(aircraft.mode === Const.FLYING ||
            aircraft.mode === Const.DESCENDING ||
            aircraft.mode === Const.FLARE ||
            aircraft.mode === Const.LANDED)) return;

        aircraft.updatePosition();

        if (aircraft.mode === Const.DESCENDING || aircraft.mode === Const.FLARE) {
            landAircraft()
            return
        }

        let isEmptyCount = 0;

        for (let j = 0; j < buildingsContainer.children.length; j++) {
            if (buildingsContainer.children[j].children.length === 0) {
                isEmptyCount++;
                continue;
            }

            const buildingRect = buildingsContainer.children[j].getBounds()
            buildingRect.width = buildingRect.width - 6;
            buildingRect.x = buildingRect.x + 3;

            if (aircraft.container.getBounds().intersects(buildingRect)) {
                explodeSound.play();
                aircraft.setFlightMode(Const.CRASHED);
                createExplosion(aircraft.x + aircraft.width, aircraft.y + 8, 1500, 200);
                createBuildingExplosion(aircraft.x + aircraft.width, aircraft.y + 8, 2500, 80);
                buildingsContainer.children[j].buildingInstance.setRemovalAmount(2);
                showCrashedPanel();
            }
        }

        if (isEmptyCount === buildingsContainer.children.length) {
            if (aircraft.mode === Const.FLYING) {
                aircraft.setFlightMode(Const.DESCENDING);
                showNextLevelPanel();
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

    function landAircraft() {
        if (aircraft.mode === Const.DESCENDING) {

            if (aircraft.y < 501) {
                aircraft.y = aircraft.y + aircraft.speed / 2.5;
            }
            if (aircraft.y > 500 && aircraft.y < 531) {
                aircraft.y = aircraft.y + aircraft.speed / 3.0;
            }
            if (aircraft.y > 530) {
                aircraft.y = aircraft.y + aircraft.speed / 3.5;
                aircraft.flare();
            }
        }

        if (aircraft.mode === Const.FLARE) {
            aircraft.y = aircraft.y + aircraft.speed / 4.0;
            if (aircraft.y + aircraft.imageHeight > canvasHeight + 2) {
                aircraft.y = canvasHeight - aircraft.imageHeight + 2;

                if (aircraft.x > 780 && aircraft.x < 921) {
                    aircraft.speed = aircraft.speed - 0.01
                    if (aircraft.speed <= 0) {
                        aircraft.speed = 0;
                        aircraft.landed();
                        return;
                    }
                }

                if (aircraft.x > 920 && aircraft.x < 930) {
                    aircraft.speed = 0;
                    aircraft.landed();
                }
            }
        }
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

            if (event.code === 'Enter' && (aircraft.mode === Const.NEXT || aircraft.mode === Const.DESCENDING ||
                aircraft.mode === Const.FLARE || aircraft.mode === Const.LANDED)) {
                currentScore.level = currentScore.level + 1;

                if (currentScore.level > levels.length - 1) {
                    currentScore.level = 1;
                }

                createBuildings();
                hideNextLevelPanel();
            }

            if (event.code === 'KeyR' && aircraft.mode === Const.RESTART) {
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
                    aircraft.setFlightMode(Const.FLYING);
                    aircraft.speed = aircraftSpeed;
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
                    currentScore.level = currentScore.level - 1;
                    if (currentScore.level < 1) currentScore.level = levels.length;
                    createBuildings();
                }
                if (event.code === 'KeyJ') {
                    createBuildings();
                }
            }
        });
    }

    let playingForBuilding = null;
    function revealBuildings() {
        initialDelay++;
        if (initialDelay > 60) {
            const unrevealedBuilding = buildings.find(building => !building.isRevealed);

            if (unrevealedBuilding) {
                if (playingForBuilding !== unrevealedBuilding) {
                    playingForBuilding = unrevealedBuilding;
                    revealSound.stop();
                    revealSound.play();
                }
                unrevealedBuilding.reveal(16);
            } else {
                if (aircraft.mode === Const.READY) {
                    revealSound.stop();
                    aircraft.setFlightMode(Const.FLYING);
                }
            }
        }
    }

    function drawScoreText() {
        const scoreStyle = new PIXI.TextStyle({
            fontFamily: 'space-font',
            fontSize: 20,
            fill: 'DimGrey',
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowDistance: 1.5,
        });

        const scoreText = new PIXI.Text("SCORE:", scoreStyle);
        scoreText.x = 10;
        scoreText.y = 4;

        const levelText = new PIXI.Text("LEVEL:", scoreStyle);
        levelText.x = 350;
        levelText.y = 4;

        const highScoreText = new PIXI.Text("HIGH SCORE:", scoreStyle);
        highScoreText.x = 770;
        highScoreText.y = 4;

        app.stage.addChild(scoreText, levelText, highScoreText);
    }

    function drawScores() {
        const scoreStyle = new PIXI.TextStyle({
            fontFamily: 'space-font',
            fontSize: 20,
            fill: 0x0818A8,
            dropShadow: true,
            dropShadowColor: 0xeeeeee,
            dropShadowDistance: 1,
        });

        const scoreValue = new PIXI.Text("" + currentScore.score, scoreStyle);
        scoreValue.x = 86;
        scoreValue.y = 4;

        const levelValue = new PIXI.Text("" + currentScore.level, scoreStyle);
        levelValue.x = 422;
        levelValue.y = 4;

        const highScoreValue = new PIXI.Text("" + currentScore.highScore, scoreStyle);
        highScoreValue.x = 893;
        highScoreValue.y = 4;

        app.stage.addChild(scoreValue, levelValue, highScoreValue);
        return {scoreValue, levelValue, highScoreValue};
    }

    function updateScoreDisplay() {
        scoreDisplay.scoreValue.text = "" + currentScore.score;
        scoreDisplay.levelValue.text = "" + currentScore.level;
        scoreDisplay.highScoreValue.text = "" + currentScore.highScore;
    }

    function createBombsAvailable() {
        const bombCount = 3;
        const bombTexture = PIXI.Texture.from('images/bomb.png');
        const bombContainer = new PIXI.Container();

        for (let i = 0; i < bombCount; i++) {
            const bomb = new PIXI.Sprite(bombTexture);
            bomb.width = 12; // Set the bomb width
            bomb.height = 22; // Set the bomb height

            // Calculate x position
            bomb.x = 600 + i * 22;
            bomb.y = 2; // Place the bomb at the top of the screen

            bombContainer.addChild(bomb);
        }

        return bombContainer;
    }

    function showCrashedPanel() {
        // Set the initial alpha of the retryContainer to 0 (invisible)
        retryContainer.alpha = 0;

        // Fade in the retryContainer using GSAP with a 3-second delay
        gsap.to(retryContainer, {
            alpha: 1, // Target alpha value
            duration: 0.5, // Animation duration in seconds
            delay: 1.5, // Delay before starting the animation in seconds
            onComplete: onFadeInComplete, // Function to call when the animation is completed
        });
    }

    function showNextLevelPanel() {
        // Set the initial alpha of the retryContainer to 0 (invisible)
        nextLevelContainer.alpha = 0;

        // Fade in the retryContainer using GSAP with a 3-second delay
        gsap.to(nextLevelContainer, {
            alpha: 1, // Target alpha value
            duration: 0.5, // Animation duration in seconds
            delay: 2.5 // Delay before starting the animation in seconds
        });

        landAircraft()
    }

    function hideCrashedPanel() {
        // Fade out the retryContainer using GSAP with a 1-second delay
        gsap.to(retryContainer, {
            alpha: 0, // Target alpha value
            duration: 1.0, // Animation duration in seconds
            delay: 0.5 // Delay before starting the animation in seconds
        });
    }

    function hideNextLevelPanel() {
        // Fade out the retryContainer using GSAP with a 1-second delay
        gsap.to(nextLevelContainer, {
            alpha: 0, // Target alpha value
            duration: 1.0, // Animation duration in seconds
            delay: 0.5 // Delay before starting the animation in seconds
        });
    }

    function onFadeInComplete() {
        aircraft.setFlightMode(Const.RESTART)
    }

    function createRetryContainer() {
        const retryContainer = new PIXI.Container();
        retryContainer.alpha = 0;

        // Create a semi-transparent rounded rectangle
        const rectWidth = 500;
        const rectHeight = 300;
        const rectX = (canvasWidth - rectWidth) / 2;
        const rectY = (canvasHeight - rectHeight) / 2;

// Create a semi-transparent rounded rectangle in the middle of the screen
        const rectangle = new PIXI.Graphics();
        rectangle.beginFill(0x000000, 0.80); // Set fill color and alpha for transparency
        rectangle.drawRoundedRect(rectX, rectY, rectWidth, rectHeight, 10); // Draw a 400x300 rounded rectangle
        rectangle.endFill();
        retryContainer.addChild(rectangle);

        // Create the "You Crashed!" text
        const crashStyle = new PIXI.TextStyle({
            fontFamily: 'space-font',
            fontSize: 50,
            fill: 'red',
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowDistance: 3,
        });
        const crashText = new PIXI.Text('YOU CRASHED!', crashStyle);
        crashText.anchor.set(0.5);
        crashText.x = app.screen.width / 2;
        crashText.y = 250;
        retryContainer.addChild(crashText);

        // Create the "Click 'Enter' to try again" text
        const tryAgainStyle = new PIXI.TextStyle({
            fontFamily: 'space-font',
            fontSize: 30,
            fill: 'white',
        });
        const tryAgainText = new PIXI.Text('Click "R" to try again', tryAgainStyle);
        tryAgainText.anchor.set(0.5);
        tryAgainText.x = app.screen.width / 2;
        tryAgainText.y = 370;
        retryContainer.addChild(tryAgainText);

        return retryContainer;
    }

    function createNextLevelContainer() {
        const nextLevelContainer = new PIXI.Container();
        nextLevelContainer.alpha = 0;

        // Create a semi-transparent rounded rectangle
        const rectWidth = 500;
        const rectHeight = 300;
        const rectX = (canvasWidth - rectWidth) / 2;
        const rectY = (canvasHeight - rectHeight) / 2;

// Create a semi-transparent rounded rectangle in the middle of the screen
        const rectangle = new PIXI.Graphics();
        rectangle.beginFill(0x000000, 0.80); // Set fill color and alpha for transparency
        rectangle.drawRoundedRect(rectX, rectY, rectWidth, rectHeight, 10); // Draw a 400x300 rounded rectangle
        rectangle.endFill();
        nextLevelContainer.addChild(rectangle);

        // Create the "You Crashed!" text
        const crashStyle = new PIXI.TextStyle({
            fontFamily: 'space-font',
            fontSize: 50,
            fill: 'red',
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowDistance: 3,
        });
        const crashText = new PIXI.Text('LEVEL COMPLETE!', crashStyle);
        crashText.anchor.set(0.5);
        crashText.x = app.screen.width / 2;
        crashText.y = 250;
        nextLevelContainer.addChild(crashText);

        // Create the "Click 'Enter' to continue" text
        const tryAgainStyle = new PIXI.TextStyle({
            fontFamily: 'space-font',
            fontSize: 30,
            fill: 'white',
        });

        const tryAgainText = new PIXI.Text('Click "Enter" for next level', tryAgainStyle);
        tryAgainText.anchor.set(0.5);
        tryAgainText.x = app.screen.width / 2;
        tryAgainText.y = 370;
        nextLevelContainer.addChild(tryAgainText);

        return nextLevelContainer;
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

        // Draw grass
        drawDashedLine(groundGraphics, 0, canvasHeight - groundHeight, canvasWidth,
            canvasHeight - groundHeight, 1, 0x006400, 1.0)

        // Draw the faded purple test lines
        /* for (let y = canvasHeight - groundHeight; y >= 0; y -= 16) {
            drawDashedLine(groundGraphics, 0, y, canvasWidth, y, 2, 0x800080, 0.25)
             // Display the y value just under the purple line on the left
             const yText = new PIXI.Text(Math.round(y), { fontFamily: 'space-font', fontSize: 12, fill: 'black' });
             yText.alpha = 0.5;
             yText.x = 0;
             yText.y = y + 12;
             groundGraphics.addChild(yText);
         }
         */
        app.stage.addChild(groundGraphics);
        return groundGraphics;
    }

// Create buildings
    function createBuildings() {
        for (let i = buildingsContainer.children.length - 1; i >= 0; i--) {
            const child = buildingsContainer.children[i];
            child.destroy();
        }

        hideCrashedPanel();
        buildingsContainer.removeChildren();
        buildingDamageContainer.removeChildren()

        buildings = [];
        currentBuilding = 0;
        bonusPoints = 0;
        initialDelay = 0;

        let gameLevel = levels.find(level => level.id === currentScore.level);
        if (!gameLevel) gameLevel = levels.find(level => level.id === 1);
        log("Game level id: " + gameLevel.id);
        allowedNumberOfBombs = gameLevel.numberOfBombs;
        updateBombsAvailable();

        buildingCount = gameLevel.buildingCount;

        // Place buildings in the centre outwards
        const totalWidth = buildingCount * Const.BUILDING_WIDTH + (buildingCount - 1) * buildingGap;
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

            const x = startX + i * (Const.BUILDING_WIDTH + buildingGap);
            let blocks = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
            const building = new Building(x, canvasHeight - groundHeight, blocks)
            const buildingSpriteContainer = building.getBuildingContainer();
            buildingSpriteContainer.buildingInstance = building;
            buildingsContainer.addChild(buildingSpriteContainer)
            buildingDamageContainer.addChild(building.damageContainer);
            buildings.push(building);
        }

        if (aircraft) aircraft.reset();
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

    resize();
    window.addEventListener('resize', resize);
}


