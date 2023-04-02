import BuildingExplosion from "./buildingExplosion.js";

const buildingWidth = 40;
const blockHeight = 16;

class Building {
    constructor(x, y, blocks) {
        this.x = x;
        this.y = y;
        this.blocks = blocks;
        this.baseImg = PIXI.Texture.from(`images/base${Math.floor(Math.random() * 15) + 1}.png`);
        this.roofImg = PIXI.Texture.from(`images/roof${Math.floor(Math.random() * 18) + 1}.png`);
        this.storeyImg = PIXI.Texture.from(`images/storey${Math.floor(Math.random() * 14) + 1}.png`);
        this.container = new PIXI.Container();
        this.damageContainer = new PIXI.Container();
        this.isRevealed = false;
        this.revealY = this.y;
        this.removalAmount = 0;
        this.lastMillis = 0;
        this.topBlockY = 0;
        this.damageRectangles = []
    }

    getBuildingContainer() {
        for (let i = 0; i < this.blocks; i++) {
            const posY = this.y - (i + 1) * blockHeight;

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
            blockSprite.width = buildingWidth;
            blockSprite.height = blockHeight;
            this.container.addChild(blockSprite);
            this.topBlockY = posY;
        }

        // Create a PIXI.Graphics object for the mask
        const mask = new PIXI.Graphics();

        // Draw a rectangle for the mask, covering the entire building container
        mask.beginFill(0xffffff);
        mask.drawRect(this.x, this.y, buildingWidth, this.y);
        mask.endFill();

        // Set the mask for the building container
        this.container.mask = mask;

        return this.container;
    }

    reveal(speed) {
        const mask = this.container.mask;

        this.revealY = this.revealY - speed;
        if (this.revealY < this.topBlockY) {
            this.revealY = this.topBlockY;
            this.isRevealed = true;
        }

        mask.beginFill(0xffffff);
        mask.drawRect(this.x, this.revealY, buildingWidth, this.y);
        mask.endFill();
    }

    setRemovalAmount(amount) {
        this.removalAmount = amount;
    }

    removalBlock(stage, specialEffects) {
        const currentMillis = Date.now();

        if (currentMillis > this.lastMillis) {
            this.lastMillis = currentMillis + 100;
            if (this.removalAmount > 0 && this.container.children.length > 0) {
                const blockSprite = this.container.children[this.container.children.length - 1];
                this.container.removeChild(blockSprite);

                const explosion = new BuildingExplosion(blockSprite.x + 2 + Math.random() * 38, blockSprite.y + blockHeight, 2300, 50);
                stage.addChild(explosion.container);
                specialEffects.push(explosion);
                this.removalAmount--;

                if (this.removalAmount <= 0) this.createDamagedArea()
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
            let damageCount = this.randomInt(20, 30);

            for (let i = 0; i < damageCount; i++) {
                // Create a sky-blue circle of size 6x6
                const rectangle = new PIXI.Graphics();
                rectangle.beginFill(0x87ceeb); // Set the fill color (sky-blue)
                rectangle.drawRect(blockSprite.x + this.randomInt(0, 42) - 2, blockSprite.y + this.randomInt(-3, 15),
                    this.randomInt(1, 4), this.randomInt(1, 4)); // Draw a rectangle with the given width and height
                rectangle.endFill();

                // Add the circle to the buildingsContainer
                this.damageContainer.addChild(rectangle);

                // Store the circle in the circles array
                this.damageRectangles.push(rectangle);
            }

            damageCount = this.randomInt(3, 7);
            for (let i = 0; i < damageCount; i++) {
                // Create a sky-blue circle of size 6x6
                const rectangle = new PIXI.Graphics();
                rectangle.beginFill(0x87ceeb); // Set the fill color (sky-blue)
                rectangle.drawRect(blockSprite.x + this.randomInt(0, 42) - 2, blockSprite.y - 2,
                    this.randomInt(5, 5), this.randomInt(5, 5)); // Draw a rectangle with the given width and height
                rectangle.endFill();

                // Add the circle to the buildingsContainer
                this.damageContainer.addChild(rectangle);

                // Store the circle in the circles array
                this.damageRectangles.push(rectangle);
            }
        }
    }
}

export default Building;
