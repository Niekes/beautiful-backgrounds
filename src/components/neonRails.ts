import { customElement, property } from "lit/decorators.js";
import type Particle from "../Particle";
import {
    ParticleBackground,
    type ParticlePlacement,
} from "../ParticleBackground";
import { getRandomFloat } from "../utils/number";

@customElement("bb-neon-rails")
export class BbNeonRails extends ParticleBackground {
    @property({ type: Number, attribute: "trail-opacity" })
    public trailOpacity: number = 0.0125;

    protected move(particle: Particle, deltaTime: number): void {
        particle.railMove(this.width / 2, this.height / 2, deltaTime);
    }

    /** Anywhere on the canvas, heading away from the center. */
    protected placement(): ParticlePlacement {
        const x = getRandomFloat(0, this.width);
        const y = getRandomFloat(0, this.height);
        const angle = Math.atan2(y - this.height / 2, x - this.width / 2);

        return { angle, x, y };
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-neon-rails": BbNeonRails;
    }
}
