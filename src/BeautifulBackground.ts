import { css, LitElement, type CSSResultGroup } from "lit";
import { property } from "lit/decorators.js";
import { debounce } from "./utils/function";
import { stringToArrayConverter } from "./utils/lit";

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

    protected drawBackground(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.backgroundGradient(ctx);
        ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * Paints the background translucently, so the previous frames fade out
     * into a trail.
     */
    protected fadeTrail(): void {
        this.ctx.globalAlpha = this.trailOpacity;
        this.drawBackground(this.ctx);
        this.ctx.globalAlpha = 1.0;
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
            const deltaTime = (now - lastTime) / 1000;
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
