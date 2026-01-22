import { css, LitElement } from "lit";
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

    protected handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
            this.stopAnimation();
        } else {
            this.startAnimation();
        }
    };

    protected firstUpdated() {
        if (!this.shadowRoot) {
            this.attachShadow({ mode: "open" });
        }
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

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener("resize", this.debouncedResize);
        document.removeEventListener(
            "visibilitychange",
            this.handleVisibilityChange,
        );
        this.stopAnimation();
    }

    protected drawBackground(ctx: CanvasRenderingContext2D): void {
        const angleRad = (this.bgAngle * Math.PI) / 180;
        const r =
            (Math.abs(this.width * Math.cos(angleRad)) +
                Math.abs(this.height * Math.sin(angleRad))) /
            2;
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        const x0 = centerX - Math.cos(angleRad) * r;
        const y0 = centerY - Math.sin(angleRad) * r;
        const x1 = centerX + Math.cos(angleRad) * r;
        const y1 = centerY + Math.sin(angleRad) * r;

        const gradient = ctx.createLinearGradient(x0, y0, x1, y1);

        const colors =
            this.bgColors.length > 0 ? this.bgColors : ["#000", "#000"];

        try {
            colors.forEach((color, index) => {
                const stop = index / (colors.length - 1 || 1);
                gradient.addColorStop(stop, color);
            });
        } catch (e) {
            // Fallback while typing invalid colors
            gradient.addColorStop(0, "#000");
            gradient.addColorStop(1, "#000");
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
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

    protected startAnimation() {
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

    protected stopAnimation() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    static styles = css`
        :host {
            border-radius: inherit;
            display: flex;
        }
    `;

    protected abstract loop(deltaTime: number): void;

    render() {
        return;
    }
}
