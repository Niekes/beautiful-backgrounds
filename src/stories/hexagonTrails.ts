import { customElement, property } from "lit/decorators.js";
import { BeautifulBackground } from "../BeautifulBackground";

@customElement("bb-hexagon-trails")
export class BbHexagonTrails extends BeautifulBackground {
    @property({ type: Number }) len: number = 20;
    @property({ type: Number }) count: number = 50;
    @property({ type: Number }) baseTime: number = 10;
    @property({ type: Number }) addedTime: number = 10;
    @property({ type: Number }) dieChance: number = 0.05;
    @property({ type: Number }) spawnChance: number = 1;
    @property({ type: Number }) sparkChance: number = 0;
    @property({ type: Number }) sparkDist: number = 10;
    @property({ type: Number }) sparkSize: number = 2;
    @property({ type: Number }) baseLight: number = 50;
    @property({ type: Number }) addedLight: number = 10;
    @property({ type: Number }) shadowToTimePropMult: number = 6;
    @property({ type: Number }) baseLightInputMultiplier: number = 0.01;
    @property({ type: Number }) addedLightInputMultiplier: number = 0.02;
    @property({ type: Number }) repaintAlpha: number = 0.1;
    @property({ type: Number }) hueChange: number = 1;

    public tick: number = 0;
    private lines: Line[] = [];

    protected loop(_deltaTime: number): void {
        this.tick++;
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = `rgba(${this.backgroundColor}, 0.1)`;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.globalCompositeOperation = "lighter";

        if (this.lines.length < this.count && Math.random() < this.spawnChance)
            this.lines.push(new Line(this));

        this.lines.forEach((line) => line.step());
    }
}

class Line {
    x = 0;
    y = 0;
    addedX = 0;
    addedY = 0;
    rad = 0;
    time = 0;
    cumulativeTime = 0;
    targetTime = 0;
    lightInputMultiplier = 0;
    color = "";
    private base: BbHexagonTrails;

    constructor(base: BbHexagonTrails) {
        this.base = base;
        this.reset();
    }

    reset() {
        this.x = this.y = this.addedX = this.addedY = 0;
        this.rad = 0;
        this.lightInputMultiplier =
            this.base.baseLightInputMultiplier +
            this.base.addedLightInputMultiplier * Math.random();
        this.color = "hsla(315, 100%, 50%, 1.00)";
        this.cumulativeTime = 0;
        this.beginPhase();
    }

    beginPhase() {
        const opts = this.base;
        const baseRad = (Math.PI * 2) / 6;
        this.x += this.addedX;
        this.y += this.addedY;

        this.time = 0;
        this.targetTime = (opts.baseTime + opts.addedTime * Math.random()) | 0;

        this.rad += baseRad * (Math.random() < 0.5 ? 1 : -1);
        this.addedX = Math.cos(this.rad);
        this.addedY = Math.sin(this.rad);

        const dieX = opts.width / 2 / opts.len;
        const dieY = opts.height / 2 / opts.len;
        if (
            Math.random() < opts.dieChance ||
            this.x > dieX ||
            this.x < -dieX ||
            this.y > dieY ||
            this.y < -dieY
        ) {
            this.reset();
        }
        this.color = `hsl(${opts.hueChange * opts.tick},100%,50%)`;
    }

    step() {
        const opts = this.base;
        this.time++;
        this.cumulativeTime++;

        if (this.time >= this.targetTime) this.beginPhase();

        const prop = this.time / this.targetTime;
        const wave = Math.sin((prop * Math.PI) / 2);
        const x = this.addedX * wave;
        const y = this.addedY * wave;

        opts.ctx.shadowBlur = prop * opts.shadowToTimePropMult;
        const light =
            opts.baseLight +
            opts.addedLight *
                Math.sin(this.cumulativeTime * this.lightInputMultiplier);
        opts.ctx.fillStyle = opts.ctx.shadowColor = this.color.replace(
            "50%",
            `${light}%`,
        );
        opts.ctx.fillRect(
            opts.width / 2 + (this.x + x) * opts.len,
            opts.height / 2 + (this.y + y) * opts.len,
            1,
            1,
        );

        if (Math.random() < opts.sparkChance) {
            opts.ctx.fillRect(
                opts.width / 2 +
                    (this.x + x) * opts.len +
                    Math.random() *
                        opts.sparkDist *
                        (Math.random() < 0.5 ? 1 : -1) -
                    opts.sparkSize / 2,
                opts.height / 2 +
                    (this.y + y) * opts.len +
                    Math.random() *
                        opts.sparkDist *
                        (Math.random() < 0.5 ? 1 : -1) -
                    opts.sparkSize / 2,
                opts.sparkSize,
                opts.sparkSize,
            );
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-hexagon-trails": BbHexagonTrails;
    }
}
