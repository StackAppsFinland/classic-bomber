class ParticleExplosion {
    constructor(x, y, duration, numParticles) {
        this.x = x;
        this.y = y;
        this.duration = duration;
        this.numParticles = numParticles;
        this.container = new PIXI.Container();
        this.isFinished = false;
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
            circle.vx = (Math.random() * 2 - 1) * 1;
            circle.vy = (Math.random() * 2 - 1) * 1;
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
            particle.alpha *= 0.95;
        }
    }
}

export default ParticleExplosion;
