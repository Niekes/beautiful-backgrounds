import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import Particle from "../Particle";
import { getRandomFloat, interpolateLinear } from "../utils/number";
import { randomColor } from "../utils/color";

@customElement("bb-star-trail")
export class BbStarTrail extends LitElement {
    @property({ type: Number, attribute: "data-fps" })
    fps: number = 60;

    @property({ type: String, attribute: "data-background-color" })
    backgroundColor: string = "0, 0, 0";

    @property({ type: Number, attribute: "data-star-size-min" })
    starSizeMin: number = 0.5;

    @property({ type: Number, attribute: "data-star-size-max" })
    starSizeMax: number = 1.5;

    @property({ type: Number, attribute: "data-star-speed-min" })
    starSpeedMin: number = 0.025;

    @property({ type: Number, attribute: "data-star-speed-max" })
    starSpeedMax: number = 0.05;

    @property({ type: Number, attribute: "data-star-color-hue-start" })
    starColorHueStart: number = 30;

    @property({ type: Number, attribute: "data-star-color-hue-end" })
    starColorHueEnd: number = 75;

    @property({ type: Number, attribute: "data-star-color-saturation-start" })
    starColorSaturationStart: number = 100;

    @property({ type: Number, attribute: "data-star-color-saturation-end" })
    starColorSaturationEnd: number = 100;

    @property({ type: Number, attribute: "data-star-color-lightness-start" })
    starColorLightnessStart: number = 50;

    @property({ type: Number, attribute: "data-star-color-lightness-end" })
    starColorLightnessEnd: number = 50;

    @property({ type: Number, attribute: "data-star-radius-min" })
    starRadiusMin: number = 1;

    @property({ type: Number, attribute: "data-star-radius-max" })
    starRadiusMax: number = 100;

    @property({ type: Number, attribute: "data-star-lifespan-min" })
    starLifespanMin: number = 1000;

    @property({ type: Number, attribute: "data-star-lifespan-max" })
    starLifespanMax: number = 10000;

    @property({ type: Number, attribute: "data-num-stars" })
    numStars: number = 1000;

    // Properties inherited from BB class
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public width: number = 0;
    public height: number = 0;
    public animationFrameId: number | null = null;
    public trailOpacity: number = 0.1;

    // Component-specific properties
    private stars: Particle[] = [];

    constructor() {
        super();

        // Initialize canvas
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d")!;
    }

    protected firstUpdated(): void {
        // Create shadow DOM and append canvas
        if (!this.shadowRoot) {
            this.attachShadow({ mode: "open" });
        }
        this.shadowRoot!.appendChild(this.canvas);

        this.resizeCanvas();
        this.initialize();
        this.startAnimation();

        window.addEventListener(
            "resize",
            this.debouncedResizeCanvas.bind(this)
        );
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener(
            "resize",
            this.debouncedResizeCanvas.bind(this)
        );
        if (this.animationFrameId !== null) {
            window.cancelAnimationFrame(this.animationFrameId);
        }
    }

    private resizeCanvas(): void {
        const rect = this.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    private debouncedResizeCanvas = this.debounce(
        this.resizeCanvas.bind(this),
        100
    );

    private debounce(func: Function, wait: number): (...args: any[]) => void {
        let timeout: any;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    protected initialize(): void {
        this.stars = [];
        this.starRadiusMax = Math.max(this.width, this.height) / 2;
        this.animationFrameId = null;

        for (let i = 0; i < this.numStars; i++) {
            this.stars.push(this.createStar());
        }
    }

    private startAnimation(): void {
        let lastFrameTime = 0;

        const animate = (currentTime: number) => {
            const targetFrameTime = 1000 / this.fps;
            if (currentTime - lastFrameTime >= targetFrameTime) {
                this.animation();
                lastFrameTime = currentTime;
            }
            this.animationFrameId = requestAnimationFrame(animate);
        };

        this.animationFrameId = requestAnimationFrame(animate);
    }

    protected animation(): void {
        this.ctx.fillStyle = `rgba(${this.backgroundColor}, ${this.trailOpacity})`;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.stars = this.stars.filter((star) => !star.isDead());

        while (this.stars.length < this.numStars) {
            this.stars.push(this.createStar());
        }

        this.stars.forEach((star) => {
            star.update(this.width / 2, this.height / 2);
            star.draw(this.ctx);
        });
    }

    protected createStar(): Particle {
        const size = getRandomFloat(this.starSizeMin, this.starSizeMax);
        const speed = getRandomFloat(
            interpolateLinear(this.starSpeedMin, -1, 1, -0.04, 0.04),
            interpolateLinear(this.starSpeedMax, -1, 1, -0.04, 0.04)
        );
        const lifespan = getRandomFloat(
            this.starLifespanMin,
            this.starLifespanMax
        );
        const color = randomColor(
            [this.starColorHueStart, this.starColorHueEnd],
            [this.starColorSaturationStart, this.starColorSaturationEnd],
            [this.starColorLightnessStart, this.starColorLightnessEnd]
        );
        const angle = getRandomFloat(0, Math.PI * 2);

        const radiusRange = this.starRadiusMax - this.starRadiusMin;
        const radius =
            Math.sqrt(Math.random()) * radiusRange + this.starRadiusMin;

        return new Particle(size, speed, color, radius, angle, lifespan);
    }

    // Property change handler for when properties update
    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);

        // Reinitialize if certain properties change
        if (
            changedProperties.has("numStars") ||
            changedProperties.has("starRadiusMin") ||
            changedProperties.has("starRadiusMax")
        ) {
            if (this.width > 0 && this.height > 0) {
                this.initialize();
            }
        }
    }

    // Override render to return empty template since we're using canvas
    render() {
        return;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-star-trail": BbStarTrail;
    }
}
