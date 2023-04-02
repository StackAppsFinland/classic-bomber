import Score from './score.js';

class Aircraft {
    constructor(app, currentScore, speed) {
        this.app = app;
        this.mode = "flying";
        this.width = 62;
        this.imageHeight = 24;
        this.propWidth = 3;
        this.levelHeight = 16;
        this.startingPositionY = 38;
        this.halfWidth = this.width / 2;
        this.flightLevel = 1;
        this.y = this.startingPositionY;
        this.x = this.width * -1;
        this.speed = speed;
        this.planeImg = PIXI.Texture.from(`images/bomber.png`);
        this.propellerImgs = ['images/propeller1.png', 'images/propeller2.png', 'images/propeller3.png', 'images/propeller2.png'].map(src => {
            const img = PIXI.Texture.from(src);
            return img;
        });

        this.container = new PIXI.Container();
        this.bombSightContainer = new PIXI.Container();
        this.propellerIndex = 0;
        this.propellerChange = 0;
        this.isPaused = false;
        this.isCrashed = false;
        this.rotationAngle = 0; // initial rotation angle is 0 degrees
        this.currentScore = currentScore;
        this.rotationSpeed = 5; // replace 5 with any value that works for your needs
        this.rotationTarget = 0;
    }

    reset() {
        this.mode = "flying"
        this.flightLevel = 1;
        this.calculatePlayYPos();
        this.levelFlight()
        this.x = this.width * -1;
        this.speed = 4.0;
        this.isCrashed = false;
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
        const lineGraphics = new PIXI.Graphics();
        // Set the alpha value to 0.5
        lineGraphics.lineStyle(2, 0xFFFFFF, 0.5, 0.5, true);
        lineGraphics.moveTo(0, 0);

        const screenHeight = this.app.screen.height;

        for (let i = 0; i <screenHeight; i += 10) {
            lineGraphics.lineTo(0, i);
            i += 5;
            lineGraphics.moveTo(0, i);
        }

        this.bombSightContainer.addChild(lineGraphics);
    }

    updatePosition() {
        this.x = this.x + this.speed;
        if (this.x - this.width > this.app.screen.width) {
            this.x = -this.width;
            this.flightLevel++;
            this.calculatePlayYPos()
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

    draw() {
        if (this.isCrashed) return;

        const cx = this.x + this.halfWidth;
        const cy = this.y + this.imageHeight / 2;

        this.planeImg.x = -this.width / 2;
        this.planeImg.y = -this.imageHeight / 2;
        this.planeImg.width = this.width;
        this.planeImg.height = this.imageHeight;
        app.stage.addChild(this.planeImg);

// Draw the propeller image, offset from the center of the plane image
        const propellerSprite = this.propellerImgs[this.propellerIndex];
        propellerSprite.x = this.width / 2;
        propellerSprite.y = -this.imageHeight / 2;
        propellerSprite.width = this.propWidth;
        propellerSprite.height = this.imageHeight;
        app.stage.addChild(propellerSprite);

        if (!this.isCrashed) {
            // Draw bomb sight fading as it moves down
            const decreaseAlpha = this.currentScore.level * 15;
            let alpha = (1.0 - (this.y / (500 - decreaseAlpha)))
            if (alpha < 0.0) alpha = 0.0
            this.ctx.strokeStyle = 'rgba(224,224,224,' + alpha + ')';
            this.ctx.setLineDash([4, 1]);
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + this.halfWidth, this.y + 12);
            this.ctx.lineTo(this.x + this.halfWidth, this.ctx.canvas.height - 10);
            this.ctx.stroke();
        }
    }

    crashed() {
        this.isCrashed = true;
        this.isPaused = true;
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
        console.log(mode)
        switch (mode) {
            case 'flying':
                this.levelFlight();
                break;
            case 'descending':
                this.rotateClockwise();
                break;
            case 'flare':
                this.rotateCounterClockwise();
                break;
            case 'landed':
                this.speed = 0;
                setTimeout(() => {
                    this.setFlightMode("ready")
                }, 3000);
                break;
            case 'ready':
                break;
            default:
                console.log('Unknown flight mode error');
        }
    }

    descend() {
        this.setFlightMode("descending")
    }

    flare() {
        this.setFlightMode("flare")
    }

    landed() {
        this.setFlightMode("landed")
    }

    calculatePlayYPos() {
        this.y = this.startingPositionY + (this.levelHeight * (this.flightLevel - 1));
    }

    update(canvasWidth) {
        if (!this.isPaused) {
            this.x += this.speed;
        }

        if (this.x > canvasWidth) {
            if (this.mode === 'flying') {
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
        this.rotationSpeed = 0.2;
        this.animateRotation();
    }

    rotateClockwise() {
        this.rotationTarget = 10;
        this.rotationSpeed = 0.2;
        this.animateRotation();
    }

    levelFlight() {
        this.rotationTarget = 0;
        this.rotationSpeed = 0.1;
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
    }
}

export default Aircraft;
