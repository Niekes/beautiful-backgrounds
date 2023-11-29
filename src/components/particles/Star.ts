export default class Star {
    orbitRadius: number;
    radius: number;
    speed: number;
    angle: number;
    color: string;
    born: number;
    lifespan: number;
    size: number;
    x: number;
    y: number;
    fadeInDuration: number;
    fadeOutDuration: number;

    constructor(
        size: number = 1,
        speed: number = 0.001,
        lifespan: number = 1000,
        color: string = '#fff',
        orbitRadius: number = 100,
        angle: number = 0
    ) {
        this.size = size;
        this.speed = speed;
        this.lifespan = lifespan;
        this.color = color;
        this.orbitRadius = orbitRadius;
        this.angle = angle;

        this.fadeInDuration = this.lifespan * 0.25;
        this.fadeOutDuration = this.lifespan * 0.5;
        this.born = Date.now();
        this.x = 0;
        this.y = 0;
    }

    update(centerX: number, centerY: number): void {
        this.angle += this.speed;
        this.x = centerX + Math.cos(this.angle) * this.orbitRadius;
        this.y = centerY + Math.sin(this.angle) * this.orbitRadius;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const opacity: number = this.calculateOpacity();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = opacity;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }

    isDead(): boolean {
        return Date.now() - this.born > this.lifespan;
    }

    private calculateOpacity(): number {
        const age = Date.now() - this.born;
        if (age < this.fadeInDuration) {
            return age / this.fadeInDuration; // Fade in
        } else if (age > this.lifespan - this.fadeOutDuration) {
            return (this.lifespan - age) / this.fadeOutDuration; // Fade out
        }
        return 1; // Fully visible
    }
}
