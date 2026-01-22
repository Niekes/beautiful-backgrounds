import { css, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { debounce } from "./utils/function";

export abstract class BeautifulBackground extends LitElement {
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

        this.ctx.fillStyle = `rgb(${this.backgroundColor})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
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
        }
    `;

    protected abstract loop(deltaTime: number): void;

    render() {
        return;
    }
}
