// The speed at which the rows are spaced exactly one font size apart.
const BASE_SPEED = 30;

export default class Symbol {
    protected x: number;
    protected y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    update(
        height: number,
        randomness: number,
        fontSize: number,
        deltaTime: number,
        speed: number,
    ): void {
        const spacingFactor = speed / BASE_SPEED;
        if (
            this.y * fontSize * spacingFactor > height &&
            Math.random() > randomness
        ) {
            this.y = 0;
        } else {
            this.y += speed * deltaTime;
        }
    }

    draw(
        ctx: CanvasRenderingContext2D,
        text: string,
        color: string,
        fontSize: number,
        speed: number,
    ): void {
        const spacingFactor = speed / BASE_SPEED;
        ctx.fillStyle = color;
        ctx.fillText(
            text,
            this.x * fontSize,
            this.y * fontSize * spacingFactor,
        );
    }
}
