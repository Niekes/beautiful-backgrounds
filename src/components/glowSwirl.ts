import { customElement, property } from "lit/decorators.js";
import { BeautifulBackground } from "../BeautifulBackground";
import { gradient } from "../utils/color";
import { stringToArrayConverter } from "../utils/lit";
import { createTerrain, type Terrain } from "../utils/terrain";

/** Blue through violet to pink, like the original. */
const DEFAULT_COLORS = ["#3377ff", "#8833ff", "#dd33ff", "#ff33cc"];
/** How many colors the particles pick from, evenly through the swirl colors. */
const SHADES = 32;
/** The size of the current's largest whirls, in px. */
const WHIRL = 800;
/** How fast the current changes, in terrain units per second at speed 1. */
const CHANGE = 0.03;
/** How far a particle turns toward the current each frame, from 0 to 1. */
const STEER = 0.5;
/** The glow is blurred at 1/GLOW_SCALE of the size: as soft, far cheaper. */
const GLOW_SCALE = 4;
/** The longest frame a particle moves for, in seconds, so tab switches don't jump. */
const MAX_STEP = 0.1;

type Spark = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    /** How fast it moves, in px per frame at 60 fps. */
    pace: number;
    age: number;
    /** How long it lives, in seconds. */
    life: number;
    width: number;
    color: string;
};

/**
 * Glowing particles that swirl out of a band through the middle, steered by
 * a slowly changing current.
 *
 * Based on "Swirl" from Ambient Canvas Backgrounds by Sean Free (Codrops):
 * https://github.com/crnacura/AmbientCanvasBackgrounds
 */
@customElement("bb-glow-swirl")
export class BbGlowSwirl extends BeautifulBackground {
    @property({
        type: Array,
        attribute: "swirl-colors",
        converter: stringToArrayConverter,
    })
    swirlColors: string[] = DEFAULT_COLORS;

    @property({ type: Number, attribute: "particle-amount" })
    particleAmount: number = 700;

    /** The widest a particle's line gets, in px. */
    @property({ type: Number, attribute: "particle-size" })
    particleSize: number = 5;

    /** How tall the band the particles start in is, as a share of the height. */
    @property({ type: Number, attribute: "spread" })
    spread: number = 0.35;

    /** How many times the current can turn around: higher curls tighter. */
    @property({ type: Number, attribute: "turns" })
    turns: number = 8;

    /** How far the glow blurs, in px: 0 turns it off. */
    @property({ type: Number, attribute: "glow" })
    glow: number = 8;

    /** How fast the particles move and the current changes. */
    @property({ type: Number, attribute: "speed" })
    speed: number = 1;

    bgColors: string[] = ["#0c0a12"];
    // The original starts each frame clean; a lower trail opacity leaves streaks.
    trailOpacity: number = 1;
    protected maxPixelRatio: number = 1;

    /** Two terrains drifting apart, so the current changes instead of sliding. */
    private terrains: Terrain[] = [];
    private time: number = 0;
    private sparks: Spark[] = [];
    private shades: string[] = [];
    /** This frame's lines, sharp, before they are added with their glow. */
    private layer: HTMLCanvasElement = document.createElement("canvas");
    /** The layer's glow, blurred small and then stretched over the canvas. */
    private halo: HTMLCanvasElement = document.createElement("canvas");
    /** The size and settings the sparks were made for. */
    private builtFor: string = "";

    protected initialize(): void {
        this.terrains = [createTerrain(), createTerrain()];
        this.shades = gradient(this.colors(), SHADES);
        this.sparks = Array.from({ length: this.amount() }, () => this.spawn());
        // At least 1px: drawing a canvas of size 0 throws and stops the animation.
        this.layer.width = Math.max(1, this.canvas.width);
        this.layer.height = Math.max(1, this.canvas.height);
        this.halo.width = Math.max(1, Math.ceil(this.width / GLOW_SCALE));
        this.halo.height = Math.max(1, Math.ceil(this.height / GLOW_SCALE));
        this.builtFor = this.settings();
    }

