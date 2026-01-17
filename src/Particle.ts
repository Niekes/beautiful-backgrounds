export default class Particle {
    private size: number;
    private speed: number;
    private color: string;
    private radius: number;
    private angle: number;
    private lifespan: number;

    private x: number;
    private y: number;
    private born: number;
    private fadeInDuration: number;
    private fadeOutDuration: number;

    constructor(
        size: number,
        speed: number,
        color: string,
        radius: number,
        angle: number,
        lifespan: number,
    ) {
        this.size = size;
        this.speed = speed;
        this.color = color;
        this.radius = radius;
        this.angle = angle;
        this.lifespan = lifespan;

        this.x = 0;
        this.y = 0;
        this.born = Date.now();
        this.fadeInDuration = this.lifespan * 0.25;
        this.fadeOutDuration = this.lifespan * 0.5;
    }

    update(centerX: number, centerY: number): void {
        this.angle += this.speed;

        this.x = centerX + Math.cos(this.angle) * this.radius;
        this.y = centerY + Math.sin(this.angle) * this.radius;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.calculateOpacity();
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    isDead(): boolean {
        return Date.now() - this.born > this.lifespan;
    }

    private calculateOpacity(): number {
        const age = Date.now() - this.born;

        if (age < this.fadeInDuration) {
            return age / this.fadeInDuration;
        }

        if (age > this.lifespan - this.fadeOutDuration) {
            return (this.lifespan - age) / this.fadeOutDuration;
        }

        return 1;
    }
}
