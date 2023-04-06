import Const from "./constants.js";

class Panels {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.beginGameContainer = new PIXI.Container();
        this.retryContainer = new PIXI.Container();
        this.nextLevelContainer = new PIXI.Container();
    }

    showBeginGamePanel() {
        console.log("showBeginGamePanel")
        // Set the initial alpha of the retryContainer to 0 (invisible)
        this.beginGameContainer.alpha = 0;

        // Fade in the retryContainer using GSAP with a 3-second delay
        gsap.to(this.beginGameContainer, {
            alpha: 1, // Target alpha value
            duration: 0.0, // Animation duration in seconds
            delay: 1.5 // Delay before starting the animation in seconds
        });
    }

    showCrashedPanel(callback) {
        // Set the initial alpha of the retryContainer to 0 (invisible)
        this.retryContainer.alpha = 0;

        // Fade in the retryContainer using GSAP with a 3-second delay
        gsap.to(this.retryContainer, {
            alpha: 1, // Target alpha value
            duration: 0.5, // Animation duration in seconds
            delay: 1.5, // Delay before starting the animation in seconds
            onComplete: callback, // Function to call when the animation is completed
        });
    }

    showNextLevelPanel(callback) {
        console.log("showNextLevelPanel")
        // Set the initial alpha of the retryContainer to 0 (invisible)
        this.nextLevelContainer.alpha = 0;

        // Fade in the retryContainer using GSAP with a 3-second delay
        gsap.to(this.nextLevelContainer, {
            alpha: 1, // Target alpha value
            duration: 0.5, // Animation duration in seconds
            delay: 2.5, // Delay before starting the animation in seconds
            onComplete: callback
        });
    }

    hideCrashedPanel() {
        // Fade out the retryContainer using GSAP with a 1-second delay
        gsap.to(this.retryContainer, {
            alpha: 0, // Target alpha value
            duration: 1.0, // Animation duration in seconds
            delay: 0.5 // Delay before starting the animation in seconds
        });
    }

    hideNextLevelPanel() {
        // Fade out the retryContainer using GSAP with a 1-second delay
        gsap.to(this.nextLevelContainer, {
            alpha: 0, // Target alpha value
            duration: 1.0, // Animation duration in seconds
            delay: 0.5 // Delay before starting the animation in seconds
        });
    }

    hideBeginGameContainer() {
        // Fade out the retryContainer using GSAP with a 1-second delay
        gsap.to(this.beginGameContainer, {
            alpha: 0, // Target alpha value
            duration: 1.0, // Animation duration in seconds
            delay: 0.5 // Delay before starting the animation in seconds
        });
    }

    onFadeInComplete() {
        aircraft.setFlightMode(Const.RESTART)
    }

    getBeginGameContainer() {
        this.beginGameContainer.alpha = 0;

        // Create a semi-transparent rounded rectangle
        const rectWidth = 500;
        const rectHeight = 300;
        const rectX = (this.canvasWidth - rectWidth) / 2;
        const rectY = (this.canvasHeight - rectHeight) / 2;

// Create a semi-transparent rounded rectangle in the middle of the screen
        const rectangle = new PIXI.Graphics();
        rectangle.beginFill(0x000000, 0.80); // Set fill color and alpha for transparency
        rectangle.drawRoundedRect(rectX, rectY, rectWidth, rectHeight, 10); // Draw a 400x300 rounded rectangle
        rectangle.endFill();
        this.beginGameContainer.addChild(rectangle);

        // Create the "You Crashed!" text
        const crashStyle = new PIXI.TextStyle({
            fontFamily: 'space-font',
            fontSize: 50,
            fill: 'red',
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowDistance: 3,
        });
        const crashText = new PIXI.Text('- CITY BOMBER -', crashStyle);
        crashText.anchor.set(0.5);
        crashText.x = this.canvasWidth / 2;
        crashText.y = 250;
        this.beginGameContainer.addChild(crashText);

        // Create the "Click 'Enter' to try again" text
        const tryAgainStyle = new PIXI.TextStyle({
            fontFamily: 'space-font',
            fontSize: 30,
            fill: 'white',
        });
        const tryAgainText = new PIXI.Text('Click "Enter" to start game', tryAgainStyle);
        tryAgainText.anchor.set(0.5);
        tryAgainText.x = this.canvasWidth / 2;
        tryAgainText.y = 370;
        this.beginGameContainer.addChild(tryAgainText);

        return this.beginGameContainer;
    }

    getRetryContainer() {
        this.retryContainer.alpha = 0;

        // Create a semi-transparent rounded rectangle
        const rectWidth = 500;
        const rectHeight = 300;
        const rectX = (this.canvasWidth - rectWidth) / 2;
        const rectY = (this.canvasHeight - rectHeight) / 2;

// Create a semi-transparent rounded rectangle in the middle of the screen
        const rectangle = new PIXI.Graphics();
        rectangle.beginFill(0x000000, 0.80); // Set fill color and alpha for transparency
        rectangle.drawRoundedRect(rectX, rectY, rectWidth, rectHeight, 10); // Draw a 400x300 rounded rectangle
        rectangle.endFill();
        this.retryContainer.addChild(rectangle);

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
        crashText.x = this.canvasWidth / 2;
        crashText.y = 250;
        this.retryContainer.addChild(crashText);

        // Create the "Click 'Enter' to try again" text
        const tryAgainStyle = new PIXI.TextStyle({
            fontFamily: 'space-font',
            fontSize: 30,
            fill: 'white',
        });
        const tryAgainText = new PIXI.Text('Click "R" to try again', tryAgainStyle);
        tryAgainText.anchor.set(0.5);
        tryAgainText.x = this.canvasWidth / 2;
        tryAgainText.y = 370;
        this.retryContainer.addChild(tryAgainText);

        return this.retryContainer;
    }

    getNextLevelContainer() {
        this.nextLevelContainer.alpha = 0;

        // Create a semi-transparent rounded rectangle
        const rectWidth = 500;
        const rectHeight = 300;
        const rectX = (this.canvasWidth - rectWidth) / 2;
        const rectY = (this.canvasHeight - rectHeight) / 2;

// Create a semi-transparent rounded rectangle in the middle of the screen
        const rectangle = new PIXI.Graphics();
        rectangle.beginFill(0x000000, 0.80); // Set fill color and alpha for transparency
        rectangle.drawRoundedRect(rectX, rectY, rectWidth, rectHeight, 10); // Draw a 400x300 rounded rectangle
        rectangle.endFill();
        this.nextLevelContainer.addChild(rectangle);

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
        crashText.x = this.canvasWidth / 2;
        crashText.y = 250;
        this.nextLevelContainer.addChild(crashText);

        // Create the "Click 'Enter' to continue" text
        const tryAgainStyle = new PIXI.TextStyle({
            fontFamily: 'space-font',
            fontSize: 30,
            fill: 'white',
        });

        const tryAgainText = new PIXI.Text('Click "Enter" for next level', tryAgainStyle);
        tryAgainText.anchor.set(0.5);
        tryAgainText.x = this.canvasWidth / 2;
        tryAgainText.y = 370;
        this.nextLevelContainer.addChild(tryAgainText);

        return this.nextLevelContainer;
    }
}

export default Panels