import { customElement, property } from "lit/decorators.js";
import { BeautifulBackground } from "../BeautifulBackground";
import { toRgb } from "../utils/color";
import { stringToArrayConverter } from "../utils/lit";

const DEFAULT_COLORS = ["#78c8ff", "#0064ff"];

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
    ringColors: string[] = DEFAULT_COLORS;

    @property({ type: Number, attribute: "ring-amplitude" })
    ringAmplitude: number = 15;

    @property({ type: Number, attribute: "ring-spacing" })
    ringSpacing: number = 40;

    protected loop(): void {
        const time = performance.now() * 0.001;

        this.fadeTrail();

        for (let i = 0; i < this.ringCount; i++) {
            const pulse = Math.sin(time * 2 * this.pulseSpeed + i * 0.4);
            const r = 50 + i * this.ringSpacing + pulse * this.ringAmplitude;
            const alpha = 0.08 + (i / this.ringCount) * 0.15;

            this.drawRing(r, this.ringColor(i, time), alpha);
        }
    }

    /** The ring's color, flowing outwards through `ringColors` over time. */
    private ringColor(index: number, time: number): string {
        const colors =
            this.ringColors.length > 0 ? this.ringColors : DEFAULT_COLORS;
        const progress = (index / (this.ringCount - 1 || 1) + time * 0.2) % 1;
        const segment = 1 / (colors.length - 1 || 1);
        const idx = Math.max(
            0,
            Math.min(Math.floor(progress / segment), colors.length - 2),
        );
        const t = (progress - idx * segment) / segment;
        const from = toRgb(colors[idx]);
        const to = toRgb(colors[idx + 1] ?? colors[idx]);

        return from.map((c, k) => Math.round(c + (to[k] - c) * t)).join(", ");
    }

    private drawRing(r: number, color: string, alpha: number): void {
        if (r < 0) return;
        this.ctx.beginPath();
        this.ctx.arc(this.width / 2, this.height / 2, r, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(${color}, ${alpha})`;
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-concentric-pulse": BbConcentricPulse;
    }
}
