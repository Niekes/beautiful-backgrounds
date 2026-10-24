import { customElement, property } from "lit/decorators.js";
import type { PropertyValues } from "lit";
import { BeautifulBackground } from "../BeautifulBackground";
import { getRandomFloat } from "../utils/number";
import { hsla } from "../utils/color";

class Ribbon {
    public angle: number[];
    private speedSeeds: number[];
    private speedSigns: number[];
    public speed: number[] = [];
    /** The angles of each line, newest last. */
    public lines: number[][] = [];

    constructor(speedMin: number, speedMax: number) {
        this.angle = [
            getRandomFloat(0, Math.PI * 2),
            getRandomFloat(0, Math.PI * 2),
            getRandomFloat(0, Math.PI * 2),
            getRandomFloat(0, Math.PI * 2),
        ];

        const rndSign = () => (Math.random() > 0.5 ? 1 : -1);

        this.speedSeeds = [
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
        ];
        this.speedSigns = [rndSign(), rndSign(), rndSign(), rndSign()];
        this.updateSpeeds(speedMin, speedMax);
    }

    public updateSpeeds(speedMin: number, speedMax: number) {
        this.speed = this.speedSeeds.map(
            (seed, i) =>
                this.speedSigns[i] * (speedMin + seed * (speedMax - speedMin)),
        );
    }

    update(maxWidth: number) {
        this.angle[0] += this.speed[0];
        this.angle[1] += this.speed[1];
        this.angle[2] += this.speed[2];
        this.angle[3] += this.speed[3];

        const nextAngle = [
            Math.sin(this.angle[0]),
            Math.sin(this.angle[1]),
            Math.sin(this.angle[2]),
            Math.sin(this.angle[3]),
        ];

        this.lines.push(nextAngle);

        if (this.lines.length > maxWidth) {
            this.lines.shift();
        }
    }
}

@customElement("bb-ambient-ribbon")
export class BbAmbientRibbon extends BeautifulBackground {
    @property({ type: Number, attribute: "ribbon-count" })
    ribbonCount: number = 5;

    @property({ type: Number, attribute: "ribbon-width" })
    ribbonWidth: number = 100;

    @property({ type: Number, attribute: "ribbon-rotation" })
    ribbonRotation: number = 45;

    @property({ type: Number, attribute: "ribbon-hue-start" })
    ribbonHueStart: number = 11;

    @property({ type: Number, attribute: "ribbon-hue-end" })
    ribbonHueEnd: number = 14;

    @property({ type: Number, attribute: "ribbon-saturation-start" })
    ribbonSaturationStart: number = 100;

    @property({ type: Number, attribute: "ribbon-saturation-end" })
    ribbonSaturationEnd: number = 100;

    @property({ type: Number, attribute: "ribbon-lightness-start" })
    ribbonLightnessStart: number = 50;

    @property({ type: Number, attribute: "ribbon-lightness-end" })
    ribbonLightnessEnd: number = 50;

    @property({ type: Number, attribute: "ribbon-amplitude" })
    ribbonAmplitude: number = 0.5;

    @property({ type: Number, attribute: "ribbon-speed-min" })
    ribbonSpeedMin: number = 0.004;

    @property({ type: Number, attribute: "ribbon-speed-max" })
    ribbonSpeedMax: number = 0.008;

    @property({ type: Number, attribute: "ribbon-line-width" })
    ribbonLineWidth: number = 2;

    @property({ type: Number, attribute: "ribbon-line-opacity" })
    ribbonLineOpacity: number = 0.2;

    private ribbons: Ribbon[] = [];

    protected initialize(): void {
        this.ribbons = [];
        for (let i = 0; i < this.ribbonCount; i++) {
            this.ribbons.push(
                new Ribbon(this.ribbonSpeedMin, this.ribbonSpeedMax),
            );
        }

        // Preload
        for (let i = 0; i < this.ribbonCount; i++) {
            for (let j = 0; j < this.ribbonWidth; j++) {
                this.ribbons[i].update(this.ribbonWidth);
            }
        }
    }

    protected updated(changedProperties: PropertyValues): void {
        super.updated(changedProperties);
        if (
            changedProperties.has("ribbonSpeedMin") ||
            changedProperties.has("ribbonSpeedMax")
        ) {
            this.ribbons.forEach((r) =>
                r.updateSpeeds(this.ribbonSpeedMin, this.ribbonSpeedMax),
            );
        }
        if (changedProperties.has("ribbonCount")) {
            this.initialize();
        }
        if (changedProperties.has("ribbonWidth")) {
            this.ribbons.forEach((r) => {
                if (r.lines.length > this.ribbonWidth) {
                    r.lines = r.lines.slice(-this.ribbonWidth);
                }
            });
        }
    }

    protected loop(): void {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Background
        this.drawBackground(this.ctx);

        this.ctx.lineWidth = this.ribbonLineWidth;

        this.ribbons.forEach((ribbon) => {
            ribbon.update(this.ribbonWidth);

            ribbon.lines.forEach((angle, index) => {
                const progress = index / (ribbon.lines.length - 1 || 1);
                this.ctx.strokeStyle = this.lineColor(progress);
                this.drawLine(angle);
            });
        });
    }

    /** One line of a ribbon: a bezier curve from edge to edge. */
    private drawLine(angle: number[]): void {
        const radius = Math.sqrt(this.width ** 2 + this.height ** 2) / 2;
        const rotation = (this.ribbonRotation * Math.PI) / 180;
        const amplitude = this.ribbonAmplitude;
        const at = (sign: number, r: number, a: number): [number, number] => [
            this.width / 2 + sign * r * Math.cos(a),
            this.height / 2 + sign * r * Math.sin(a),
        ];

        this.ctx.beginPath();
        this.ctx.moveTo(...at(-1, radius, angle[0] * amplitude + rotation));
        this.ctx.bezierCurveTo(
            ...at(-1, radius / 3, angle[1] * amplitude * 2),
            ...at(1, radius / 3, angle[2] * amplitude * 2),
            ...at(1, radius, angle[3] * amplitude + rotation),
        );
        this.ctx.stroke();
    }

    /** The color of a line, from the oldest (progress 0) to the newest. */
    private lineColor(progress: number): string {
        const mix = (start: number, end: number): number =>
            end + (start - end) * progress;

        return hsla(
            mix(this.ribbonHueStart, this.ribbonHueEnd),
            mix(this.ribbonSaturationStart, this.ribbonSaturationEnd),
            mix(this.ribbonLightnessStart, this.ribbonLightnessEnd),
            this.ribbonLineOpacity,
        );
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-ambient-ribbon": BbAmbientRibbon;
    }
}
