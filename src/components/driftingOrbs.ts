import { customElement, property } from "lit/decorators.js";
import { BeautifulBackground } from "../BeautifulBackground";
import { gradient } from "../utils/color";
import { stringToArrayConverter } from "../utils/lit";
import { createTerrain, type Terrain } from "../utils/terrain";

/**
 * Dark, muted colors around the wheel from blue, like the original: hues 220
 * to 160 at 60% saturation and 30% lightness. Hex, since the attribute
 * splits on commas.
 */
const DEFAULT_COLORS = [
    "#1f3d7a",
    "#5c1f7a",
    "#7a1f3d",
    "#7a5c1f",
    "#3d7a1f",
    "#1f7a5c",
];
const DEFAULT_SIZE = 300;
/** How many colors the orbs pick from, evenly through the orb colors. */
const SHADES = 64;
/** How long one pass through the orb colors takes at speed 1, in seconds. */
const CYCLE = 6;
/** How far an orb's spot moves its color off the cycle, as a share of the colors. */
const SPOT_SHIFT = 1 / 6;
/** The size of the patches of matching colors, in px. */
const PATCH = 650;
/** The orbs are drawn and blurred at 1/SCALE of the size: as soft, far cheaper. */
const SCALE = 8;
/** The longest frame an orb moves for, in seconds, so tab switches don't jump. */
const MAX_STEP = 0.1;

type Orb = {
    x: number;
    y: number;
    /** How fast it drifts, in px per second. */
    vx: number;
    vy: number;
    age: number;
    /** How long it lives, in seconds. */
    life: number;
    radius: number;
    color: string;
};

/**
 * Large, soft orbs of color that drift, fade in and out, and slowly shift
 * through their colors, all blurred together.
 *
 * Based on "Shift" from Ambient Canvas Backgrounds by Sean Free (Codrops):
 * https://github.com/crnacura/AmbientCanvasBackgrounds
 */
@customElement("bb-drifting-orbs")
export class BbDriftingOrbs extends BeautifulBackground {
    @property({
        type: Array,
        attribute: "orb-colors",
        converter: stringToArrayConverter,
    })
    orbColors: string[] = DEFAULT_COLORS;

    @property({ type: Number, attribute: "orb-amount" })
    orbAmount: number = 150;

    /** The largest an orb's radius gets, in px; the smallest is a third of it. */
    @property({ type: Number, attribute: "orb-size" })
    orbSize: number = DEFAULT_SIZE;

    /** How far the orbs blur, in px: 0 turns it off. */
    @property({ type: Number, attribute: "orb-blur" })
    orbBlur: number = 50;

    /** How fast the orbs drift, live and shift their colors. */
    @property({ type: Number, attribute: "speed" })
    speed: number = 1;

    bgColors: string[] = ["#0d0d0d"];
    // The original starts each frame clean; a lower trail opacity leaves streaks.
    trailOpacity: number = 1;
    protected maxPixelRatio: number = 1;

    private terrain: Terrain = createTerrain();
    private time: number = 0;
    private orbs: Orb[] = [];
    private shades: string[] = [];
    /** This frame's orbs, sharp and small. */
    private layer: HTMLCanvasElement = document.createElement("canvas");
    /** The layer blurred, then stretched over the canvas. */
    private haze: HTMLCanvasElement = document.createElement("canvas");
    /** The settings the orbs were made for. A resize keeps them. */
    private builtFor: string = "";

    protected initialize(): void {
        const colors =
            this.orbColors.length > 0 ? this.orbColors : DEFAULT_COLORS;
        // The first color again at the end, so the cycle wraps around smoothly.
        this.shades = gradient([...colors, colors[0]], SHADES);
        this.orbs = Array.from({ length: this.amount() }, () => this.spawn());
        this.builtFor = this.settings();
    }

    protected loop(deltaTime: number): void {
        if (this.builtFor !== this.settings()) this.initialize();
        this.fitLayers();

        const step =
            Math.min(deltaTime, MAX_STEP) * (Math.max(0, this.speed) || 0);
        this.time += step;
        this.fadeTrail();
        this.drawOrbs(step);
        this.addHaze();
    }

    private settings(): string {
        return [this.amount(), this.radius(), this.orbColors].join(" ");
    }

    private amount(): number {
        return Math.max(0, Math.round(this.orbAmount) || 0);
    }

    private radius(): number {
        return Math.max(1, this.orbSize) || DEFAULT_SIZE;
    }

    private fitLayers(): void {
        // At least 1px: drawing a canvas of size 0 throws and stops the animation.
        const width = Math.max(1, Math.ceil(this.width / SCALE));
        const height = Math.max(1, Math.ceil(this.height / SCALE));
        for (const canvas of [this.layer, this.haze]) {
            // Setting the size clears the canvas, so only when it changed.
            if (canvas.width !== width) canvas.width = width;
            if (canvas.height !== height) canvas.height = height;
        }
    }

    private spawn(): Orb {
        const x = Math.random() * this.width;
        const y = Math.random() * this.height;
        // Each height is about 0.5 ± 0.25, so this is -1 to 1 once clamped.
        const spot = (this.terrain(x / PATCH, y / PATCH) - 0.5) * 4;
        const cycle =
            this.time / CYCLE + Math.min(1, Math.max(-1, spot)) * SPOT_SHIFT;
        const angle = Math.random() * 2 * Math.PI;
        // 0.1 to 1.1 px per frame at 60 fps, like the original.
        const pace = (0.1 + Math.random()) * 60;
        const largest = this.radius();
        return {
            x,
            y,
            vx: Math.cos(angle) * pace,
            vy: Math.sin(angle) * pace,
            age: 0,
            life: 2.5 + Math.random() * 3.3,
            radius: largest / 3 + Math.random() * ((largest * 2) / 3),
            color: this.shades[
                Math.floor((cycle - Math.floor(cycle)) * SHADES)
            ],
        };
    }

    /** Moves every orb and draws it onto the small layer. */
    private drawOrbs(step: number): void {
        const layer = this.layer.getContext("2d")!;
        layer.setTransform(1 / SCALE, 0, 0, 1 / SCALE, 0, 0);
        layer.clearRect(0, 0, this.width, this.height);

        for (const orb of this.orbs) {
            // Fades in over the first half of its life and out over the second.
            layer.globalAlpha = Math.max(
                0,
                1 - Math.abs((2 * orb.age) / orb.life - 1),
            );
            layer.fillStyle = orb.color;
            layer.beginPath();
            layer.arc(orb.x, orb.y, orb.radius, 0, 2 * Math.PI);
            layer.fill();

            orb.x += orb.vx * step;
            orb.y += orb.vy * step;
            orb.age += step;
            if (orb.age > orb.life || this.outside(orb)) {
                Object.assign(orb, this.spawn());
            }
        }
    }

    private outside({ x, y, radius }: Orb): boolean {
        return (
            x < -radius ||
            x > this.width + radius ||
            y < -radius ||
            y > this.height + radius
        );
    }

    /** Blurs the layer while it is small, then stretches it over the canvas. */
    private addHaze(): void {
        const blur = Math.max(0, this.orbBlur) || 0;
        let source = this.layer;
        if (blur > 0) {
            const haze = this.haze.getContext("2d")!;
            haze.clearRect(0, 0, this.haze.width, this.haze.height);
            haze.filter = `blur(${blur / SCALE}px)`;
            haze.drawImage(this.layer, 0, 0);
            haze.filter = "none";
            source = this.haze;
        }
        this.ctx.drawImage(source, 0, 0, this.width, this.height);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-drifting-orbs": BbDriftingOrbs;
    }
}
