import { customElement, property } from "lit/decorators.js";
import { BeautifulBackground } from "../BeautifulBackground";
import { toRgb } from "../utils/color";
import { stringToArrayConverter } from "../utils/lit";

/** Red, magenta, violet, blue and yellow, like a sunset seen through slats. */
const DEFAULT_COLORS = ["#c41e3a", "#e0218a", "#6a2c9e", "#3b4fa8", "#f5c800"];
/** A slat's shade across its width: [where, black or white, opacity]. */
const SHADE = [
    [0, "0, 0, 0", 0.5],
    [0.35, "0, 0, 0", 0],
    [0.7, "255, 255, 255", 0],
    [1, "255, 255, 255", 0.85],
] as const;
/** How far each patch of the wash wanders from the middle, as a share. */
const WANDER = 0.45;
/** How far a patch's color reaches, as a share of the canvas's diagonal. */
const REACH = 0.5;

/**
 * A slowly moving wash of colors seen through a row of even slats, each dark
 * along one edge and nearly white along the other.
 */
@customElement("bb-gradient-slats")
export class BbGradientSlats extends BeautifulBackground {
    @property({
        type: Array,
        attribute: "wash-colors",
        converter: stringToArrayConverter,
    })
    washColors: string[] = DEFAULT_COLORS;

    /** How many slats lie across the background, at least 2. */
    @property({ type: Number, attribute: "slat-amount" })
    slatAmount: number = 27;

    /** How far the slats lean, in degrees clockwise: 0 stands upright. */
    @property({ type: Number, attribute: "slat-angle" })
    slatAngle: number = 0;

    /**
     * Whether each slat shows the whole wash squeezed to its width, every
     * other one turned upside down, instead of its own part of the wash.
     */
    @property({ type: Boolean, attribute: "slat-flip" })
    slatFlip: boolean = false;

    /** How strongly each slat is shaded dark to white, from 0 (flat) to 1. */
    @property({ type: Number, attribute: "slat-shade" })
    slatShade: number = 1;

    /** How fast the wash wanders: 2 is twice as fast, 0 stands still. */
    @property({ type: Number, attribute: "speed" })
    speed: number = 1;

    // The wash covers the whole canvas each frame, so there is no trail.
    trailOpacity: number = 1;
    cleanTrail: boolean = false;

    /** How far the wash has wandered, in seconds at speed 1. */
    private time: number = 0;

    /** The wash colors as "r, g, b", read once a frame and not per slat. */
    private rgbs: string[] = [];

    protected loop(deltaTime: number): void {
        this.time += deltaTime * (Math.max(0, this.speed) || 0);
        this.rgbs = this.colors().map((color) => toRgb(color).join(", "));
        this.drawWash();
        this.drawSlats();
    }

    private colors(): string[] {
        return this.washColors.length > 0 ? this.washColors : DEFAULT_COLORS;
    }

    private drawWash(): void {
        const { ctx, width, height } = this;
        const reach = REACH * Math.hypot(width, height);

        ctx.fillStyle = this.colors()[0];
        ctx.fillRect(0, 0, width, height);
        this.rgbs.forEach((rgb, i) => {
            // Each patch loops on its own slow path, crossing a quarter of the
            // canvas in about 10 s at speed 1, however many colors there are.
            const pace = 0.05 + 0.01 * (i % 3);
            const x =
                width * (0.5 + WANDER * Math.sin(this.time * pace + i * 2.4));
            const y =
                height *
                (0.5 + WANDER * Math.cos(this.time * pace * 1.3 + i * 1.7));
            const patch = ctx.createRadialGradient(x, y, 0, x, y, reach);
            patch.addColorStop(0, `rgba(${rgb}, 1)`);
            patch.addColorStop(1, `rgba(${rgb}, 0)`);
            ctx.fillStyle = patch;
            ctx.fillRect(0, 0, width, height);
        });
    }

    private drawSlats(): void {
        const { ctx, width, height } = this;
        const angle = ((this.slatAngle || 0) * Math.PI) / 180;
        const cos = Math.abs(Math.cos(angle));
        const sin = Math.abs(Math.sin(angle));
        // The canvas's extent across the slats and along them.
        const across = width * cos + height * sin;
        const along = width * sin + height * cos;
        // At least 2, and none narrower than a pixel, however many are asked for.
        const wanted = Math.round(this.slatAmount) || 2;
        const amount = Math.min(
            Math.max(2, wanted),
            Math.max(2, Math.floor(across)),
        );
        const slat = across / amount;
        const strength = Math.min(1, Math.max(0, this.slatShade));
        const shade = Number.isNaN(strength) ? 1 : strength;

        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(angle);
        for (let i = 0; i < amount; i++) {
            const left = -across / 2 + i * slat;
            if (this.slatFlip)
                this.drawFlipped(left, slat, along, angle, i % 2 === 1);
            if (shade === 0) continue;
            const fill = ctx.createLinearGradient(left, 0, left + slat, 0);
            for (const [where, rgb, opacity] of SHADE) {
                fill.addColorStop(where, `rgba(${rgb}, ${opacity * shade})`);
            }
            ctx.fillStyle = fill;
            ctx.fillRect(left, -along / 2, slat, along);
        }
        ctx.restore();
    }

    /** Squeezes the whole wash into one slat, turned upside down if asked. */
    private drawFlipped(
        left: number,
        slat: number,
        along: number,
        angle: number,
        turned: boolean,
    ): void {
        const { ctx, width, height } = this;
        ctx.save();
        ctx.beginPath();
        ctx.rect(left, -along / 2, slat, along);
        ctx.clip();
        ctx.translate(left + slat / 2, 0);
        // Turn back upright, so the wash keeps its own up and down on screen,
        // and fit it to the slat's box on screen.
        ctx.rotate(-angle + (turned ? Math.PI : 0));
        const cos = Math.abs(Math.cos(angle));
        const sin = Math.abs(Math.sin(angle));
        ctx.scale(
            (slat * cos + along * sin) / width,
            (slat * sin + along * cos) / height,
        );
        ctx.translate(-width / 2, -height / 2);
        this.drawWash();
        ctx.restore();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-gradient-slats": BbGradientSlats;
    }
}
