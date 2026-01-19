import { customElement, property } from "lit/decorators.js";
import Particle from "../Particle";
import { getRandomFloat, interpolateLinear } from "../utils/number";
import { randomColor } from "../utils/color";
import { BeautifulBackground } from "../BeautifulBackground";

@customElement("bb-star-trail")
export class BbStarTrail extends BeautifulBackground {
    @property({ type: Number, attribute: "star-size-min" })
    starSizeMin: number = 0.5;

    @property({ type: Number, attribute: "star-size-max" })
    starSizeMax: number = 1.5;

    @property({ type: Number, attribute: "star-speed-min" })
    starSpeedMin: number = 0.025;

    @property({ type: Number, attribute: "star-speed-max" })
    starSpeedMax: number = 0.05;

    @property({ type: Number, attribute: "star-color-hue-start" })
    starColorHueStart: number = 30;

    @property({ type: Number, attribute: "star-color-hue-end" })
    starColorHueEnd: number = 75;

    @property({ type: Number, attribute: "star-color-saturation-start" })
    starColorSaturationStart: number = 100;

    @property({ type: Number, attribute: "star-color-saturation-end" })
    starColorSaturationEnd: number = 100;

    @property({ type: Number, attribute: "star-color-lightness-start" })
    starColorLightnessStart: number = 50;

    @property({ type: Number, attribute: "star-color-lightness-end" })
    starColorLightnessEnd: number = 50;

    @property({ type: Number, attribute: "star-radius-min" })
    starRadiusMin: number = 1;

    @property({ type: Number, attribute: "star-radius-max" })
    starRadiusMax: number = 100;

    @property({ type: Number, attribute: "star-lifespan-min" })
    starLifespanMin: number = 1000;

    @property({ type: Number, attribute: "star-lifespan-max" })
    starLifespanMax: number = 10000;

    @property({ type: Number, attribute: "num-stars" })
    numStars: number = 1000;

    // Component-specific properties
    private stars: Particle[] = [];

    protected initialize(): void {
        this.stars = [];

        // Initialize background to prevent white flash
        this.ctx.fillStyle = `rgb(${this.backgroundColor})`;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.starRadiusMax = this.starRadiusMax || this.width;

        for (let i = 0; i < this.numStars; i++) {
            this.stars.push(this.createStar());
        }
    }

    protected loop(deltaTime: number): void {
        this.ctx.fillStyle = `rgba(${this.backgroundColor}, ${this.trailOpacity})`;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.stars = this.stars.filter((star) => !star.isDead());

        while (this.stars.length < this.numStars) {
            this.stars.push(this.createStar());
        }

        this.stars.forEach((star) => {
            star.circularMove(this.width / 2, this.height / 2, deltaTime);
            star.draw(this.ctx);
        });
    }

    protected createStar(): Particle {
        const size = getRandomFloat(this.starSizeMin, this.starSizeMax);
        const speed = getRandomFloat(
            interpolateLinear(this.starSpeedMin, -10, 10, -1, 1),
            interpolateLinear(this.starSpeedMax, -10, 10, -1, 1),
        );

        const lifespan = getRandomFloat(
            this.starLifespanMin,
            this.starLifespanMax,
        );
        const color = randomColor(
            [this.starColorHueStart, this.starColorHueEnd],
            [this.starColorSaturationStart, this.starColorSaturationEnd],
            [this.starColorLightnessStart, this.starColorLightnessEnd],
        );
        const angle = getRandomFloat(0, Math.PI * 2);

        const radiusRange = this.starRadiusMax - this.starRadiusMin;
        const radius =
            Math.sqrt(Math.random()) * radiusRange + this.starRadiusMin;

        return new Particle(size, speed, color, radius, angle, lifespan);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-star-trail": BbStarTrail;
    }
}
