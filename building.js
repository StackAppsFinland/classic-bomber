//import Explosion from './buildingCollapseEffect.js';

const buildingWidth = 40;
const blockHeight = 16;
const blockBuildTime = 1.2;
const blockRemoveTime = 150;

class Building {
    constructor(x, startYpos, blocks) {
        this.x = x;
        this.startYpos = startYpos;
        this.blocks = blocks;
        this.currentBlocks = 0;
        this.baseImg = PIXI.Texture.from(`images/base${Math.floor(Math.random() * 15) + 1}.png`);
        this.roofImg = PIXI.Texture.from(`images/roof${Math.floor(Math.random() * 18) + 1}.png`);
        this.storeyImg = PIXI.Texture.from(`images/storey${Math.floor(Math.random() * 14) + 1}.png`);
        this.blockArray = [];
        this.topBlockY = 0;
        this.removeStartTime = null;
        this.blocksRemoved = 100;
        this.removalAmount = 0;
        this.damageArray = [];
        this.damageContainer = new PIXI.Container();
        this.buildingContainer = new PIXI.Container();
    }

    getDamageContainer() {
        // We might be able to use the container as it should have the total width and height of all parts
        this.damageContainer.removeChildren()
        
        for (let j = 0; j < this.damageArray.length; j++) {
            const damage = this.damageArray[j];
            const damageX = this.x + damage.x * buildingWidth / 40;
            const damageY = this.topBlockY + damage.y * blockHeight / 16;
            const damageRect = new PIXI.Graphics();
            damageRect.beginFill(0x87CEEB);
            damageRect.drawCircle(damageX, damageY, 4, 4);
            damageRect.endFill();
            damageContainer.addChild(damageRect);
        }
    }
    
    removeTop() {
        
    }

    setRemovalAmount(amount) {
        this.removalAmount = amount;
    }

    getBuildingContainer() {
        for (let i = 0; i < this.currentBlocks; i++) {
            const posY = this.startYpos - (i + 1) * blockHeight;

            let blockTexture;
            if (this.currentBlocks === 0) {
                blockTexture = this.baseImg;
            } else if (this.currentBlocks === this.blocks - 1) {
                blockTexture = this.roofImg;
            } else {
                blockTexture = this.storeyImg;
            }

            const blockSprite = new PIXI.Sprite(blockTexture);
            blockSprite.x = this.x;
            blockSprite.y = posY;
            blockSprite.width = buildingWidth;
            blockSprite.height = blockHeight;
            this.buildingContainer.addChild(blockSprite);
        }
        
        return this.buildingContainer;
    }

    showDamage() {
        const totalDamagePoints = Math.floor(Math.random() * 20) + 5; // random number between 10 and 15
        this.damageArray = [];

        for (let i = 0; i < totalDamagePoints; i++) {
            let randomX = Math.floor(Math.random() * 40); // random number between 0 and 39
            let randomY = Math.floor(Math.random() * 16); // random number between 0 and 6
            this.damageArray.push({ x: randomX, y: randomY });
        }

        for (let i = 0; i < 10; i++) {
            let randomX = Math.floor(Math.random() * 8); // random number between 0 and 39
            let randomY = Math.floor(Math.random() * 5); // random number between 0 and 6
            this.damageArray.push({ x: randomX, y: randomY });
        }
        for (let i = 0; i < 10; i++) {
            let randomX = Math.floor(buildingWidth - Math.random() * 8); // random number between 0 and 39
            let randomY = Math.floor(Math.random() * 5); // random number between 0 and 6
            this.damageArray.push({ x: randomX, y: randomY });
        }
    }

    startRemove() {
        this.blocksRemoved = 0;
    }

    getTopYPos() {
        return this.currentBlocks == 0 ? 0 : this.topBlockY;
    }

    removeTopBlocks(explosions) {
        if (this.blocksRemoved >= this.removalAmount) {
            return;
        }

        if (this.removeStartTime === null) {
            this.removeStartTime = Date.now();
        }

        const elapsedTime = Date.now() - this.removeStartTime;
        const blocksToRemove = Math.floor(elapsedTime / blockRemoveTime);
        if (blocksToRemove > 0 && this.blockArray.length > 0) {
            this.blockArray.pop();
            this.blocksRemoved++;
            this.currentBlocks = this.blockArray.length;
            this.removeStartTime = Date.now();
           // explosions.push(new Explosion(this.x + Math.random() * 38, this.topBlockY + 16, 150, 30));
        }
    }
}

export default Building;
