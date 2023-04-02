

class BuildingExplosion {
    constructor(x, y, duration, numParticles) {
        this.x = x;
        this.y = y;
        this.duration = duration;
        this.numParticles = numParticles;
        this.container = new PIXI.Container(); // Use a regular Container
        this.isFinished = false;
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
            rectangle.vx = (Math.random() * 2 - 1) * 0.25;
            rectangle.vy = (Math.random() * 2 - 1) * 0.35;
            rectangle.gravity = 0.007;
            rectangle.alpha = 1;
            rectangle.rotation = Math.floor(Math.random() * 360);
            rectangle.rotationSpeed = (Math.random() * 0.04 - 0.02);
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
            particle.alpha = particle.alpha - 0.003;
            particle.rotation += particle.rotationSpeed;
        }
    }
}

export default BuildingExplosion;
