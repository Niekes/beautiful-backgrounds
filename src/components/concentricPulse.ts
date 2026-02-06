import { customElement, property } from "lit/decorators.js";
import { BeautifulBackground } from "../BeautifulBackground";
import { stringToArrayConverter } from "../utils/lit";

@customElement("bb-concentric-pulse")
export class BbConcentricPulse extends BeautifulBackground {
    @property({ type: Number, attribute: "ring-count" })
    ringCount: number = 20;

    @property({ type: Number, attribute: "pulse-speed" })
    pulseSpeed: number = 0.5;

    @property({
        type: Array,
        attribute: "ring-colors",
        converter: stringToArrayConverter,
    })
    ringColors: string[] = ["#78c8ff", "#0064ff"];

    @property({ type: Number, attribute: "ring-amplitude" })
    ringAmplitude: number = 15;

    @property({ type: Number, attribute: "ring-spacing" })
    ringSpacing: number = 40;

    protected firstUpdated() {
        super.firstUpdated();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
    }

    private parseRGB(color: string): [number, number, number] {
        const hex = color.startsWith("#") ? color.slice(1) : color;
        if (hex.includes(",")) {
            return hex.split(",").map((v) => parseInt(v.trim())) as [
                number,
                number,
                number,
            ];
        }
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return [r, g, b];
    }

    private lerpColor(
        c1: [number, number, number],
        c2: [number, number, number],
        t: number,
    ): string {
        const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
        const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
        const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
        return `${r}, ${g}, ${b}`;
    }

    protected loop(): void {
        const now = performance.now();

        this.ctx.globalAlpha = this.trailOpacity;
        this.drawBackground(this.ctx);
        this.ctx.globalAlpha = 1.0;

        const time = now * 0.001;
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        for (let i = 0; i < this.ringCount; i++) {
            const t = time * 2 * this.pulseSpeed;
            const baseR = 50 + i * this.ringSpacing;
            const r = baseR + Math.sin(t + i * 0.4) * this.ringAmplitude;
            const alpha = 0.08 + (i / this.ringCount) * 0.15;

            // Flowing color calculation
            const colorProgress = i / (this.ringCount - 1 || 1);
            const animatedProgress = (colorProgress + time * 0.2) % 1;

            const colorCount = this.ringColors.length;
            const segment = 1 / (colorCount - 1 || 1);
            const idx = Math.min(
                Math.floor(animatedProgress / segment),
                colorCount - 2,
            );
            const localT = (animatedProgress - idx * segment) / segment;

            const c1 = this.parseRGB(this.ringColors[idx]);
            const c2 = this.parseRGB(
                this.ringColors[idx + 1] || this.ringColors[idx],
            );
            const currentColor = this.lerpColor(c1, c2, localT);

            this.drawCircle(centerX, centerY, r, currentColor, alpha, 1.2);
        }
    }

    private drawCircle(
        x: number,
        y: number,
        r: number,
        color: string,
        alpha: number,
        width: number = 1.5,
    ): void {
        if (r < 0) return;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(${color}, ${alpha})`;
        this.ctx.lineWidth = width;
        this.ctx.stroke();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-concentric-pulse": BbConcentricPulse;
    }
}
