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
    private px: number;
    private py: number;
    private initialized: boolean = false;
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
        this.px = 0;
        this.py = 0;
        this.born = Date.now();
        this.fadeInDuration = this.lifespan * 0.25;
        this.fadeOutDuration = this.lifespan * 0.5;
    }

    circularMove(centerX: number, centerY: number, deltaTime: number) {
        this.angle += this.speed * deltaTime;
        this.radius += this.force * deltaTime;

        const newX =
            centerX + Math.cos(this.angle * this.frequencyX) * this.radius;
        const newY =
            centerY + Math.sin(this.angle * this.frequencyY) * this.radius;

        if (!this.initialized) {
            this.x = newX;
            this.y = newY;
            this.px = newX;
            this.py = newY;
            this.initialized = true;
        } else {
            this.px = this.x;
            this.py = this.y;
            this.x = newX;
            this.y = newY;
        }
    }
    sinusMove(centerX: number, centerY: number, deltaTime: number) {
        this.angle += this.speed * deltaTime;

        const newX = centerX + this.angle * 100;
        const newY =
            centerY + Math.sin(this.angle * this.frequencyY) * this.radius;

        if (!this.initialized) {
            this.x = newX;
            this.y = newY;
            this.px = newX;
            this.py = newY;
            this.initialized = true;
        } else {
            this.px = this.x;
            this.py = this.y;
            this.x = newX;
            this.y = newY;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.globalAlpha = this.calculateOpacity();
        ctx.beginPath();

        ctx.lineCap = "round";
        ctx.lineWidth = this.size * 2;
        ctx.strokeStyle = this.color;

        ctx.moveTo(this.px, this.py);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

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
