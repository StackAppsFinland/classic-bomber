class Bomb {
    constructor(x, y, speed = 4, texture) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.rotationTarget = 0;
        this.rotationSpeed = 4; // Adjust this value for a faster or slower rotation
        this.width = 9;
        this.height = 16;
        this.container = new PIXI.Container();
        this.isExploded = false;
        this.texture = texture;
    }

    getContainer() {
        const bomb = new PIXI.Sprite(this.texture);
        bomb.x = 0;
        bomb.y = 0;
        bomb.width = this.width;
        bomb.height = this.height;
        bomb.anchor.set(0.5);

        this.container.x = this.x + this.width / 2; // Update the container position
        this.container.y = this.y + this.height / 2;
        this.container.addChild(bomb);
        this.container.rotation = -Math.PI / 2;
        return this.container;
    }

    exploded() {
        this.isExploded = true;
        this.container.visible = false;
    }

    updatePosition() {
        if (Math.abs(this.rotationTarget - this.container.rotation) > this.rotationSpeed * (Math.PI / 180)) {
            const angleDifference = this.rotationTarget - this.container.rotation;
            const rotationDirection = angleDifference > 0 ? 1 : -1;
            this.container.rotation += rotationDirection * this.rotationSpeed * (Math.PI / 180);
        } else {
            this.container.rotation = this.rotationTarget;
        }

        this.y += this.speed;
        this.container.y = this.y;
    }
}

export default Bomb;
