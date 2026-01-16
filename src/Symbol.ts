export default class Symbol {
    protected x: number;
    protected y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    update(height: number, randomness: number, fontSize: number): void {
        if (this.y * fontSize > height && Math.random() > randomness) {
            this.y = 0;
        } else {
            this.y += 1;
        }
    }

    draw(
        ctx: CanvasRenderingContext2D,
        text: string,
        color: string,
        fontSize: number
    ): void {
        ctx.fillStyle = color;
        ctx.fillText(text, this.x * fontSize, this.y * fontSize);
    }
}
