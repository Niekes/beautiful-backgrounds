import { customElement, property } from "lit/decorators.js";
import { BeautifulBackground } from "../BeautifulBackground";
import { toHsl } from "../utils/color";

/** The color of the linked Waves, Vanta's own blue. */
const DEFAULT_COLOR = "#005588";
/** How many rows the silk is drawn in, from its far edge to the front. */
// ponytail: a fixed count, so a 4K screen costs as much as a phone; add a
// resolution attribute if anyone needs it smoother.
const ROWS = 64;
/** How many colors each strip runs through, from its left to its right. */
const COLUMNS = 48;
/** Where the silk's far edge lies, as a share of the height. */
const HORIZON = 0.2;
/** Where the silk's near edge lies, as a share of the height. */
const BOTTOM = 1.06;
/**
 * The share of the silk's way to the front its colors take to fade in from
 * the background.
 */
const FADE = 0.22;
/** The world half-width and depth of the silk's front row, in wave lengths. */
const WORLD_WIDTH = 3;
const WORLD_DEPTH = 20;
/**
 * How far the silk reaches, as a share: it also sets where its far edge
 * sinks below the horizon, and how small its waves look from that far.
 */
const REACH = 0.65;
/**
 * The longest step a frame takes, in seconds: after a long pause, one big
 * step would roll the waves across the canvas in a jump.
 */
const MAX_STEP = 1 / 15;
/**
 * Three swells crossing the silk, each a wave traveling towards the viewer:
 * [1 wave length across, 1 wave length deep, 1 loop per second, its weight].
 */
const SWELLS: readonly (readonly [number, number, number, number])[] = [
    [1.1, 0.9, 0.7, 1],
    [-0.7, 1.4, 1.3, 0.55],
    [2.1, 0.5, 0.5, 0.3],
];
const SWELL_WEIGHT = SWELLS.reduce((sum, [, , , weight]) => sum + weight, 0);

/** A row's curve across the canvas, and the swell under each point. */
type Curve = {
    xs: number[];
    ys: number[];
    swells: number[];
};

/**
 * A sea of rolling waves in one color, shaded from its troughs to its crests,
 * seen from above its front. After "Waves" from Vanta by Teng Bao (MIT):
 * https://github.com/tengbao/vanta/blob/master/src/vanta.waves.js
 */
@customElement("bb-silk-waves")
export class BbSilkWaves extends BeautifulBackground {
    @property({ type: String, attribute: "silk-color" })
    silkColor: string = DEFAULT_COLOR;

    /** How high the nearest waves rise, as a share of the height. */
    @property({ type: Number, attribute: "swell" })
    swell: number = 0.2;

    /** How brightly the crests shine above the troughs: 1 is glassy, 0 matte. */
    @property({ type: Number, attribute: "sheen" })
    sheen: number = 0.73;

    /**
     * How far the silk reaches into the distance: at 2 its waves lie twice
     * as far away and half as large as at 1.
     */
    @property({ type: Number, attribute: "reach" })
    reach: number = REACH;

    /** How fast the waves roll: 2 is twice as fast, 0 stands still. */
    @property({ type: Number, attribute: "speed" })
    speed: number = 1;

    // Repainted from its far edge to its front every frame, so the silk
    // leaves no trail, and it covers the canvas's own background.
    trailOpacity: number = 1;
    cleanTrail: boolean = false;

    private time: number = 0;

    protected loop(deltaTime: number): void {
        // Garbage attributes fall back to standing still instead of NaN.
        const step = Math.min(deltaTime, MAX_STEP) * Math.max(0, this.speed);
        this.time += step || 0;
        this.drawSea();
    }

    private drawSea(): void {
        const swell = Math.max(0, this.swell) || 0;
        const sheen = Math.min(1, Math.max(0, this.sheen)) || 0;
        const reach = this.reach > 0 ? this.reach : REACH;
        const { h, s, l } = toHsl(this.silkColor || DEFAULT_COLOR);
        // The lightness of a wave's crest; its trough keeps the color's own.
        const crest = Math.min(0.95, l + 0.55 * sheen);
        // The far edge's ground, in squared screen depth: the further the
        // silk reaches, the more its rows crowd the horizon.
        const far = Math.min(0.5, Math.max(0.01, 0.06 / reach));
        const far2 = far * far;

        const ctx = this.ctx;
        this.fadeTrail();
        for (let i = 0; i < ROWS; i++) {
            const n2 = far2 + (1 - far2) * (i / ROWS);
            this.paintRow(
                ctx,
                this.curve(n2, swell, reach),
                h,
                s,
                l,
                crest,
                Math.min(1, n2 / FADE),
            );
        }
        ctx.globalAlpha = 1;
    }

    /**
     * The silk's curve at `n2` squared screen depth from its far edge, from
     * the left edge of the canvas to the right.
     */
    private curve(n2: number, swell: number, reach: number): Curve {
        const { width, height } = this;
        const baseline = height * (HORIZON + (BOTTOM - HORIZON) * n2);
        const halfSpan = width * (0.55 + 0.45 * n2);
        const amp = (swell * height * n2) / reach;
        const x = (u: number): number => (u * WORLD_WIDTH * reach) / n2;
        const z = (WORLD_DEPTH * reach) / n2;

        const curve: Curve = { xs: [], ys: [], swells: [] };
        for (let j = 0; j <= COLUMNS; j++) {
            const u = (j / COLUMNS) * 2 - 1;
            const swellAtPoint = swellHeight(x(u), z, this.time);
            curve.xs.push(width / 2 + u * halfSpan);
            curve.ys.push(baseline - amp * swellAtPoint);
            curve.swells.push(swellAtPoint);
        }
        return curve;
    }

    /**
     * Paints the sea's row over everything farther than it: its curve across
     * the canvas, and everything below it down to the front.
     */
    private paintRow(
        ctx: CanvasRenderingContext2D,
        curve: Curve,
        hue: number,
        saturation: number,
        trough: number,
        crest: number,
        alpha: number,
    ): void {
        const from = curve.xs[0];
        const to = curve.xs[COLUMNS];
        const gradient = ctx.createLinearGradient(from, 0, to, 0);
        curve.swells.forEach((swell, j) => {
            const at = (curve.xs[j] - from) / (to - from);
            const lightness = trough + (crest - trough) * ((swell + 1) / 2);
            gradient.addColorStop(
                at,
                `hsl(${Math.round(hue)}, ${Math.round(saturation * 100)}%, ${(
                    lightness * 100
                ).toFixed(1)}%)`,
            );
        });

        ctx.beginPath();
        curve.xs.forEach((x, j) => {
            if (j === 0) ctx.moveTo(x, curve.ys[j]);
            else ctx.lineTo(x, curve.ys[j]);
        });
        ctx.lineTo(to, this.height + 1);
        ctx.lineTo(from, this.height + 1);
        ctx.closePath();

        ctx.globalAlpha = alpha;
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

/** The height of the swell at (x, z) in world units, from -1 to 1. */
function swellHeight(x: number, z: number, time: number): number {
    let height = 0;
    for (const [kx, kz, tempo, weight] of SWELLS) {
        height += weight * Math.sin(kx * x + kz * z + tempo * time);
    }
    return height / SWELL_WEIGHT;
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-silk-waves": BbSilkWaves;
    }
}
