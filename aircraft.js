import Const from './constants.js';

// Initial calculation on M1 Mac for time of aircraft to move 4 * width
const timeOverDistanceBaseLineMillis = 384;

class Aircraft {
    constructor(app, currentScore, speed, perfTestCallback, images) {
        this.app = app;
        this.mode = Const.READY;
        this.width = 62;
        this.imageHeight = 24;
        this.propWidth = 3;
        this.levelHeight = 16;
        this.startingPositionY = 38;
        this.halfWidth = this.width / 2;
        this.flightLevel = 1;
        this.y = this.startingPositionY;
        this.x = this.width * -2;
        this.speed = speed;
        this.originalSpeed = speed;
        this.planeImg = images.getImage("bomber");
        // change to sprite sheet
        this.propellerImgs = [images.getImage('propeller1'),
            images.getImage('propeller2'),
            images.getImage('propeller3'),
            images.getImage('propeller2')
        ].map(src => {
            return src;
        });

        this.container = new PIXI.Container();
        this.bombSightContainer = new PIXI.Container();
        this.propellerIndex = 0;
        this.propellerChange = 0;
        this.isPaused = false;
        this.rotationAngle = 0; // initial rotation angle is 0 degrees
        this.rotationSpeed = 5; // replace 5 with any value that works for your needs
        this.rotationTarget = 0;
        this.lineGraphics = new PIXI.Graphics();
        this.offscreenPerfTest = true;
        this.timeTest = 0;
        this.speedMultiplier = 1.0;
        this.perfTestCallback = perfTestCallback;
    }

    reset() {
        this.mode = Const.READY;
        this.flightLevel = 1;
        this.calculatePlayYPos();
        this.calculatedBombSightOpacity();
        this.levelFlight()
        this.x = this.width * -2;
        this.container.x = this.x;
        this.container.y = this.y;
        this.speed = this.originalSpeed;
    }

    getContainer() {
        const plane = new PIXI.Sprite(this.planeImg);
        plane.x = 0;
        plane.y = 0;
        plane.width = this.width;
        plane.height = this.imageHeight;
        const prop = new PIXI.Sprite(this.propellerImgs[0]);
        prop.x = this.width;
        prop.y = 0;
        prop.width = this.propWidth;
        prop.height = this.imageHeight;
        this.container.x = -120;
        this.container.y = this.startingPositionY;
        this.container.addChild(plane);
        this.container.addChild(prop);
        this.createDottedLine();
        return this.container;
    }

    createDottedLine() {
        // Set the alpha value to 0.5
        this.lineGraphics.lineStyle(2, 0xFFFFFF, 1.0, 0.5, true);
        this.lineGraphics.moveTo(0, 0);

        const screenHeight = this.app.screen.height;

        for (let i = 0; i < screenHeight; i += 10) {
            this.lineGraphics.lineTo(0, i);
            i += 5;
            this.lineGraphics.moveTo(0, i);
        }

        this.bombSightContainer.addChild(this.lineGraphics);
    }

    updatePosition() {
        if (this.offscreenPerfTest) {
            if (this.timeTest === 0) {
                console.log("performance orientation now at " + Date.now())
                this.timeTest = Date.now();
            }

            if (this.x + this.width >= -1) {
                const result = Date.now() - this.timeTest;
                console.log("performance result millis: " + result);
                this.speedMultiplier = result / timeOverDistanceBaseLineMillis
                console.log("speedMultiplier:" + this.speedMultiplier);
                this.speed = this.speedMultiplier * this.originalSpeed;
                this.originalSpeed = this.speed;
                console.log("Aircraft calculated speed setting: " + this.speed);
                this.setFlightMode(Const.NEW);
                this.x = this.width * -4;
                this.offscreenPerfTest = false;
                this.perfTestCallback();
            }
        }

        this.x = this.x + this.speed;
        if (this.x - this.width > this.app.screen.width) {
            if (this.mode === Const.FLYING) {
                this.flightLevel++;
                this.calculatePlayYPos()
                const opacity = this.calculatedBombSightOpacity();
            }
            this.x = -this.width;
        }

        this.container.x = this.x;
        this.container.y = this.y;
        this.bombSightContainer.x = this.x + this.halfWidth;
        this.bombSightContainer.y = this.y + this.imageHeight - 10;

        this.propellerIndex++;
        if (this.propellerIndex > 3) this.propellerIndex = 0;

        const oldSprite = this.container.children[1];
        const prop = new PIXI.Sprite(this.propellerImgs[this.propellerIndex]);
        prop.x = this.width;
        prop.y = 0;
        prop.width = this.propWidth;
        prop.height = this.imageHeight;

        this.container.addChildAt(prop, 1);
        this.container.removeChild(oldSprite);
    }

