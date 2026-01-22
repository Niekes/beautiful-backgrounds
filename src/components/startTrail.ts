import { customElement, property } from "lit/decorators.js";
import Particle from "../Particle";
import { getRandomFloat, interpolateLinear } from "../utils/number";
import { randomColor } from "../utils/color";
import { BeautifulBackground } from "../BeautifulBackground";
import { stringToArrayConverter } from "../utils/lit";

@customElement("bb-star-trail")
export class BbStarTrail extends BeautifulBackground {
    @property({ type: Number, attribute: "particle-force" })
    particleForce: number = 0;

    @property({ type: Number, attribute: "particle-size-min" })
    particleSizeMin: number = 0.5;

    @property({ type: Number, attribute: "particle-size-max" })
    particleSizeMax: number = 1.5;

    @property({ type: Number, attribute: "particle-speed-min" })
    particleSpeedMin: number = 0.025;

    @property({ type: Number, attribute: "particle-speed-max" })
    particleSpeedMax: number = 0.05;

    @property({ type: Number, attribute: "particle-color-hue-start" })
    particleColorHueStart: number = 30;

    @property({ type: Number, attribute: "particle-color-hue-end" })
    particleColorHueEnd: number = 75;

    @property({ type: Number, attribute: "particle-color-saturation-start" })
    particleColorSaturationStart: number = 100;

    @property({ type: Number, attribute: "particle-color-saturation-end" })
    particleColorSaturationEnd: number = 100;

    @property({ type: Number, attribute: "particle-color-lightness-start" })
    particleColorLightnessStart: number = 50;

    @property({ type: Number, attribute: "particle-color-lightness-end" })
    particleColorLightnessEnd: number = 50;

    @property({ type: Number, attribute: "particle-radius-min" })
    particleRadiusMin: number = 1;

    @property({ type: Number, attribute: "particle-radius-max" })
    particleRadiusMax: number = 100;

    @property({ type: Number, attribute: "particle-lifespan-min" })
    particleLifespanMin: number = 1000;

    @property({ type: Number, attribute: "particle-lifespan-max" })
    particleLifespanMax: number = 10000;

    @property({ type: Number, attribute: "particle-amount" })
    particleAmount: number = 1000;

    @property({ type: Number, attribute: "grid-sides" })
    gridSides: number = 6;

    @property({ type: Number, attribute: "grid-size" })
    gridSize: number = 40;

    @property({ type: Number, attribute: "grid-angle" })
    gridAngle: number = 0;

    @property({
        type: Array,
        attribute: "particle-colors",
        converter: stringToArrayConverter,
    })
    particleColors: string[] = [];

    // Component-specific properties
    private particles: Particle[] = [];

    protected initialize(): void {
        this.particles = [];

        // Initialize background to prevent white flash
        this.drawBackground(this.ctx);

        this.particleRadiusMax = this.particleRadiusMax || this.width;

        for (let i = 0; i < this.particleAmount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    protected loop(deltaTime: number): void {
        this.ctx.globalAlpha = this.trailOpacity;
        this.drawBackground(this.ctx);
        this.ctx.globalAlpha = 1.0;

        this.particles = this.particles.filter(
            (particle) => !particle.isDead(),
        );

        while (this.particles.length < this.particleAmount) {
            this.particles.push(this.createParticle());
        }

        this.particles.forEach((particle) => {
            particle.circularMove(this.width / 2, this.height / 2, deltaTime);
            particle.draw(this.ctx);
        });
    }

    protected createParticle(): Particle {
        const size = getRandomFloat(this.particleSizeMin, this.particleSizeMax);
        const speed = getRandomFloat(
            interpolateLinear(this.particleSpeedMin, -10, 10, -1, 1),
            interpolateLinear(this.particleSpeedMax, -10, 10, -1, 1),
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

        const angle = getRandomFloat(0, Math.PI * 2);

        const radiusRange = this.particleRadiusMax - this.particleRadiusMin;
        const radius =
            Math.sqrt(Math.random()) * radiusRange + this.particleRadiusMin;

        return new Particle({
            size: size,
            speed: speed,
            color: color,
            radius: radius,
            angle: angle,
            lifespan: lifespan,
            gridSides: this.gridSides,
            gridSize: this.gridSize,
            gridAngle: this.gridAngle,
            force: this.particleForce,
        });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-star-trail": BbStarTrail;
    }
}
