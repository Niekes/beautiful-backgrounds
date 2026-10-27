import { customElement, property } from "lit/decorators.js";
import { BeautifulBackground } from "../BeautifulBackground";
import { toHsl } from "../utils/color";
import { strokeLine } from "../utils/line";
import { stringToArrayConverter } from "../utils/lit";

@customElement("bb-liquid-lines")
export class BbLiquidLines extends BeautifulBackground {
    @property({ type: Number, attribute: "line-count" })
    lineCount: number = 20;

    @property({ type: Number, attribute: "line-amplitude" })
    lineAmplitude: number = 30;

    @property({ type: Number, attribute: "line-frequency" })
    lineFrequency: number = 0.005;

    @property({ type: Number, attribute: "speed" })
    speed: number = 0.5;

    @property({ type: Number, attribute: "line-spacing" })
    lineSpacing: number = 40;

    @property({ type: Number, attribute: "line-width" })
    lineWidth: number = 2;

    @property({ type: Number, attribute: "line-hue-start" })
    lineHueStart: number = 200;

    @property({ type: Number, attribute: "line-hue-end" })
    lineHueEnd: number = 280;

    @property({ type: Number, attribute: "line-saturation" })
    lineSaturation: number = 80;

    @property({ type: Number, attribute: "line-offset-step" })
    lineOffsetStep: number = 0.2;

    @property({ type: Number, attribute: "wiggle-amplitude" })
    wiggleAmplitude: number = 20;

    @property({ type: Number, attribute: "wiggle-speed" })
    wiggleSpeed: number = 0.3;

    @property({
        type: Array,
        attribute: "line-colors",
        converter: stringToArrayConverter,
    })
    lineColors: string[] = [];

    private time: number = 0;

    protected loop(deltaTime: number): void {
        this.time += deltaTime;

        this.fadeTrail();

        const centerY = this.height / 2;
        const startY = centerY - (this.lineCount * this.lineSpacing) / 2;

        for (let i = 0; i < this.lineCount; i++) {
            this.drawLine(i, startY + i * this.lineSpacing);
        }
    }

    private drawLine(index: number, baseY: number): void {
        const ctx = this.ctx;
        const points = 100; // Resolution of the line
        const step = this.width / (points - 1);
        const phaseOffset = index * this.lineOffsetStep;
        const wiggle =
            Math.sin(this.time * this.wiggleSpeed + phaseOffset + index) *
            this.wiggleAmplitude;
        const waveY = (x: number): number =>
            baseY +
            Math.sin(
                x * this.lineFrequency + this.time * this.speed + phaseOffset,
            ) *
                this.lineAmplitude +
            wiggle;

        ctx.beginPath();
        ctx.strokeStyle = this.lineColor(index);
        ctx.moveTo(0, waveY(0));

        for (let j = 0; j < points - 1; j++) {
            const x1 = j * step;
            const x2 = (j + 1) * step;
            const y1 = waveY(x1);

            ctx.quadraticCurveTo(x1, y1, (x1 + x2) / 2, (y1 + waveY(x2)) / 2);
        }

        strokeLine(ctx, this.lineWidth);
    }

    /** The line's color, with a lightness that varies for a "depth" effect. */
    private lineColor(index: number): string {
        const lightness = 40 + Math.sin(this.time * 0.001 + index * 0.5) * 10;

        if (this.lineColors.length > 0) {
            const { h, s } = toHsl(
                this.lineColors[index % this.lineColors.length],
            );
            return `hsl(${h}, ${s * 100}%, ${lightness}%)`;
        }

        const progress = index / this.lineCount;
        const hue =
            this.lineHueStart +
            (this.lineHueEnd - this.lineHueStart) * progress;
        return `hsl(${hue}, ${this.lineSaturation}%, ${lightness}%)`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-liquid-lines": BbLiquidLines;
    }
}