    calculatedBombSightOpacity() {
        const startY = 34;
        const endY = 500;
        const startingOpacity = 1.0;
        const opacityRange = startingOpacity;
        const exponent = 1.10; // Increase this value to make the line fade away more quickly
        const normalizedY = (endY - this.y) / (endY - startY);
        const opacity = Math.max(Math.pow(normalizedY, exponent) * opacityRange, 0);
        this.lineGraphics.alpha = opacity;
        return opacity;
    }

    step() {
        this.x += 1
    }

    stepAmount(amount) {
        this.x += amount
    }

    stepBack() {
        this.x -= 1
    }

    stepUp() {
        this.flightLevel--;
        this.calculatePlayYPos()
    }

    stepDown() {
        this.flightLevel++;
        this.calculatePlayYPos()
    }

    togglePause() {
        this.isPaused = !this.isPaused;

        if (this.mode === "landed" && !this.isPaused) {
            this.takeOff();
        }
    }

    setFlightMode(mode) {
        if (mode === this.mode) return;

        this.mode = mode;
        switch (mode) {
            case Const.FLYING:
                this.container.visible = true;
                this.bombSightContainer.visible = true;
                this.levelFlight();
                break;
            case Const.DESCENDING:
                this.bombSightContainer.visible = false;
                this.rotateClockwise();
                break;
            case Const.FLARE:
                this.rotateCounterClockwise();
                break;
            case Const.LANDED:
                this.speed = 0;
                break;
            case Const.READY:
                break;
            case Const.RESTART:
                break;
            case Const.NEW:
                break;
            case Const.CRASHED:
                this.container.visible = false;
                this.bombSightContainer.visible = false;
                break;
            default:
                console.log('Unknown flight mode error: ' + this.mode);
        }
    }

    descend() {
        this.setFlightMode(Const.DESCENDING)
    }

    flare() {
        this.setFlightMode(Const.FLARE)
    }

    landed() {
        this.setFlightMode(Const.LANDED)
    }

    calculatePlayYPos() {
        this.y = this.startingPositionY + (this.levelHeight * (this.flightLevel - 1));
    }

    update(canvasWidth) {
        if (!this.isPaused) {
            this.x += this.speed;
        }

        if (this.x > canvasWidth) {
            if (this.mode === Const.FLYING) {
                this.flightLevel++;
                this.calculatePlayYPos();
            }
            this.x = this.width * -1;
        }

        if (!this.isPaused)
            this.propellerChange++;
        else
            this.propellerIndex = 0;

        if (this.propellerChange % 3 === 0) {
            this.propellerIndex = (this.propellerIndex + 1) % this.propellerImgs.length;
        }
    }

    rotateCounterClockwise() {
        this.rotationTarget = -13;
        this.rotationSpeed = 0.2 * this.speedMultiplier;
        this.animateRotation();
    }

    rotateClockwise() {
        this.rotationTarget = 10;
        this.rotationSpeed = 0.2 * this.speedMultiplier;
        this.animateRotation();
    }

    levelFlight() {
        this.rotationTarget = 0;
        this.rotationSpeed = 0.1 * this.speedMultiplier;
        this.animateRotation();
    }

    animateRotation() {
        if (Math.abs(this.rotationTarget - this.rotationAngle) > this.rotationSpeed) {
            const angleDifference = this.rotationTarget - this.rotationAngle;
            const rotationDirection = angleDifference > 0 ? 1 : -1;
            this.rotationAngle += rotationDirection * this.rotationSpeed;
            requestAnimationFrame(() => this.animateRotation());
        } else {
            this.rotationAngle = this.rotationTarget;
        }

        // Apply the rotation to the container
        this.container.rotation = this.rotationAngle * (Math.PI / 180);
    }
}

export default Aircraft;
