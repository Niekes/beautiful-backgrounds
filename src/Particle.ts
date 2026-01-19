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
    private frequencyX: number;
    private frequencyY: number;
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

        this.frequencyX = options.frequencyX ?? 1;
        this.frequencyY = options.frequencyY ?? 1;

        this.gridSides = options.gridSides ?? 6;
        this.gridSize = options.gridSize ?? 40;
        this.gridAngle = options.gridAngle ?? Math.PI / 2;

        this.x = options.x ?? 0;
        this.y = options.y ?? 0;
        this.px = this.x;
        this.py = this.y;
        this.born = Date.now();
        this.fadeInDuration = this.lifespan * 0.25;
        this.fadeOutDuration = this.lifespan * 0.5;
    }

    circularMove(centerX: number, centerY: number, deltaTime: number) {
        this.angle += this.speed * deltaTime;
        this.radius += this.force * deltaTime;

        const newX =
            centerX + Math.cos(this.angle * this.frequencyX) * this.radius;
        const newY =
            centerY + Math.sin(this.angle * this.frequencyY) * this.radius;

        if (!this.initialized) {
            this.x = newX;
            this.y = newY;
            this.px = newX;
            this.py = newY;
            this.initialized = true;
        } else {
            this.px = this.x;
            this.py = this.y;
            this.x = newX;
            this.y = newY;
        }
    }

    sinusMove(centerX: number, centerY: number, deltaTime: number) {
        this.angle += this.speed * deltaTime;

        const newX = centerX + this.angle * 100;
        const newY =
            centerY + Math.sin(this.angle * this.frequencyY) * this.radius;

        if (!this.initialized) {
            this.x = newX;
            this.y = newY;
            this.px = newX;
            this.py = newY;
            this.initialized = true;
        } else {
            this.px = this.x;
            this.py = this.y;
            this.x = newX;
            this.y = newY;
        }
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

    railMove(centerX: number, centerY: number, deltaTime: number) {
        if (!this.initialized) {
            // Initial snap to grid
            const seedX = this.x;
            const seedY = this.y;

            const snapped = this.snapToGrid(seedX, seedY, centerX, centerY);
            this.railFromX = snapped.x;
            this.railFromY = snapped.y;
            this.pickNextRailTarget();

            this.x = this.railFromX;
            this.y = this.railFromY;
            this.px = this.x;
            this.py = this.y;
            this.initialized = true;
            this.railProgress = 0;
        }

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
        const dx = this.railToX - this.railFromX;
        const dy = this.railToY - this.railFromY;
        const newX = this.railFromX + dx * this.railProgress;
        const newY = this.railFromY + dy * this.railProgress;

        this.updatePosition(newX, newY);
    }

    private pickNextRailTarget() {
        const sector = (Math.PI * 2) / this.gridSides;

        // Randomly pick one of the k directions (0 to gridSides-1)
        // This allows changing direction at every node
        const k = Math.floor(Math.random() * this.gridSides);
        const angle = k * sector + this.gridAngle;

        this.railToX = this.railFromX + Math.cos(angle) * this.gridSize;
        this.railToY = this.railFromY + Math.sin(angle) * this.gridSize;
    }

    private snapToGrid(
        x: number,
        y: number,
        ox: number,
        oy: number,
    ): { x: number; y: number } {
        let rx = x - ox;
        let ry = y - oy;

        const cos = Math.cos(-this.gridAngle);
        const sin = Math.sin(-this.gridAngle);
        const rrx = rx * cos - ry * sin;
        const rry = rx * sin + ry * cos;

        let sx = rrx;
        let sy = rry;
        const size = this.gridSize;

        if (this.gridSides === 6 || this.gridSides === 3) {
            const h = (size * Math.sqrt(3)) / 2;
            let n2 = Math.round(rry / h);

            // For triangular lattice alignment matching hex edges, we need checking parity
            // But simple triangular lattice snapping is usually sufficient for "rail look"
            // n1 = (x - n2 * L/2) / L
            let n1 = Math.round((rrx - (n2 * size) / 2) / size);

            sx = n1 * size + (n2 * size) / 2;
            sy = n2 * h;
        } else if (this.gridSides === 4) {
            sx = Math.round(rrx / size) * size;
            sy = Math.round(rry / size) * size;
        }

        const finalX =
            sx * Math.cos(this.gridAngle) - sy * Math.sin(this.gridAngle);
        const finalY =
            sx * Math.sin(this.gridAngle) + sy * Math.cos(this.gridAngle);

        return { x: finalX + ox, y: finalY + oy };
    }

    private updatePosition(nx: number, ny: number) {
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
    frequencyX?: number;
    frequencyY?: number;
    gridSides?: number;
    gridSize?: number;
    gridAngle?: number;
    x?: number;
    y?: number;
}
