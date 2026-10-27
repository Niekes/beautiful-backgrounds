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

    @property({ type: Number, attribute: "line-opacity" })
    lineOpacity: number = 0.05;

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

    // The lines pile up for good, unless asked to fade.
    trailOpacity: number = 0;

    private cols: number = 0;
    private rows: number = 0;
    private terrain!: Terrain;
    /** The way downhill at each cell, as x, y pairs. */
    private flow: Float32Array = new Float32Array();
    private lowest: number = 0;
    private highest: number = 0;
    private shades: string[] = [];
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

        this.fadeTrail();

        const step = this.flowSpeed * deltaTime;
        const paths = this.shades.map(() => new Path2D());
        for (const particle of this.particles) {
            this.move(particle, step, paths[this.shadeIndex(particle)]);
        }
        this.stroke(paths);
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
        };
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
        ctx.globalAlpha = this.lineOpacity;
        ctx.lineWidth = 1;
        paths.forEach((path, i) => {
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

function wrap(value: number, size: number): number {
    return ((value % size) + size) % size;
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-contour-flow": BbContourFlow;
    }
}
