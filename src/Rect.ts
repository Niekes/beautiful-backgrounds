export default class Line {
    private x = 0;
    private y = 0;
    private addedX = 0;
    private addedY = 0;
    private rad = 0;
    private time = 0;
    private cumulativeTime = 0;
    private targetTime = 0;
    private lightInputMultiplier = 0;
    private color = "";

    private opts: LineOptions;
    private moveMethod: (deltaTime: number) => void;

    constructor(
        opts: LineOptions,
        moveMethod: "hexagon" | "spiral" | "sinus" = "hexagon",
    ) {
        this.opts = opts;
        this.lightInputMultiplier =
            opts.baseLightInputMultiplier +
            opts.addedLightInputMultiplier * Math.random();

        // choose movement function
        switch (moveMethod) {
            case "spiral":
                this.moveMethod = this.spiralMove.bind(this);
                break;
            case "sinus":
                this.moveMethod = this.sinusMove.bind(this);
                break;
            default:
                this.moveMethod = this.hexagonMove.bind(this);
        }

        this.reset();
    }

    reset() {
        this.x = this.y = this.addedX = this.addedY = 0;
        this.rad = 0;
        this.cumulativeTime = 0;
        this.beginPhase();
    }

    beginPhase() {
        const opts = this.opts;
        const baseRad = (Math.PI * 2) / 6;

        this.x += this.addedX;
        this.y += this.addedY;

        this.time = 0;
        this.targetTime = Math.floor(
            opts.baseTime + opts.addedTime * Math.random(),
        );

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

        this.color = `hsl(${opts.tick * opts.hueChange},100%,50%)`;
    }

    step(ctx: CanvasRenderingContext2D, deltaTime: number) {
        this.time++;
        this.cumulativeTime++;

        if (this.time >= this.targetTime) this.beginPhase();

        // call the selected movement method
        this.moveMethod(deltaTime);

        const opts = this.opts;
        const prop = this.time / this.targetTime;
        const wave = Math.sin((prop * Math.PI) / 2);
        const drawX = this.x + this.addedX * wave;
        const drawY = this.y + this.addedY * wave;

        ctx.shadowBlur = prop * opts.shadowToTimePropMult;
        const light =
            opts.baseLight +
            opts.addedLight *
                Math.sin(this.cumulativeTime * this.lightInputMultiplier);
        ctx.fillStyle = ctx.shadowColor = this.color.replace(
            "50%",
            `${light}%`,
        );

        ctx.fillRect(
            opts.cx + drawX * opts.len,
            opts.cy + drawY * opts.len,
            2,
            2,
        );

        if (Math.random() < opts.sparkChance) {
            ctx.fillRect(
                opts.cx +
                    drawX * opts.len +
                    Math.random() *
                        opts.sparkDist *
                        (Math.random() < 0.5 ? 1 : -1) -
                    opts.sparkSize / 2,
                opts.cy +
                    drawY * opts.len +
                    Math.random() *
                        opts.sparkDist *
                        (Math.random() < 0.5 ? 1 : -1) -
                    opts.sparkSize / 2,
                opts.sparkSize,
                opts.sparkSize,
            );
        }
    }

    // example movement methods
    private hexagonMove(deltaTime: number) {
        this.x += this.addedX;
        this.y += this.addedY;
    }

    private spiralMove(deltaTime: number) {
        this.rad += 0.05 * deltaTime;
        this.x += Math.cos(this.rad) * 0.5;
        this.y += Math.sin(this.rad) * 0.5;
    }

    private sinusMove(deltaTime: number) {
        this.rad += 0.05 * deltaTime;
        this.x += 0.5;
        this.y += Math.sin(this.rad) * 2;
    }
}

export interface LineOptions {
    len: number;
    baseTime: number;
    addedTime: number;
    dieChance: number;
    sparkChance: number;
    sparkDist: number;
    sparkSize: number;
    baseLight: number;
    addedLight: number;
    shadowToTimePropMult: number;
    baseLightInputMultiplier: number;
    addedLightInputMultiplier: number;
    hueChange: number;
    tick: number;
    cx: number;
    cy: number;
    width: number;
    height: number;
}
