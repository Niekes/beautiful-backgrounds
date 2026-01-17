export default class Particle {
    private size: number;
    private speed: number;
    private color: string;
    private radius: number;
    private angle: number;
    private lifespan: number;
    private force: number;

    private x: number;
    private y: number;
    private frequencyX: number;
    private frequencyY: number;
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
        force: number = 1,
        frequencyX: number = 1,
        frequencyY: number = 1,
    ) {
        this.size = size;
        this.speed = speed;
        this.color = color;
        this.radius = radius;
        this.angle = angle;
        this.lifespan = lifespan;
        this.force = force;

        this.frequencyX = frequencyX;
        this.frequencyY = frequencyY;
        this.x = 0;
        this.y = 0;
        this.born = Date.now();
        this.fadeInDuration = this.lifespan * 0.25;
        this.fadeOutDuration = this.lifespan * 0.5;
    }

    circularMove(centerX: number, centerY: number, deltaTime: number) {
        this.angle += this.speed * deltaTime;
        this.radius += this.force * deltaTime;

        // diverse speeds for x and y
        this.x = centerX + Math.cos(this.angle * this.frequencyX) * this.radius;
        this.y = centerY + Math.sin(this.angle * this.frequencyY) * this.radius;
    }

    sinusMove(centerX: number, centerY: number, deltaTime: number) {
        this.angle += this.speed * deltaTime;

        // Move linearly on X, oscillate on Y
        this.x = centerX + this.angle * 100; // 50 is just a scale factor for horizontal speed
        this.y = centerY + Math.sin(this.angle * this.frequencyY) * this.radius;
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
