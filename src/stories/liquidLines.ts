import { hsl } from "d3";
import { customElement, property } from "lit/decorators.js";
import { BeautifulBackground } from "../BeautifulBackground";

@customElement("bb-liquid-lines")
export class BbLiquidLines extends BeautifulBackground {
    @property({ type: Number, attribute: "line-count" })
    lineCount: number = 20;

    @property({ type: Number, attribute: "amplitude" })
    amplitude: number = 30;

    @property({ type: Number, attribute: "frequency" })
    frequency: number = 0.005;

    @property({ type: Number, attribute: "speed" })
    speed: number = 0.5;

    @property({ type: Number, attribute: "line-spacing" })
    lineSpacing: number = 40;

    @property({ type: Number, attribute: "line-width" })
    lineWidth: number = 2;

    @property({ type: Number, attribute: "hue-start" })
    hueStart: number = 200;

    @property({ type: Number, attribute: "hue-end" })
    hueEnd: number = 280;

    @property({ type: Number, attribute: "saturation" })
    saturation: number = 80;

    @property({ type: Number, attribute: "offset-step" })
    offsetStep: number = 0.2;

    @property({ type: Number, attribute: "wiggle-amplitude" })
    wiggleAmplitude: number = 20;

    @property({ type: Number, attribute: "wiggle-speed" })
    wiggleSpeed: number = 0.3;

    private time: number = 0;

    protected loop(deltaTime: number): void {
        this.time += deltaTime;

        this.ctx.fillStyle = `rgba(${this.backgroundColor}, ${this.trailOpacity})`;
        this.ctx.fillRect(0, 0, this.width, this.height);

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

        const phaseOffset = index * this.offsetStep;

        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;

        // Gradient for 3D look
        const progress = index / this.lineCount;
        const currentHue =
            this.hueStart + (this.hueEnd - this.hueStart) * progress;
        // Lightness varies for a "depth" effect
        const baseLightness = 40;
        const depthLightness =
            baseLightness + Math.sin(this.time * 0.001 + index * 0.5) * 10;

        const color = hsl(
            currentHue,
            this.saturation / 100,
            depthLightness / 100,
        );
        ctx.strokeStyle = color.toString();

        for (let j = 0; j < points - 1; j++) {
            const x1 = j * step;
            const horizontalWave1 =
                Math.sin(
                    x1 * this.frequency + this.time * this.speed + phaseOffset,
                ) * this.amplitude;
            const verticalWiggle1 =
                Math.sin(this.time * this.wiggleSpeed + phaseOffset + index) *
                this.wiggleAmplitude;
            const y1 = baseY + horizontalWave1 + verticalWiggle1;

            const x2 = (j + 1) * step;
            const horizontalWave2 =
                Math.sin(
                    x2 * this.frequency + this.time * this.speed + phaseOffset,
                ) * this.amplitude;
            const verticalWiggle2 =
                Math.sin(this.time * this.wiggleSpeed + phaseOffset + index) *
                this.wiggleAmplitude;
            const y2 = baseY + horizontalWave2 + verticalWiggle2;

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            if (j === 0) {
                ctx.moveTo(x1, y1);
            }

            ctx.quadraticCurveTo(x1, y1, midX, midY);
        }

        ctx.stroke();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-liquid-lines": BbLiquidLines;
    }
}
