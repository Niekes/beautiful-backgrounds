/**
 * The thinnest a line is drawn, in pixels of the screen. A thinner line
 * breaks up into steps, and many of them side by side into a grid.
 */
const THINNEST = 2;

/**
 * Strokes the current path `width` px wide. A line thinner than THINNEST
 * screen pixels is drawn that wide instead, and as much fainter as it is
 * thinner, so it gives off the same light.
 */
export function strokeLine(ctx: CanvasRenderingContext2D, width: number): void {
    const thinnest = THINNEST / ctx.getTransform().a;
    const alpha = ctx.globalAlpha;
    ctx.lineWidth = Math.max(width, thinnest);
    ctx.globalAlpha = alpha * Math.min(1, Math.max(0, width) / thinnest);
    ctx.stroke();
    ctx.globalAlpha = alpha;
}
