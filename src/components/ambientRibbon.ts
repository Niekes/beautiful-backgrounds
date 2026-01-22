import { customElement, property } from "lit/decorators.js";
import type { PropertyValues } from "lit";
import { BeautifulBackground } from "../BeautifulBackground";
import { getRandomFloat } from "../utils/number";
import { hsla } from "../utils/color";

class Line {
    public angle: number[];
    public color: string;

    constructor(angle: number[], color: string) {
        this.angle = angle;
        this.color = color;
    }
}

class Ribbon {
    public angle: number[];
    private speedSeeds: number[];
    private speedSigns: number[];
    public speed: number[] = [];
    public lines: Line[] = [];

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

        this.lines.push(new Line(nextAngle, "")); // Color set during draw

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
    private hue: number = 11;
    private hueForward: boolean = true;

    protected initialize(): void {
        this.hue = this.ribbonHueStart;
        this.ribbons = [];
        for (let i = 0; i < this.ribbonCount; i++) {
            this.ribbons.push(
                new Ribbon(this.ribbonSpeedMin, this.ribbonSpeedMax),
            );
        }

        // Preload
        for (let i = 0; i < this.ribbonCount; i++) {
            for (let j = 0; j < this.ribbonWidth; j++) {
                this.updateColor();
                this.ribbons[i].update(this.ribbonWidth);
            }
        }
    }

    protected updated(changedProperties: PropertyValues) {
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

    private updateColor() {
        this.hue += this.hueForward ? 0.05 : -0.05;

        if (this.hue > this.ribbonHueEnd && this.hueForward) {
            this.hue = this.ribbonHueEnd;
            this.hueForward = false;
        } else if (this.hue < this.ribbonHueStart && !this.hueForward) {
            this.hue = this.ribbonHueStart;
            this.hueForward = true;
        }
    }

    protected loop(): void {
        this.updateColor();

        this.ctx.clearRect(0, 0, this.width, this.height);

        // Background
        this.drawBackground(this.ctx);

        const diagonal = Math.sqrt(this.width ** 2 + this.height ** 2);
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        const radius = diagonal / 2;
        const radius3 = radius / 3;
        const rotationRad = (this.ribbonRotation * Math.PI) / 180;

        this.ctx.lineWidth = this.ribbonLineWidth;

        this.ribbons.forEach((ribbon) => {
            ribbon.update(this.ribbonWidth);

            ribbon.lines.forEach((line, index) => {
                const angle = line.angle;

                const x1 =
                    centerX -
                    radius *
                        Math.cos(angle[0] * this.ribbonAmplitude + rotationRad);
                const y1 =
                    centerY -
                    radius *
                        Math.sin(angle[0] * this.ribbonAmplitude + rotationRad);
                const x2 =
                    centerX +
                    radius *
                        Math.cos(angle[3] * this.ribbonAmplitude + rotationRad);
                const y2 =
                    centerY +
                    radius *
                        Math.sin(angle[3] * this.ribbonAmplitude + rotationRad);

                const cpx1 =
                    centerX -
                    radius3 * Math.cos(angle[1] * this.ribbonAmplitude * 2);
                const cpy1 =
                    centerY -
                    radius3 * Math.sin(angle[1] * this.ribbonAmplitude * 2);
                const cpx2 =
                    centerX +
                    radius3 * Math.cos(angle[2] * this.ribbonAmplitude * 2);
                const cpy2 =
                    centerY +
                    radius3 * Math.sin(angle[2] * this.ribbonAmplitude * 2);

                const progress = index / (ribbon.lines.length - 1 || 1);

                const lineHue =
                    this.ribbonHueEnd +
                    (this.ribbonHueStart - this.ribbonHueEnd) * progress;
                const lineSaturation =
                    this.ribbonSaturationEnd +
                    (this.ribbonSaturationStart - this.ribbonSaturationEnd) *
                        progress;
                const lineLightness =
                    this.ribbonLightnessEnd +
                    (this.ribbonLightnessStart - this.ribbonLightnessEnd) *
                        progress;

                this.ctx.strokeStyle = hsla(
                    lineHue,
                    lineSaturation,
                    lineLightness,
                    this.ribbonLineOpacity,
                );
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
                this.ctx.stroke();
            });
        });
    }
}
