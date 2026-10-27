import { customElement, property } from "lit/decorators.js";
import { BeautifulBackground } from "../BeautifulBackground";
import { gradient, toRgb } from "../utils/color";
import { stringToArrayConverter } from "../utils/lit";
import { getRandomFloat } from "../utils/number";

/** Crystal Parallax's own blues, from cyan to violet. */
const DEFAULT_COLORS = ["#47d1d1", "#475ed1", "#a347d1"];
/** How many colors a shaft can take from along `shaftColors`. */
const SHADES = 64;
/** A shaft's light from its top to its bottom: [where, opacity]. */
const FADE = [
    [0, 0],
    [0.2, 0.5],
    [0.5, 0.8],
    [0.8, 0.5],
    [1, 0],
];
/**
 * A shaft's width in px, how brightly it shines, and how fast it drifts in px
 * per second: nearest first, then farthest.
 */
const WIDTH = [15, 2] as const;
const LIGHT = [1, 0.3] as const;
const SPEED = [21, 4] as const;
/**
 * The shortest and tallest a shaft is, as a share of the background's height,
 * and how far down its top can lie.
 */
const HEIGHT = [0.5, 0.9] as const;
const LOWEST_TOP = 0.5;
/** How far a shaft's light blurs to either side, in px. */
const BLUR = 10;
/**
 * The height a shaft is drawn at once, before it is stretched to its own
 * height: its light only changes from top to bottom, and smoothly.
 */
const SPRITE_HEIGHT = 64;

type Shaft = {
    /** The left edge of its blur, and its top, in px. */
    x: number;
    y: number;
    height: number;
    /** How fast it drifts to the right, in px per second. */
    speed: number;
    /** Its light, blurred, drawn once. */
    // ponytail: drawn at 1 px per CSS px, so a high-DPI screen shows it a
    // little softer; draw it at devicePixelRatio if the far shafts look blurry.
    sprite: HTMLCanvasElement;
};

/**
 * Upright shafts of soft light drift sideways. After "Crystal Parallax" by
 * Tibix: https://codepen.io/Tibixx/pen/xmOaWe
 */
@customElement("bb-light-shafts")
export class BbLightShafts extends BeautifulBackground {
    @property({
        type: Array,
        attribute: "shaft-colors",
        converter: stringToArrayConverter,
    })
    shaftColors: string[] = DEFAULT_COLORS;

    /** How many shafts there are, however wide the background is. */
    // ponytail: a fixed count, so a narrow background crowds and a wide one
    // thins out; count per width instead if that bothers anyone.
    @property({ type: Number, attribute: "shaft-amount" })
    shaftAmount: number = 100;

    /** How fast the shafts drift: 2 is twice as fast, 0 stands still. */
    @property({ type: Number, attribute: "speed" })
    speed: number = 1;

    // Without a trail, like Crystal Parallax, and on the canvas's own
    // background, so the light adds to it.
    trailOpacity: number = 1;
    cleanTrail: boolean = false;

    private shafts: Shaft[] = [];
    /** The size, amount and colors the shafts were made for. */
    private builtFor: string = "";

    protected initialize(): void {
        const colors =
            this.shaftColors.length > 0 ? this.shaftColors : DEFAULT_COLORS;
        const shades = gradient(colors, SHADES);
        this.shafts = Array.from({ length: this.shaftAmount }, () =>
            this.shaft(shades[Math.floor(Math.random() * SHADES)]),
        );
        this.builtFor = this.settings();
    }

    protected loop(deltaTime: number): void {
        // A new size, amount or colors start the shafts over.
        if (this.builtFor !== this.settings()) this.initialize();

        const ctx = this.ctx;
        const step = deltaTime * Math.max(0, this.speed);
        this.fadeTrail();
        ctx.globalCompositeOperation = "lighter";
        for (const shaft of this.shafts) {
            // Past the right edge, it comes back in from the left.
            const span = this.width + shaft.sprite.width;
            shaft.x =
                ((shaft.x + shaft.speed * step + shaft.sprite.width) % span) -
                shaft.sprite.width;
            ctx.drawImage(
                shaft.sprite,
                shaft.x,
                shaft.y,
                shaft.sprite.width,
                shaft.height,
            );
        }
        ctx.globalCompositeOperation = "source-over";
    }

    private settings(): string {
        const { width, height, shaftAmount, shaftColors } = this;
        return `${width} ${height} ${shaftAmount} ${shaftColors.join(",")}`;
    }

    /** A new shaft in `color`, somewhere on the canvas, at a random depth. */
    private shaft(color: string): Shaft {
        const depth = Math.random();
        const width = byDepth(WIDTH, depth);
        // Room for the blur on either side.
        const margin = 2 * BLUR;
        const sprite = document.createElement("canvas");
        sprite.width = Math.ceil(width + 2 * margin);
        sprite.height = SPRITE_HEIGHT;

        const ctx = sprite.getContext("2d")!;
        const [r, g, b] = toRgb(color);
        const fade = ctx.createLinearGradient(0, 0, 0, SPRITE_HEIGHT);
        for (const [at, opacity] of FADE) {
            const alpha = opacity * byDepth(LIGHT, depth);
            fade.addColorStop(at, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        }
        ctx.fillStyle = fade;
        ctx.shadowBlur = BLUR;
        ctx.shadowColor = color;
        ctx.fillRect(margin, 0, width, SPRITE_HEIGHT);

        return {
            x: getRandomFloat(-sprite.width, this.width),
            y: getRandomFloat(0, LOWEST_TOP * this.height),
            height: this.height * getRandomFloat(...HEIGHT),
            speed: byDepth(SPEED, depth),
            sprite,
        };
    }
}

/** Between the nearest and the farthest value, at `depth` from 0 to 1. */
function byDepth(
    [near, far]: readonly [number, number],
    depth: number,
): number {
    return near + (far - near) * depth;
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-light-shafts": BbLightShafts;
    }
}