    protected loop(deltaTime: number): void {
        if (this.builtFor !== this.settings()) this.initialize();

        const step =
            Math.min(deltaTime, MAX_STEP) * (Math.max(0, this.speed) || 0);
        this.time += step;
        this.fadeTrail();
        this.drawSparks(step);
        this.addGlow();
    }

    private settings(): string {
        return [
            this.width,
            this.height,
            this.amount(),
            this.particleSize,
            this.spread,
            this.swirlColors,
        ].join(" ");
    }

    private colors(): string[] {
        return this.swirlColors.length > 0 ? this.swirlColors : DEFAULT_COLORS;
    }

    private amount(): number {
        return Math.max(0, Math.round(this.particleAmount) || 0);
    }

    private spawn(): Spark {
        const spread = Math.min(1, Math.max(0, this.spread) || 0);
        const size = Math.max(1, this.particleSize || 1);
        return {
            x: Math.random() * this.width,
            y: this.height * (0.5 + spread * (Math.random() - 0.5)),
            vx: 0,
            vy: 0,
            pace: 0.1 + Math.random() * 2,
            age: 0,
            life: 0.8 + Math.random() * 2.5,
            width: 1 + Math.random() * (size - 1),
            color: this.shades[Math.floor(Math.random() * this.shades.length)],
        };
    }

    /** The way the current runs at (x, y), as an angle in radians. */
    private current(x: number, y: number): number {
        const [a, b] = this.terrains;
        const u = x / WHIRL;
        const v = y / WHIRL;
        const t = this.time * CHANGE;
        // Each height is about 0.5 ± 0.25, so this is about -1 to 1.
        const height = a(u + t, v) + b(u, v - t) - 1;
        return height * (this.turns || 0) * 2 * Math.PI;
    }

    /** Moves every spark and draws its newest bit of line onto the layer. */
    private drawSparks(step: number): void {
        const layer = this.layer.getContext("2d")!;
        const scale = this.layer.width / this.width;
        layer.setTransform(scale, 0, 0, scale, 0, 0);
        layer.clearRect(0, 0, this.width, this.height);
        layer.lineCap = "round";

        const frames = step * 60;
        for (const spark of this.sparks) {
            const angle = this.current(spark.x, spark.y);
            spark.vx += (Math.cos(angle) - spark.vx) * STEER;
            spark.vy += (Math.sin(angle) - spark.vy) * STEER;
            const x = spark.x + spark.vx * spark.pace * frames;
            const y = spark.y + spark.vy * spark.pace * frames;

            // Fades in over the first half of its life and out over the second.
            layer.globalAlpha = 1 - Math.abs((2 * spark.age) / spark.life - 1);
            layer.strokeStyle = spark.color;
            layer.lineWidth = spark.width;
            layer.beginPath();
            layer.moveTo(spark.x, spark.y);
            layer.lineTo(x, y);
            layer.stroke();

            spark.x = x;
            spark.y = y;
            spark.age += step;
            if (spark.age > spark.life || !this.inside(x, y)) {
                Object.assign(spark, this.spawn());
            }
        }
    }

    private inside(x: number, y: number): boolean {
        return x >= 0 && x <= this.width && y >= 0 && y <= this.height;
    }

    /** Adds the layer onto the canvas twice blurred and brightened, then sharp. */
    private addGlow(): void {
        const { ctx, width, height } = this;
        const glow = Math.max(0, this.glow) || 0;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        if (glow > 0) {
            const halo = this.halo.getContext("2d")!;
            const { width: w, height: h } = this.halo;
            for (const blur of [glow, glow / 2]) {
                halo.clearRect(0, 0, w, h);
                halo.filter = `blur(${blur / GLOW_SCALE}px) brightness(200%)`;
                halo.drawImage(this.layer, 0, 0, w, h);
                ctx.drawImage(this.halo, 0, 0, width, height);
            }
        }
        ctx.drawImage(this.layer, 0, 0, width, height);
        ctx.restore();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-glow-swirl": BbGlowSwirl;
    }
}
