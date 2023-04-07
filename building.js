import BuildingExplosion from "./buildingExplosion.js";
import Const from "./constants.js"

class Building {
    constructor(x, y, blocks, speedMultiplier, images) {
        this.x = x;
        this.y = y;
        this.blocks = blocks;
        this.baseImg = PIXI.Texture.from(images.getRandomImage("base"));
        this.roofImg = PIXI.Texture.from(images.getRandomImage("roof"));
        this.storeyImg = PIXI.Texture.from(images.getRandomImage("storey"));
        this.container = new PIXI.Container();
        this.damageContainer = new PIXI.Container();
        this.isRevealed = false;
        this.revealY = this.y;
        this.removalAmount = 0;
        this.noteIndex = 0;
        this.lastMillis = 0;
        this.topBlockY = 0;
        this.damageRectangles = [];
        this.revealSpeed = 170;
        this.speedMultiplier = speedMultiplier;
        this.callbackWhenRemovalComplete = null;
    }

    getBuildingContainer() {
        for (let i = 0; i < this.blocks; i++) {
            const posY = this.y - (i + 1) * Const.BLOCK_HEIGHT;

            let blockTexture;
            if (i === 0) {
                blockTexture = this.baseImg;
            } else if (i === this.blocks - 1) {
                blockTexture = this.roofImg;
            } else {
                blockTexture = this.storeyImg;
            }

            const blockSprite = new PIXI.Sprite(blockTexture);
            blockSprite.x = this.x;
            blockSprite.y = posY;
            blockSprite.width = Const.BUILDING_WIDTH;
            blockSprite.height = Const.BLOCK_HEIGHT;
            this.container.addChild(blockSprite);
            this.topBlockY = posY;
        }

        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(this.x, this.y, Const.BUILDING_WIDTH, this.y);
        mask.endFill();
        this.container.mask = mask;

        return this.container;
    }

    reveal() {
        const mask = this.container.mask;

        this.revealY = this.revealY - Const.BLOCK_HEIGHT;
        if (this.revealY < this.topBlockY) {
            this.revealY = this.topBlockY;
            this.container.mask = null;
            mask.destroy();
            this.isRevealed = true;
            return;
        }

        mask.beginFill(0xffffff);
        mask.drawRect(this.x, this.revealY, Const.BUILDING_WIDTH, this.y);
        mask.endFill();
    }

    setRemovalAmount(amount) {
        this.removalAmount = amount;
        this.noteIndex = 0;
    }

    removalComplete(callback) {
        this.callbackWhenRemovalComplete = callback;
    }

    removalBlock(notes, stage, specialEffects) {
        const currentMillis = Date.now();

        if (currentMillis > this.lastMillis) {
            this.lastMillis = currentMillis + this.revealSpeed;
            if (this.removalAmount > 0 && this.container.children.length > 0) {
                notes[this.noteIndex++].play('short');
                const blockSprite = this.container.children[this.container.children.length - 1];
                this.container.removeChild(blockSprite);

                const explosion = new BuildingExplosion(blockSprite.x + Math.random() * Const.BUILDING_WIDTH,
                    blockSprite.y + Const.BLOCK_HEIGHT, 2300, 50, this.speedMultiplier);
                stage.addChild(explosion.container);
                specialEffects.push(explosion);
                this.removalAmount--;

                if (this.container.children.length === 0) {
                    this.removalAmount = 0;
                    this.damageContainer.removeChildren();
                    try {
                        this.callbackWhenRemovalComplete();
                    }
                    catch(ex) {}
                } else if (this.removalAmount <= 0) {
                    this.createDamagedArea();
                    try {
                        this.callbackWhenRemovalComplete();
                    }
                    catch(ex) {}
                }
            }
        }
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    createDamagedArea() {
        this.damageContainer.removeChildren();

        if (this.container.children.length < 1) {
            return;
        }

        const blockSprite = this.container.children[this.container.children.length - 1];

        if (blockSprite) {
            let damageCount = this.randomInt(40, 50);

            for (let i = 0; i < damageCount; i++) {
                const rectangle = new PIXI.Graphics();
                rectangle.beginFill(0x87ceeb);
                rectangle.drawRect(blockSprite.x + this.randomInt(0, 42) - 2, blockSprite.y + this.randomInt(-3, 15),
                    this.randomInt(1, 4), this.randomInt(1, 4));
                rectangle.endFill();
                this.damageContainer.addChild(rectangle);
                this.damageRectangles.push(rectangle);
            }

            damageCount = this.randomInt(7, 10);
            for (let i = 0; i < damageCount; i++) {
                const rectangle = new PIXI.Graphics();
                rectangle.beginFill(0x87ceeb);
                rectangle.drawRect(blockSprite.x + this.randomInt(0, 42) - 2, blockSprite.y - 2,
                    this.randomInt(5, 5), this.randomInt(5, 5));
                rectangle.endFill();
                this.damageContainer.addChild(rectangle);
                this.damageRectangles.push(rectangle);
            }
        }
    }
}

export default Building;
