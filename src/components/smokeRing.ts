import { customElement, property } from "lit/decorators.js";
import { BeautifulBackground } from "../BeautifulBackground";
import { toRgb } from "../utils/color";
import { stringToArrayConverter } from "../utils/lit";

/** Halo's own rainbow. */
const DEFAULT_COLORS = [
    "#b24c8b",
    "#9f972d",
    "#68c44f",
    "#15caa8",
    "#00abea",
    "#156aff",
    "#6810ff",
    "#9f00d7",
];
/**
 * The smoke is worked out pixel by pixel in a buffer of about this many
 * pixels, and stretched over the canvas.
 */
// ponytail: a fixed budget, so a 4K screen costs as much as a phone and only
// looks softer; add a resolution attribute if anyone needs it sharper.
const BUFFER_PIXELS = 150_000;
/** How much nearer the middle each frame takes its smoke from, at 60 fps. */
const DRIFT = 0.996;
/**
 * How far each frame shifts the smoke at 60 fps, as a share of the buffer,
 * in a direction that turns SPIN_TURN radians per second.
 */
const SPIN = 0.001;
const SPIN_TURN = 0.35;
/**
 * How far smoke pushes itself each frame at 60 fps, as a share of the buffer:
 * sideways by its green, and up or down by its red. Smoke darker than
 * SWIRL_REST pushes the other way, so the smoke leans down and to the left.
 */
const SWIRL = 0.01;
const SWIRL_REST = 0.2;
/** The share of each pixel's smoke that comes from where its colors push it. */
const SWIRL_SHARE = 0.4;
/** The share of `trailOpacity` that each frame takes off every pixel outright. */
const FADE_FLOOR = 0.3;
/**
 * Further in than this share of its radius, the ring's light is too faint to
 * see.
 */
const RING_INNER = 0.6;
/** The waves around the ring. */
const WAVES = 7;
/** How fast the waves turn, and swell and shrink, in radians per second. */
const WAVE_TURN = 0.5;
const WAVE_SWELL = 1.5;
/** Seconds the ring takes to run through all its colors. */
const COLOR_LOOP = 3;
/**
 * The longest step a frame takes, in seconds: after a long pause, one big
 * step would push the smoke across the canvas in a jump.
 */
const MAX_STEP = 1 / 15;

/**
 * Smoke drifts outward from a ring of light in the middle, swirling where its
 * own colors push it. After "Halo" from Vanta by Teng Bao (MIT):
 * https://github.com/tengbao/vanta/blob/master/src/vanta.halo.js
 */
@customElement("bb-smoke-ring")
export class BbSmokeRing extends BeautifulBackground {
    @property({
        type: Array,
        attribute: "ring-colors",
        converter: stringToArrayConverter,
    })
    ringColors: string[] = DEFAULT_COLORS;

    /** The ring's radius, as a share of the shorter side. */
    @property({ type: Number, attribute: "ring-size" })
    ringSize: number = 0.2;

    /** How far the ring's waves swell, as a share of its radius. */
    @property({ type: Number, attribute: "ring-wobble" })
    ringWobble: number = 0.03;

    /** How fast everything moves: 2 is twice as fast, 0 stands still. */
    @property({ type: Number, attribute: "speed" })
    speed: number = 1;

    // The smoke fades slowly, so it can drift far, in its own buffer: the
    // canvas shows the buffer whole, background included.
    trailOpacity: number = 0.005;
    cleanTrail: boolean = false;

    private time: number = 0;
    private columns: number = 0;
    private rows: number = 0;
    /** The light of each pixel of the buffer, as red, green and blue from 0 to 1. */
    private smoke: Float32Array = new Float32Array();
    /** The next frame's smoke, worked out from this one's. */
    private next: Float32Array = new Float32Array();
    /**
     * The smoke as it shows: each pixel's light mixed with its four
     * neighbours'. The smoke pushes itself by these colors too, so that
     * neighbouring pixels push alike and its edges grow smooth instead of
     * jagged.
     */
    private soft: Float32Array = new Float32Array();
    private image: ImageData = new ImageData(1, 1);
    private buffer: HTMLCanvasElement = document.createElement("canvas");
    /** The size the buffer was made for. */
    private builtFor: string = "";

