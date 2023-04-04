class BonusMessage extends PIXI.Container {
    constructor(x, y, message) {
        super();

        this.x = x;
        this.y = y;

        this.message = message;
        this.textObject = new PIXI.Text(message, {
            fontFamily: 'space-font',
            fontSize: 1,
            fill: 0xff0000,
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowDistance: 3,
        });

        // Set the anchor to the center of the text object
        this.textObject.anchor.set(0.5, 0.5);

        this.addChild(this.textObject);
        this.animateText();
    }

    animateText() {
        const fontSizeIncrease = 25;
        const riseDistance = -20;
        const riseDuration = 1 / 3; // In seconds
        const flashDuration = 1.5; // In seconds

        const riseTween = gsap.to(this, {
            y: this.y + riseDistance,
            duration: riseDuration,
            ease: 'power2.out',
            onUpdate: () => {
                const progress = riseTween.progress();
                this.textObject.style.fontSize = 1 + progress * (fontSizeIncrease - 1);
            },
            onComplete: () => {
                gsap.to(this.textObject, {
                    alpha: 0,
                    duration: flashDuration / 4,
                    repeat: 3,
                    yoyo: true,
                    onComplete: () => {
                        this.parent.removeChild(this);
                    },
                });
            },
        });
    }

}

export default BonusMessage;
