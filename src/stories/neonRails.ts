import { customElement, property } from "lit/decorators.js";
import Particle from "../Particle";
import { getRandomFloat, interpolateLinear } from "../utils/number";
import { randomColor } from "../utils/color";
import { BeautifulBackground } from "../BeautifulBackground";
import { stringToArrayConverter } from "../utils/lit";

@customElement("bb-neon-rails")
export class BbNeonRails extends BeautifulBackground {
    @property({ type: Number, attribute: "particle-size-min" })
    particleSizeMin: number = 1;

    @property({ type: Number, attribute: "particle-size-max" })
    particleSizeMax: number = 1;

    @property({ type: Number, attribute: "particle-speed-min" })
    particleSpeedMin: number = -30;

    @property({ type: Number, attribute: "particle-speed-max" })
    particleSpeedMax: number = 30;

    @property({ type: Number, attribute: "particle-color-hue-start" })
    particleColorHueStart: number = 130;

    @property({ type: Number, attribute: "particle-color-hue-end" })
    particleColorHueEnd: number = 300;

    @property({ type: Number, attribute: "particle-color-saturation-start" })
    particleColorSaturationStart: number = 100;

    @property({ type: Number, attribute: "particle-color-saturation-end" })
    particleColorSaturationEnd: number = 100;

    @property({ type: Number, attribute: "particle-color-lightness-start" })
    particleColorLightnessStart: number = 50;

    @property({ type: Number, attribute: "particle-color-lightness-end" })
    particleColorLightnessEnd: number = 0;

    @property({ type: Number, attribute: "particle-lifespan-min" })
    particleLifespanMin: number = 100;

    @property({ type: Number, attribute: "particle-lifespan-max" })
    particleLifespanMax: number = 50000;

    @property({ type: Number, attribute: "particle-amount" })
    particleAmount: number = 2000;

    @property({ type: Number, attribute: "grid-sides" })
    gridSides: number = 3;

    @property({ type: Number, attribute: "grid-size" })
    gridSize: number = 60;

    @property({ type: Number, attribute: "grid-angle" })
    gridAngle: number = Math.PI / 2;

    @property({
        type: Array,
        attribute: "particle-colors",
        converter: stringToArrayConverter,
    })
    particleColors: string[] = [];

    // Component-specific properties
    private particles: Particle[] = [];

    @property({ type: Number, attribute: "trail-opacity" })
    public trailOpacity: number = 0.0125;

    protected initialize(): void {
        this.particles = [];

        // Initialize background to prevent white flash
        this.ctx.fillStyle = `rgba(${this.backgroundColor}, ${this.trailOpacity})`;
        this.ctx.fillRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.particleAmount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    protected loop(deltaTime: number): void {
        this.ctx.fillStyle = `rgba(${this.backgroundColor}, ${this.trailOpacity})`;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.particles = this.particles.filter(
            (particle) => !particle.isDead(),
        );

        while (this.particles.length < this.particleAmount) {
            this.particles.push(this.createParticle());
        }

        this.particles.forEach((particle) => {
            particle.railMove(this.width / 2, this.height / 2, deltaTime);
            particle.draw(this.ctx);
        });
    }

    protected createParticle(): Particle {
        const size = getRandomFloat(this.particleSizeMin, this.particleSizeMax);
        const speed = getRandomFloat(
            interpolateLinear(this.particleSpeedMin, -10, 10, -10, 10),
            interpolateLinear(this.particleSpeedMax, -10, 10, -10, 10),
        );

        const lifespan = getRandomFloat(
            this.particleLifespanMin,
            this.particleLifespanMax,
        );

        let color: string;
        if (this.particleColors && this.particleColors.length > 0) {
            color =
                this.particleColors[
                    Math.floor(Math.random() * this.particleColors.length)
                ];
        } else {
            color = randomColor(
                [this.particleColorHueStart, this.particleColorHueEnd],
                [
                    this.particleColorSaturationStart,
                    this.particleColorSaturationEnd,
                ],
                [
                    this.particleColorLightnessStart,
                    this.particleColorLightnessEnd,
                ],
            );
        }

        // Create randomly on canvas (rectangular distribution)
        const randX = getRandomFloat(0, this.width);
        const randY = getRandomFloat(0, this.height);
        const dx = randX - this.width / 2;
        const dy = randY - this.height / 2;

        const angle = Math.atan2(dy, dx);

        return new Particle({
            size: size,
            speed: speed,
            color: color,
            angle: angle,
            lifespan: lifespan,
            gridSides: this.gridSides,
            gridSize: this.gridSize,
            gridAngle: this.gridAngle,
            x: randX,
            y: randY,
        });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-neon-rails": BbNeonRails;
    }
}
