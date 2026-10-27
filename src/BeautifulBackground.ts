import { css, LitElement, type CSSResultGroup, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { debounce } from "./utils/function";
import { stringToArrayConverter } from "./utils/lit";

/** How much a clean trail takes off the pixels it reaches each frame. */
const CLEAN_FADE = 0.1;
/** The masks of a clean trail repeat every MASK_SIZE px. */
const MASK_SIZE = 64;

export abstract class BeautifulBackground extends LitElement {
    @property({
        type: Array,
        attribute: "bg-colors",
        converter: stringToArrayConverter,
    })
    bgColors: string[] = ["#000", "#000"];

    @property({ type: Number, attribute: "bg-angle" })
    bgAngle: number = 0;

    @property({ type: String, attribute: "background-color" })
    backgroundColor: string = "0, 0, 0";

    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public width: number = 0;
    public height: number = 0;
    public animationFrameId: number | null = null;

    @property({ type: Number, attribute: "trail-opacity" })
    public trailOpacity: number = 0.1;

    /**
     * Whether the trail fades all the way out, instead of leaving its
     * faintest traces for good. The background then shows from CSS, behind
     * the canvas. `clean-trail="false"` turns it off.
     */
    @property({
        attribute: "clean-trail",
        converter: (value) => value !== "false",
    })
    public cleanTrail: boolean = true;

    private fadeMasks: CanvasPattern[] = [];
    private fadeTurn: number = 0;

    protected debouncedResize: () => void;

    constructor() {
        super();
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d")!;
        this.debouncedResize = debounce(this.resizeCanvas.bind(this), 100);
    }

    protected handleVisibilityChange = (): void => {
        if (document.visibilityState === "hidden") {
            this.stopAnimation();
        } else {
            this.startAnimation();
        }
    };

    protected firstUpdated(): void {
        this.shadowRoot!.appendChild(this.canvas);

        this.resizeCanvas();
        this.initialize();
        this.startAnimation();

        window.addEventListener("resize", this.debouncedResize);
        document.addEventListener(
            "visibilitychange",
            this.handleVisibilityChange,
        );
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener("resize", this.debouncedResize);
        document.removeEventListener(
            "visibilitychange",
            this.handleVisibilityChange,
        );
        this.stopAnimation();
    }

    protected updated(changedProperties: PropertyValues): void {
        super.updated(changedProperties);
        this.canvas.style.background = this.cleanTrail
            ? this.cssBackground()
            : "";
    }

    /** Paints the background, or clears the canvas over it for a clean trail. */
    protected drawBackground(ctx: CanvasRenderingContext2D): void {
        if (this.cleanTrail) {
            ctx.clearRect(0, 0, this.width, this.height);
            return;
        }
        ctx.fillStyle = this.backgroundGradient(ctx);
        ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * Paints the background translucently, so the previous frames fade out
     * into a trail.
     */
    protected fadeTrail(): void {
        if (this.cleanTrail) {
            this.fadeTrailCleanly();
            return;
        }
        this.ctx.globalAlpha = this.trailOpacity;
        this.drawBackground(this.ctx);
        this.ctx.globalAlpha = 1.0;
    }

    /**
     * Fades the previous frames by `trailOpacity`. The canvas keeps 8 bits per
     * channel, so a fade that faint would round the faintest traces back to
     * themselves, and they would stay for good. Instead, each frame fades a
     * scattered share of the pixels by CLEAN_FADE, which averages out the same.
     */
    private fadeTrailCleanly(): void {
        if (this.trailOpacity <= 0) return;

        const strength = Math.max(this.trailOpacity, CLEAN_FADE);
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

    /** The background gradient at `bgAngle`, as CSS counts the angle. */
    private cssBackground(): string {
        const colors = this.bgColors.length > 0 ? this.bgColors : ["#000"];
        if (colors.length === 1) return colors[0];
        return `linear-gradient(${this.bgAngle + 90}deg, ${colors.join(", ")})`;
    }

    /** A gradient at `bgAngle` that spans the canvas from edge to edge. */
    private backgroundGradient(ctx: CanvasRenderingContext2D): CanvasGradient {
        const angleRad = (this.bgAngle * Math.PI) / 180;
        const dx = Math.cos(angleRad);
        const dy = Math.sin(angleRad);
        const r = (Math.abs(this.width * dx) + Math.abs(this.height * dy)) / 2;
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        const gradient = ctx.createLinearGradient(
            centerX - dx * r,
            centerY - dy * r,
            centerX + dx * r,
            centerY + dy * r,
        );

        const colors =
            this.bgColors.length > 0 ? this.bgColors : ["#000", "#000"];

        try {
            colors.forEach((color, index) => {
                gradient.addColorStop(index / (colors.length - 1 || 1), color);
            });
        } catch {
            // Fallback while typing invalid colors
            gradient.addColorStop(0, "#000");
            gradient.addColorStop(1, "#000");
        }

        return gradient;
    }

    protected resizeCanvas(): void {
        const rect = this.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        if (rect.width === this.width && rect.height === this.height) return;

        this.width = rect.width;
        this.height = rect.height;
        this.canvas.width = Math.floor(this.width * dpr);
        this.canvas.height = Math.floor(this.height * dpr);
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.canvas.style.borderRadius = "inherit";

        this.ctx.scale(dpr, dpr);

        this.drawBackground(this.ctx);
    }

    protected initialize(): void {
        // Override me
    }

    protected startAnimation(): void {
        if (this.animationFrameId !== null) return;

        let lastTime = performance.now();
        const animate = (now: number) => {
            // The first frame's timestamp can lie before performance.now().
            const deltaTime = Math.max(0, now - lastTime) / 1000;
            lastTime = now;
            this.loop(deltaTime);
            this.animationFrameId = requestAnimationFrame(animate);
        };
        this.animationFrameId = requestAnimationFrame(animate);
    }

    protected stopAnimation(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    static styles: CSSResultGroup = css`
        :host {
            border-radius: inherit;
            display: flex;
        }
    `;

    protected abstract loop(deltaTime: number): void;

    render(): void {
        return;
    }
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
