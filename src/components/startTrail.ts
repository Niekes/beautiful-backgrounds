import { customElement, property } from "lit/decorators.js";
import type Particle from "../Particle";
import { ParticleBackground, type ParticlePlacement } from "../ParticleBackground";
import { getRandomFloat } from "../utils/number";

@customElement("bb-star-trail")
export class BbStarTrail extends ParticleBackground {
    @property({ type: Number, attribute: "particle-force" })
    particleForce: number = 0;

    @property({ type: Number, attribute: "particle-radius-min" })
    particleRadiusMin: number = 1;

    @property({ type: Number, attribute: "particle-radius-max" })
    particleRadiusMax: number = 100;

    particleSizeMin: number = 0.5;
    particleSizeMax: number = 1.5;
    particleSpeedMin: number = 0.025;
    particleSpeedMax: number = 0.05;
    particleColorHueStart: number = 30;
    particleColorHueEnd: number = 75;
    particleColorLightnessEnd: number = 50;
    particleLifespanMin: number = 1000;
    particleLifespanMax: number = 10000;
    particleAmount: number = 1000;
    gridSides: number = 6;
    gridSize: number = 40;
    gridAngle: number = 0;

    protected initialize(): void {
        this.particleRadiusMax = this.particleRadiusMax || this.width;
        super.initialize();
    }

    protected move(particle: Particle, deltaTime: number): void {
        particle.circularMove(this.width / 2, this.height / 2, deltaTime);
    }

    /** On an orbit around the center, spread evenly over the disc. */
    protected placement(): ParticlePlacement {
        const angle = getRandomFloat(0, Math.PI * 2);
        const radiusRange = this.particleRadiusMax - this.particleRadiusMin;
        const radius =
            Math.sqrt(Math.random()) * radiusRange + this.particleRadiusMin;

        return { angle, radius, force: this.particleForce };
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-star-trail": BbStarTrail;
    }
}
