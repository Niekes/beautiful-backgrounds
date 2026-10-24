import { property } from "lit/decorators.js";
import { BeautifulBackground } from "./BeautifulBackground";
import Particle, { type ParticleOptions } from "./Particle";
import { randomColor } from "./utils/color";
import { stringToArrayConverter } from "./utils/lit";
import { getRandomFloat } from "./utils/number";

/** Where a new particle starts and how it is pushed. */
export type ParticlePlacement = Pick<
    ParticleOptions,
    "angle" | "radius" | "force" | "x" | "y"
>;

/**
 * A background of particles that fade in, move and fade out again, with a
 * new particle taking the place of every one that dies. Subclasses decide
 * where a particle starts and how it moves.
 */
export abstract class ParticleBackground extends BeautifulBackground {
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

    private particles: Particle[] = [];

    protected initialize(): void {
        this.particles = [];

        // Initialize background to prevent white flash
        this.drawBackground(this.ctx);
        this.replenish();
    }

    protected loop(deltaTime: number): void {
        this.fadeTrail();

        this.particles = this.particles.filter(
            (particle) => !particle.isDead(),
        );
        this.replenish();

        this.particles.forEach((particle) => {
            this.move(particle, deltaTime);
            particle.draw(this.ctx);
        });
    }

    protected createParticle(): Particle {
        return new Particle({
            size: getRandomFloat(this.particleSizeMin, this.particleSizeMax),
            speed: getRandomFloat(this.particleSpeedMin, this.particleSpeedMax),
            lifespan: getRandomFloat(
                this.particleLifespanMin,
                this.particleLifespanMax,
            ),
            color: this.particleColor(),
            gridSides: this.gridSides,
            gridSize: this.gridSize,
            gridAngle: this.gridAngle,
            ...this.placement(),
        });
    }

    /** Moves one particle by one frame. */
    protected abstract move(particle: Particle, deltaTime: number): void;

    /** Where a new particle starts. */
    protected abstract placement(): ParticlePlacement;

    private replenish(): void {
        while (this.particles.length < this.particleAmount) {
            this.particles.push(this.createParticle());
        }
    }

    private particleColor(): string {
        if (this.particleColors.length > 0) {
            return this.particleColors[
                Math.floor(Math.random() * this.particleColors.length)
            ];
        }
        return randomColor(
            [this.particleColorHueStart, this.particleColorHueEnd],
            [
                this.particleColorSaturationStart,
                this.particleColorSaturationEnd,
            ],
            [this.particleColorLightnessStart, this.particleColorLightnessEnd],
        );
    }
}
