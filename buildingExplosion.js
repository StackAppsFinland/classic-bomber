

class BuildingExplosion {
    constructor(x, y, duration, numParticles, speedMultiplier) {
        this.x = x;
        this.y = y;
        this.duration = duration;
        this.numParticles = numParticles;
        this.container = new PIXI.Container();
        this.isFinished = false;
        this.vxSpeed = 0.25 * speedMultiplier;
        this.vySpeed = 0.35 * speedMultiplier;
        this.gravity = 0.007 * speedMultiplier;
        this.rotationSpeed = 0.06 * speedMultiplier;
        this.rotationStart = this.rotationSpeed / 2;
        this.speedMultiplier = speedMultiplier;
        this.createParticles();
    }

    createParticles() {
        for (let i = 0; i < this.numParticles; i++) {
            const thickness = Math.floor(Math.random() * 3) + 1;
            const length = Math.floor(Math.random() * 10) + 1;

            // Create a black rectangle
            const rectangle = new PIXI.Graphics();
            rectangle.beginFill(0x000000);
            rectangle.drawRect(0, 0, thickness, length);
            rectangle.endFill();

            rectangle.x = this.x;
            rectangle.y = this.y;
            rectangle.vx = (Math.random() * 2 - 1) * this.vxSpeed;
            rectangle.vy = (Math.random() * 2 - 1) * this.vySpeed;
            rectangle.gravity = this.gravity;
            rectangle.alpha = 1;
            rectangle.rotation = Math.floor(Math.random() * 360);
            rectangle.rotationSpeed = (Math.random() * this.rotationSpeed - this.rotationStart);
            this.container.addChild(rectangle);
        }

        setTimeout(() => {
            this.container.destroy({ children: true });
            this.isFinished = true;
        }, this.duration);
    }

    update() {
        for (let i = 0; i < this.container.children.length; i++) {
            const particle = this.container.children[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.gravity; // Apply gravity
            particle.alpha = particle.alpha - 0.003 * this.speedMultiplier;
            particle.rotation += particle.rotationSpeed;
        }
    }
}

export default BuildingExplosion;
