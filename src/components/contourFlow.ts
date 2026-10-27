import { type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BeautifulBackground } from "../BeautifulBackground";
import { gradient } from "../utils/color";
import { stringToArrayConverter } from "../utils/lit";
import { createTerrain, type Terrain } from "../utils/terrain";

const DEFAULT_COLORS = ["#89964e"];
/** The flow is looked up on a grid of CELL × CELL px. */
const CELL = 10;
/** Particles roam this far beyond the edges, so lines enter from outside. */
const MARGIN = 100;
/**
 * Points on a circle around each cell, searched for the way downhill. The
 * original takes 100; 64 look the same and start a third faster.
 */
const SAMPLES = 64;
/** The circle's radius, in terrain units. */
const SAMPLE_RADIUS = 0.1;
/** How hard the flow turns a particle, per px it travels. */
const STEER = 3 / 2.2 ** 2;
/** Shades of the line colors, from the lowest ground to the highest. */
const SHADES = 128;
/** Waves of light on the way from the highest ground to the lowest. */
const PULSE_WAVES = 2;
/** How much a fade takes off the pixels it reaches. */
const FADE = 0.1;
/** The fade masks repeat every MASK_SIZE px. */
const MASK_SIZE = 64;

const CIRCLE = Array.from({ length: SAMPLES }, (_, i) => {
    const angle = (i / SAMPLES) * Math.PI * 2;
    return [Math.cos(angle) * SAMPLE_RADIUS, Math.sin(angle) * SAMPLE_RADIUS];
});

type FlowParticle = {
    x: number;
    y: number;
    /** The direction of travel, a unit vector (or zero before the first turn). */
    dx: number;
    dy: number;
    /** Seconds since it started, and how many it lives. */
    age: number;
    life: number;
};

/**
 * Particles flow downhill across an invisible terrain, and their faint lines
 * pile up into contour lines. After "topology" by Kjetil Midtgarden Golid
 * (MIT): https://github.com/kgolid/p5ycho/tree/master/topology
 */
@customElement("bb-contour-flow")
export class BbContourFlow extends BeautifulBackground {
    @property({ type: Number, attribute: "particle-count" })
    particleCount: number = 4500;

    /** The average life of a particle, in seconds. */
    @property({ type: Number, attribute: "particle-life" })
    particleLife: number = 6;

    /** How far the light swells and ebbs, from 0 (not at all) to 1. */
    @property({ type: Number, attribute: "pulse-strength" })
    pulseStrength: number = 0.5;

    /** Waves of light per second. */
    @property({ type: Number, attribute: "pulse-speed" })
    pulseSpeed: number = 0.1;

    @property({ type: Number, attribute: "line-opacity" })
    lineOpacity: number = 0.08;

    @property({ type: Number, attribute: "flow-speed" })
    flowSpeed: number = 132;

    @property({ type: Number, attribute: "terrain-size" })
    terrainSize: number = 3333;

    @property({
        type: Array,
        attribute: "line-colors",
        converter: stringToArrayConverter,
    })
    lineColors: string[] = DEFAULT_COLORS;

    // The lines fade slowly, so the picture never fills up.
    trailOpacity: number = 0.005;

    private cols: number = 0;
    private rows: number = 0;
    private terrain!: Terrain;
    /** The way downhill at each cell, as x, y pairs. */
    private flow: Float32Array = new Float32Array();
    private lowest: number = 0;
    private highest: number = 0;
    private shades: string[] = [];
    private fadeMasks: CanvasPattern[] = [];
    private fadeTurn: number = 0;
    private time: number = 0;
    private particles: FlowParticle[] = [];
    /** The size and settings the terrain and particles were made for. */
    private builtFor: string = "";

    protected initialize(): void {
        this.cols = Math.ceil((this.width + 2 * MARGIN) / CELL);
        this.rows = Math.ceil((this.height + 2 * MARGIN) / CELL);
        this.terrain = createTerrain();
        this.survey();
        this.shades = gradient(this.colors(), SHADES);
        this.particles = Array.from({ length: this.particleCount }, () =>
            this.spawn(),
        );
        this.builtFor = this.settings();
        this.drawBackground(this.ctx);
    }

    protected loop(deltaTime: number): void {
        // A new size or terrain starts the picture over.
        if (this.builtFor !== this.settings()) this.initialize();

        this.time += deltaTime;
        this.fadeTrail();

        const step = this.flowSpeed * deltaTime;
        const paths = this.shades.map(() => new Path2D());
        for (const particle of this.particles) {
            particle.age += deltaTime;
            if (particle.age > particle.life) {
                Object.assign(particle, this.spawn());
            }
            this.move(particle, step, paths[this.shadeIndex(particle)]);
        }
        this.stroke(paths);
    }

    protected updated(changedProperties: PropertyValues): void {
        super.updated(changedProperties);
        this.canvas.style.background = this.cssBackground();
    }

    /** The lines sit on a clear canvas, over the background in CSS. */
    protected drawBackground(ctx: CanvasRenderingContext2D): void {
        ctx.clearRect(0, 0, this.width, this.height);
    }

    /** The background gradient at `bgAngle`, as CSS counts the angle. */
    private cssBackground(): string {
        const colors = this.bgColors.length > 0 ? this.bgColors : ["#000"];
        if (colors.length === 1) return colors[0];
        return `linear-gradient(${this.bgAngle + 90}deg, ${colors.join(", ")})`;
    }

