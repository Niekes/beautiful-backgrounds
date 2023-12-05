export default class Symbol {
    protected x: number;
    protected y: number;
    protected fontSize: number;
    protected color: string;

    constructor(x: number, y: number, fontSize: number, color: string = '#0f0') {
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.color = color;
    }

    update(height: number, randomness: number): void {
        if (this.y * this.fontSize > height && Math.random() > randomness) {
            this.y = 0;
        } else {
            this.y += 1;
        }
    }

    draw(ctx: CanvasRenderingContext2D, text: string): void {
        ctx.fillStyle = this.color;
        ctx.fillText(
            text,
            this.x * this.fontSize,
            this.y * this.fontSize
        );
    }
}
