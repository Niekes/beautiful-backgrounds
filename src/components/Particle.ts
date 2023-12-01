import { getRandomInt, getRandomFloat } from '../utils/number';

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

    amplitudeX: number = getRandomInt(-350, 350);
    amplitudeY: number = getRandomInt(-350, 350);
    frequencyX: number = getRandomFloat(-1, 1);
    frequencyY: number = getRandomFloat(-1, 1);
    time: number = 0;
    dampingFactor: number = 0.1;
    phaseX: number = getRandomInt(10, 70);
    phaseY: number = getRandomInt(10, 400);
    heartScale = getRandomInt(10, 20); // Adjust this to scale the size of the heart
    deltaRadius = 1;
    dx = 1;

    constructor(
        size: number,
        speed: number,
        color: string,
        radius: number,
        angle: number,
        lifespan: number
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

    heartShapeMotion(centerX: number, centerY: number): void {
        // Parametric equations for the heart shape
        this.x = centerX + this.heartScale * (16 * Math.pow(Math.sin(this.angle), 3));
        this.y =
            centerY -
            this.heartScale *
                (13 * Math.cos(this.angle) -
                    5 * Math.cos(2 * this.angle) -
                    2 * Math.cos(3 * this.angle) -
                    Math.cos(4 * this.angle));

        // Increment the angle
        this.angle -= this.speed; // Adjust as needed for speed
    }

    spiralMotion(centerX: number, centerY: number): void {
        // Gradually increase the radius to continue the spiral motion
        this.radius += this.deltaRadius;

        // Calculate the new position
        this.x = centerX + this.radius * Math.cos(this.angle);
        this.y = centerY + this.radius * Math.sin(this.angle);

        // Increment the angle for the next position
        this.angle += this.speed;
    }

    updatse(centerX: number, centerY: number): void {
        this.x += this.dx;
        this.y = this.amplitudeX * Math.sin(this.frequencyX * this.x + this.phaseX);
    }

    dampedHarmonicMotion(centerX: number, centerY: number): void {
        // Applying damping to the amplitude
        let dampedAmplitudeX = this.amplitudeX * Math.pow(this.dampingFactor, this.time);
        let dampedAmplitudeY = this.amplitudeY * Math.pow(this.dampingFactor, this.time);

        // Calculate the new position with the damped amplitude
        this.x = centerX + dampedAmplitudeX * Math.sin(this.frequencyX * this.time + this.phaseX);
        this.y = centerY + dampedAmplitudeY * Math.sin(this.frequencyY * this.time + this.phaseY);

        // Increment the time
        this.time += this.speed; // Increment can be adjusted based on desired speed
    }

    update(centerX: number, centerY: number): void {
        this.angle += this.speed;

        this.x = centerX + Math.cos(this.angle) * this.radius;
        this.y = centerY + Math.sin(this.angle) * this.radius;
    }

    ellipticalMotion(centerX: number, centerY: number): void {
        this.angle += this.speed;

        this.x = centerX + this.radius * Math.cos(this.angle);
        this.y = centerY + this.radius * Math.sin(this.angle);
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