    /**
     * Fades the lines by `trailOpacity` per frame. The canvas keeps 8 bits per
     * channel, so a fade that faint would round the faintest lines back to
     * themselves, and they would stay for good. Instead, each frame fades a
     * scattered share of the pixels by FADE, which averages out the same.
     */
    protected fadeTrail(): void {
        if (this.trailOpacity <= 0) return;

        const strength = Math.max(this.trailOpacity, FADE);
        const turns = Math.round(strength / this.trailOpacity);
        if (this.fadeMasks.length !== turns) {
            this.fadeMasks = fadeMasks(this.ctx, turns);
        }

        const ctx = this.ctx;
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.globalAlpha = Math.min(1, strength);
        ctx.fillStyle = this.fadeMasks[this.fadeTurn++ % turns];
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();
    }

    private settings(): string {
        return [
            this.width,
            this.height,
            this.terrainSize,
            this.particleCount,
            this.lineColors,
        ].join(" ");
    }

    private colors(): string[] {
        return this.lineColors.length > 0 ? this.lineColors : DEFAULT_COLORS;
    }

    /** Finds the way downhill at each cell, and the lowest and highest ground. */
    // ponytail: SAMPLES terrain lookups per cell, ~1.7M (~130 ms) on a 1080p
    // screen, at every start; survey in chunks if that ever stutters.
    private survey(): void {
        const scale = CELL / this.terrainSize;
        this.flow = new Float32Array(this.cols * this.rows * 2);
        this.lowest = Infinity;
        this.highest = -Infinity;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const [x, y] = [col * scale, row * scale];
                const height = this.terrain(x, y);
                this.lowest = Math.min(this.lowest, height);
                this.highest = Math.max(this.highest, height);
                const i = (row * this.cols + col) * 2;
                this.flow.set(downhill(this.terrain, x, y), i);
            }
        }
    }

    /** The index of the shade for the height of the ground under the particle. */
    private shadeIndex({ x, y }: FlowParticle): number {
        const height = this.terrain(x / this.terrainSize, y / this.terrainSize);
        // A flat terrain has a single height.
        const range = this.highest - this.lowest || 1;
        const shade = Math.floor(((height - this.lowest) / range) * SHADES);
        return Math.min(SHADES - 1, Math.max(0, shade));
    }

    private spawn(): FlowParticle {
        return {
            x: Math.random() * this.cols * CELL,
            y: Math.random() * this.rows * CELL,
            dx: 0,
            dy: 0,
            age: 0,
            life: this.particleLife * (0.5 + Math.random()),
        };
    }

    /** The light at the height of a shade, in waves that run downhill. */
    private pulse(shadeIndex: number): number {
        const height = shadeIndex / SHADES;
        const phase = this.pulseSpeed * this.time + height * PULSE_WAVES;
        return 1 + this.pulseStrength * Math.sin(phase * 2 * Math.PI);
    }

    /** Turns the particle with the flow and moves it a step along its path. */
    private move(particle: FlowParticle, step: number, path: Path2D): void {
        const cell = Math.floor(particle.y / CELL) * this.cols;
        const i = (cell + Math.floor(particle.x / CELL)) * 2;
        const dx = particle.dx + this.flow[i] * STEER * step;
        const dy = particle.dy + this.flow[i + 1] * STEER * step;
        const length = Math.hypot(dx, dy) || 1;

        particle.dx = dx / length;
        particle.dy = dy / length;

        path.moveTo(particle.x, particle.y);
        particle.x += particle.dx * step;
        particle.y += particle.dy * step;
        path.lineTo(particle.x, particle.y);

        // Wrap only after drawing, so no line jumps across the canvas.
        particle.x = wrap(particle.x, this.cols * CELL);
        particle.y = wrap(particle.y, this.rows * CELL);
    }

    private stroke(paths: Path2D[]): void {
        const ctx = this.ctx;

        ctx.save();
        ctx.translate(-MARGIN, -MARGIN);
        ctx.lineWidth = 1;
        paths.forEach((path, i) => {
            const alpha = this.lineOpacity * this.pulse(i);
            ctx.globalAlpha = Math.min(1, Math.max(0, alpha));
            ctx.strokeStyle = this.shades[i];
            ctx.stroke(path);
        });
        ctx.restore();
    }
}

/**
 * The way downhill at (x, y): from the highest to the lowest point on a circle
 * around it, as long as the drop between them.
 */
function downhill(terrain: Terrain, x: number, y: number): [number, number] {
    const heights = CIRCLE.map(([cx, cy]) => terrain(x + cx, y + cy));
    const high = heights.indexOf(Math.max(...heights));
    const low = heights.indexOf(Math.min(...heights));
    const dx = CIRCLE[low][0] - CIRCLE[high][0];
    const dy = CIRCLE[low][1] - CIRCLE[high][1];
    // A flat terrain has no way down.
    const drop = (heights[high] - heights[low]) / (Math.hypot(dx, dy) || 1);
    return [dx * drop, dy * drop];
}

/**
 * Masks for `turns` fades in a row, each over a different scattered share of
 * the pixels, so that together they reach every pixel once.
 */
function fadeMasks(
    ctx: CanvasRenderingContext2D,
    turns: number,
): CanvasPattern[] {
    const turnOf = Array.from({ length: MASK_SIZE ** 2 }, () =>
        Math.floor(Math.random() * turns),
    );

    return Array.from({ length: turns }, (_, turn) => {
        const mask = new ImageData(MASK_SIZE, MASK_SIZE);
        turnOf.forEach((t, i) => {
            if (t === turn) mask.data[i * 4 + 3] = 255;
        });
        const tile = document.createElement("canvas");
        tile.width = tile.height = MASK_SIZE;
        tile.getContext("2d")!.putImageData(mask, 0, 0);
        return ctx.createPattern(tile, "repeat")!;
    });
}

function wrap(value: number, size: number): number {
    return ((value % size) + size) % size;
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-contour-flow": BbContourFlow;
    }
}