    protected initialize(): void {
        const scale = Math.min(
            1,
            Math.sqrt(BUFFER_PIXELS / (this.width * this.height)),
        );
        this.columns = Math.max(1, Math.round(this.width * scale));
        this.rows = Math.max(1, Math.round(this.height * scale));
        this.smoke = new Float32Array(this.columns * this.rows * 3);
        this.next = new Float32Array(this.smoke.length);
        this.soft = new Float32Array(this.smoke.length);
        this.image = new ImageData(this.columns, this.rows);
        this.buffer.width = this.columns;
        this.buffer.height = this.rows;
        this.builtFor = this.size();
    }

    protected loop(deltaTime: number): void {
        // A new size starts the smoke over.
        if (this.builtFor !== this.size()) this.initialize();

        const step = Math.min(deltaTime, MAX_STEP) * Math.max(0, this.speed);
        this.time += step;
        this.drift(60 * step);
        this.shine(60 * step);
        this.soften();
        this.show();
    }

    private size(): string {
        return `${this.width} ${this.height}`;
    }

    /**
     * Moves the smoke on by `frames` frames at 60 fps: each pixel takes most
     * of its smoke from a little nearer the middle and a little off to the
     * side, and the rest from where its own colors push it.
     */
    private drift(frames: number): void {
        const { columns, rows, soft } = this;
        const zoom = DRIFT ** frames;
        const fade = Math.min(1, Math.max(0, this.trailOpacity));
        const keep = (1 - fade) ** frames;
        const floor = FADE_FLOOR * fade * frames;
        const pushX = SWIRL * columns * frames;
        const pushY = SWIRL * rows * frames;
        const cx = (columns - 1) / 2;
        const cy = (rows - 1) / 2;
        const spinX = SPIN * columns * frames * Math.cos(SPIN_TURN * this.time);
        const spinY = SPIN * rows * frames * Math.sin(SPIN_TURN * this.time);

        this.next.fill(0);
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
                const i = (y * columns + x) * 3;
                this.takeSmoke(
                    cx + (x - cx) * zoom + spinX,
                    cy + (y - cy) * zoom + spinY,
                    1 - SWIRL_SHARE,
                    i,
                );
                this.takeSmoke(
                    x + (soft[i + 1] - SWIRL_REST) * pushX,
                    y - (soft[i] - SWIRL_REST) * pushY,
                    SWIRL_SHARE,
                    i,
                );
                for (let k = i; k < i + 3; k++) {
                    this.next[k] = Math.max(0, this.next[k] - floor) * keep;
                }
            }
        }
        [this.smoke, this.next] = [this.next, this.smoke];
    }

    /**
     * Adds `share` of the smoke at (x, y), between pixels, to the next frame's
     * pixel `i`. Outside the buffer, it takes the nearest edge.
     */
    private takeSmoke(x: number, y: number, share: number, i: number): void {
        const { columns, rows, smoke } = this;
        x = Math.min(Math.max(x, 0), columns - 1);
        y = Math.min(Math.max(y, 0), rows - 1);
        const x0 = Math.floor(x);
        const y0 = Math.floor(y);
        const x1 = Math.min(x0 + 1, columns - 1);
        const y1 = Math.min(y0 + 1, rows - 1);
        const tx = x - x0;
        const ty = y - y0;
        const a = (y0 * columns + x0) * 3;
        const b = (y0 * columns + x1) * 3;
        const c = (y1 * columns + x0) * 3;
        const d = (y1 * columns + x1) * 3;

        for (let k = 0; k < 3; k++) {
            const top = smoke[a + k] + (smoke[b + k] - smoke[a + k]) * tx;
            const bottom = smoke[c + k] + (smoke[d + k] - smoke[c + k]) * tx;
            this.next[i + k] += (top + (bottom - top) * ty) * share;
        }
    }

    /** Adds the light the ring gives off in `frames` frames at 60 fps. */
    private shine(frames: number): void {
        const color = this.ringColor();
        const radius = this.ringSize * Math.min(this.columns, this.rows);
        const cx = (this.columns - 1) / 2;
        const cy = (this.rows - 1) / 2;
        const swell = this.ringWobble * Math.sin(WAVE_SWELL * this.time);
        const turn = WAVE_TURN * this.time;
        const inner = RING_INNER - Math.abs(swell);
        const outer = 1 + Math.abs(swell);

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                const distance = Math.hypot(x - cx, y - cy) / radius;
                // Also skips the middle of a ring of size 0, where it is NaN.
                if (!(distance >= inner && distance <= outer)) continue;

                const angle = Math.atan2(y - cy, x - cx);
                const wave = swell * Math.sin(WAVES * angle + turn);
                const strength = ringLight(Math.abs(distance + wave)) * frames;
                const i = (y * this.columns + x) * 3;
                for (let k = 0; k < 3; k++) {
                    const light = this.smoke[i + k] + color[k] * strength;
                    this.smoke[i + k] = Math.min(1, light);
                }
            }
        }
    }

    /** The ring's color now, from 0 to 1, on its way from one color to the next. */
    private ringColor(): number[] {
        const colors = (
            this.ringColors.length > 0 ? this.ringColors : DEFAULT_COLORS
        ).map(toRgb);
        const at = ((this.time / COLOR_LOOP) % 1) * colors.length;
        const from = colors[Math.floor(at)];
        const to = colors[(Math.floor(at) + 1) % colors.length];
        const t = at - Math.floor(at);
        return from.map(
            (channel, i) => (channel + (to[i] - channel) * t) / 255,
        );
    }

    /** Mixes each pixel's light with its four neighbours' into `soft`. */
    private soften(): void {
        const { columns, rows, smoke } = this;
        for (let y = 0; y < rows; y++) {
            const above = Math.max(y - 1, 0) * columns;
            const below = Math.min(y + 1, rows - 1) * columns;
            for (let x = 0; x < columns; x++) {
                const i = (y * columns + x) * 3;
                const left = (y * columns + Math.max(x - 1, 0)) * 3;
                const right = (y * columns + Math.min(x + 1, columns - 1)) * 3;
                const up = (above + x) * 3;
                const down = (below + x) * 3;
                for (let k = 0; k < 3; k++) {
                    this.soft[i + k] =
                        (smoke[i + k] +
                            smoke[left + k] +
                            smoke[right + k] +
                            smoke[up + k] +
                            smoke[down + k]) /
                        5;
                }
            }
        }
    }

    /** Paints the soft smoke onto the background, adding its light. */
    private show(): void {
        const pixels = this.image.data;
        for (let i = 0, j = 0; i < this.soft.length; i += 3, j += 4) {
            pixels[j] = this.soft[i] * 255;
            pixels[j + 1] = this.soft[i + 1] * 255;
            pixels[j + 2] = this.soft[i + 2] * 255;
            pixels[j + 3] = 255;
        }
        this.buffer.getContext("2d")!.putImageData(this.image, 0, 0);

        const ctx = this.ctx;
        this.drawBackground(ctx);
        ctx.globalCompositeOperation = "lighter";
        ctx.drawImage(this.buffer, 0, 0, this.width, this.height);
        ctx.globalCompositeOperation = "source-over";
    }
}

/**
 * How brightly the ring shines at `edge` times its radius: a thin line just
 * inside it, with faint light further in. Halo's own curve.
 */
function ringLight(edge: number): number {
    const fade = Math.min(1, Math.max(0, (1 - edge) / 0.1));
    return edge ** 20 * fade * fade * (3 - 2 * fade);
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-smoke-ring": BbSmokeRing;
    }
}
