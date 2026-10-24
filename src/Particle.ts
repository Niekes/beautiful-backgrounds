export default class Particle {
    private size: number;
    private speed: number;
    private color: string;
    private radius: number;
    private angle: number;
    private lifespan: number;
    private force: number;

    private x: number;
    private y: number;
    private px: number;
    private py: number;
    private initialized: boolean = false;
    private born: number;
    private fadeInDuration: number;
    private fadeOutDuration: number;

    constructor(options: ParticleOptions) {
        this.size = options.size;
        this.speed = options.speed;
        this.color = options.color;
        this.radius = options.radius ?? 1;
        this.angle = options.angle;
        this.lifespan = options.lifespan;
        this.force = options.force ?? 1;

        this.gridSides = options.gridSides;
        this.gridSize = options.gridSize;
        this.gridAngle = options.gridAngle;

        this.x = options.x ?? 0;
        this.y = options.y ?? 0;
        this.px = this.x;
        this.py = this.y;
        this.born = Date.now();
        this.fadeInDuration = this.lifespan * 0.25;
        this.fadeOutDuration = this.lifespan * 0.5;
    }

    circularMove(centerX: number, centerY: number, deltaTime: number): void {
        this.angle += this.speed * deltaTime;
        this.radius += this.force * deltaTime;

        this.updatePosition(
            centerX + Math.cos(this.angle) * this.radius,
            centerY + Math.sin(this.angle) * this.radius,
        );
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.globalAlpha = this.calculateOpacity();
        ctx.beginPath();

        ctx.lineCap = "round";
        ctx.lineWidth = this.size * 2;
        ctx.strokeStyle = this.color;

        ctx.moveTo(this.px, this.py);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        ctx.globalAlpha = 1;
    }

    isDead(): boolean {
        return Date.now() - this.born > this.lifespan;
    }

    // Grid/Rail properties
    private gridSides: number;
    private gridSize: number;
    private gridAngle: number;
    private railFromX: number = 0;
    private railFromY: number = 0;
    private railToX: number = 0;
    private railToY: number = 0;
    private railProgress: number = 0; // 0 to 1

    railMove(centerX: number, centerY: number, deltaTime: number): void {
        if (!this.initialized) this.enterRail(centerX, centerY);

        // Move constant speed based on pixels per frame.
        const pxPerFrame = Math.abs(this.speed) * 20;
        this.railProgress += (pxPerFrame / this.gridSize) * deltaTime;

        if (this.railProgress >= 1) {
            this.railProgress -= 1;
            this.railFromX = this.railToX;
            this.railFromY = this.railToY;
            this.pickNextRailTarget();
        }

        // Interpolate
        this.updatePosition(
            this.railFromX + (this.railToX - this.railFromX) * this.railProgress,
            this.railFromY + (this.railToY - this.railFromY) * this.railProgress,
        );
    }

    /** Snaps the particle onto the nearest grid node and picks a first rail. */
    private enterRail(centerX: number, centerY: number): void {
        const node = this.snapToGrid(this.x, this.y, centerX, centerY);
        this.railFromX = node.x;
        this.railFromY = node.y;
        this.railProgress = 0;
        this.pickNextRailTarget();
        this.updatePosition(node.x, node.y);
    }

    private pickNextRailTarget(): void {
        const sector = (Math.PI * 2) / this.gridSides;

        // Randomly pick one of the k directions (0 to gridSides-1)
        // This allows changing direction at every node
        const k = Math.floor(Math.random() * this.gridSides);
        const angle = k * sector + this.gridAngle;

        this.railToX = this.railFromX + Math.cos(angle) * this.gridSize;
        this.railToY = this.railFromY + Math.sin(angle) * this.gridSize;
    }

    /** Snaps in the grid's own frame around (ox, oy), then rotates back. */
    private snapToGrid(x: number, y: number, ox: number, oy: number): Point {
        const local = rotate(x - ox, y - oy, -this.gridAngle);
        const node = this.nearestNode(local.x, local.y);
        const world = rotate(node.x, node.y, this.gridAngle);

        return { x: world.x + ox, y: world.y + oy };
    }

    private nearestNode(x: number, y: number): Point {
        const size = this.gridSize;

        if (this.gridSides === 6 || this.gridSides === 3) {
            // A triangular lattice, whose rails match the hexagon edges.
            const h = (size * Math.sqrt(3)) / 2;
            const row = Math.round(y / h);
            const col = Math.round((x - (row * size) / 2) / size);
            return { x: col * size + (row * size) / 2, y: row * h };
        }
        if (this.gridSides === 4) {
            return {
                x: Math.round(x / size) * size,
                y: Math.round(y / size) * size,
            };
        }
        return { x, y };
    }

    private updatePosition(nx: number, ny: number): void {
        if (!this.initialized) {
            this.x = nx;
            this.y = ny;
            this.px = nx;
            this.py = ny;
            this.initialized = true;
        } else {
            this.px = this.x;
            this.py = this.y;
            this.x = nx;
            this.y = ny;
        }
    }

    private calculateOpacity(): number {
        const age = Date.now() - this.born;

        if (age < this.fadeInDuration) {
            return age / this.fadeInDuration;
        }

        if (age > this.lifespan - this.fadeOutDuration) {
            return (this.lifespan - age) / this.fadeOutDuration;
        }

        return 1;
    }
}

export interface ParticleOptions {
    size: number;
    speed: number;
    color: string;
    radius?: number;
    angle: number;
    lifespan: number;
    force?: number;
    gridSides: number;
    gridSize: number;
    gridAngle: number;
    x?: number;
    y?: number;
}

type Point = { x: number; y: number };

function rotate(x: number, y: number, angle: number): Point {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return { x: x * cos - y * sin, y: x * sin + y * cos };
}
