class ParticleExplosion {
    constructor(x, y, duration, numParticles, speedMultiplier) {
        this.x = x;
        this.y = y;
        this.duration = duration;
        this.numParticles = numParticles;
        this.container = new PIXI.Container();
        this.gravity = 0.007 * speedMultiplier;
        this.isFinished = false;
        this.speedMultiplier = speedMultiplier;
        this.createParticles();
    }

    createParticles() {
        for (let i = 0; i < this.numParticles; i++) {
            const size = Math.floor(Math.random() * 2) + 2;

            const randomColor = () => {
                const random = Math.random();
                if (random < 0.8) {
                    return Math.floor(0xffa500); // orange
                } else if (random < 0.9) {
                    return Math.floor(0xffffff); // white
                } else {
                    return Math.floor(0xff0000); // red
                }
            };

            // Create an orange circle
            const circle = new PIXI.Graphics();
            circle.beginFill(randomColor());
            circle.drawCircle(0, 0, size);
            circle.endFill();

            circle.x = this.x;
            circle.y = this.y;
            circle.gravity = this.gravity;
            circle.vx = (Math.random() * 2 - 1) * this.speedMultiplier;
            circle.vy = (Math.random() * 2 - 1) * this.speedMultiplier;
            circle.alpha = 1;
            this.container.addChild(circle);
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
            particle.vy += particle.gravity; // Apply slight gravity
            particle.alpha = particle.alpha - (0.006 * this.speedMultiplier);
        }
    }
}

export default ParticleExplosion;
