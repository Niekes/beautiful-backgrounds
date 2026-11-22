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
/** The wash is painted at this share of the canvas's size and stretched. */
const WASH_SCALE = 1 / 8;

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

    /** How fast the wash wanders: 2 is twice as fast, 0 stands still. */
    @property({ type: Number, attribute: "speed" })
    speed: number = 1;

    // The wash covers the whole canvas each frame, so there is no trail.
    trailOpacity: number = 1;
    cleanTrail: boolean = false;
    // Blurry washes and smooth shades: extra pixels only cost time.
    protected maxPixelRatio: number = 1;

    /** How far the wash has wandered, in seconds at speed 1. */
    private time: number = 0;
    /** The wash, painted small and stretched over the canvas each frame. */
    private wash: HTMLCanvasElement = document.createElement("canvas");
    /** The wash colors as "r, g, b", and the colors they were made from. */
    private washRgbs: string[] = [];
    private washRgbsFor: string = "";
    /** The slats, drawn once, and the settings they were drawn for. */
    private slats: HTMLCanvasElement = document.createElement("canvas");
    private slatsFor: string = "";

    protected loop(deltaTime: number): void {
        this.time += deltaTime * (Math.max(0, this.speed) || 0);
        this.drawWash();
        this.drawSlats();
    }

    private drawWash(): void {
        const { width, height, wash } = this;
        const colors =
            this.washColors.length > 0 ? this.washColors : DEFAULT_COLORS;
        const colorsKey = colors.join(",");
        if (this.washRgbsFor !== colorsKey) {
            this.washRgbs = colors.map((color) => toRgb(color).join(", "));
            this.washRgbsFor = colorsKey;
        }
        const reach = REACH * Math.hypot(width, height);
        const columns = Math.max(1, Math.ceil(width * WASH_SCALE));
        const rows = Math.max(1, Math.ceil(height * WASH_SCALE));
        if (wash.width !== columns) wash.width = columns;
        if (wash.height !== rows) wash.height = rows;

        const ctx = wash.getContext("2d")!;
        // Painted in the canvas's own px, so the patches keep their paths.
        ctx.setTransform(
            columns / (width || 1),
            0,
            0,
            rows / (height || 1),
            0,
            0,
        );
        // Cleared, so translucent colors build up over the canvas, not twice.
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = colors[0];
        ctx.fillRect(0, 0, width, height);
        this.washRgbs.forEach((rgb, i) => {
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
        this.ctx.drawImage(wash, 0, 0, width, height);
    }

    /** Copies in the slats, drawing them first if their settings changed. */
    private drawSlats(): void {
        const { width, height, slatAngle, slatAmount } = this;
        const settings = `${width} ${height} ${slatAngle} ${slatAmount}`;
        if (this.slatsFor !== settings) {
            this.slats.width = this.canvas.width;
            this.slats.height = this.canvas.height;
            const ctx = this.slats.getContext("2d")!;
            // The canvas's own scale, so the slats copy over pixel for pixel.
            ctx.setTransform(this.ctx.getTransform());
            this.paintSlats(ctx);
            this.slatsFor = settings;
        }
        // A canvas shrunk to 0 px has no slats, and drawImage throws on it.
        if (!this.slats.width || !this.slats.height) return;
        this.ctx.drawImage(this.slats, 0, 0, width, height);
    }

    /** Paints the slats, each dark along one edge and nearly white along the other. */
    private paintSlats(ctx: CanvasRenderingContext2D): void {
        const { width, height } = this;
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

        ctx.translate(width / 2, height / 2);
        ctx.rotate(angle);
        for (let i = 0; i < amount; i++) {
            const left = -across / 2 + i * slat;
            const shade = ctx.createLinearGradient(left, 0, left + slat, 0);
            for (const [where, rgb, opacity] of SHADE) {
                shade.addColorStop(where, `rgba(${rgb}, ${opacity})`);
            }
            ctx.fillStyle = shade;
            ctx.fillRect(left, -along / 2, slat, along);
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-gradient-slats": BbGradientSlats;
    }
}
