export type IconNode = Array<
    [string, Record<string, string | number | undefined>]
>;

function strokeStyle(
    ctx: CanvasRenderingContext2D,
    attrs: Record<string, string | number | undefined>,
    color: string,
): void {
    const stroke =
        attrs.stroke && attrs.stroke !== "currentColor"
            ? String(attrs.stroke)
            : color;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Number(attrs["stroke-width"] ?? 2);
    ctx.lineCap = (attrs["stroke-linecap"] as CanvasLineCap) ?? "round";
    ctx.lineJoin = (attrs["stroke-linejoin"] as CanvasLineJoin) ?? "round";
}

function fillStyle(
    ctx: CanvasRenderingContext2D,
    attrs: Record<string, string | number | undefined>,
): string | null {
    if (attrs.fill && attrs.fill !== "none") {
        const value = String(attrs.fill);
        ctx.fillStyle = value;
        return value;
    }
    return null;
}

function drawPath(
    ctx: CanvasRenderingContext2D,
    attrs: Record<string, string | number | undefined>,
    color: string,
): void {
    strokeStyle(ctx, attrs, color);
    const fill = fillStyle(ctx, attrs);
    const path = new Path2D(String(attrs.d ?? ""));
    if (fill) ctx.fill(path);
    ctx.stroke(path);
}

function drawRect(
    ctx: CanvasRenderingContext2D,
    attrs: Record<string, string | number | undefined>,
    color: string,
): void {
    strokeStyle(ctx, attrs, color);
    const fill = fillStyle(ctx, attrs);
    const x = Number(attrs.x ?? 0);
    const y = Number(attrs.y ?? 0);
    const w = Number(attrs.width ?? 0);
    const h = Number(attrs.height ?? 0);
    const rx = Number(attrs.rx ?? attrs.ry ?? 0);
    ctx.beginPath();
    if (rx > 0 && typeof ctx.roundRect === "function") {
        ctx.roundRect(x, y, w, h, rx);
    } else {
        ctx.rect(x, y, w, h);
    }
    if (fill) ctx.fill();
    ctx.stroke();
}

function drawCircle(
    ctx: CanvasRenderingContext2D,
    attrs: Record<string, string | number | undefined>,
    color: string,
): void {
    drawEllipse(ctx, { ...attrs, rx: attrs.r, ry: attrs.r }, color);
}

function drawEllipse(
    ctx: CanvasRenderingContext2D,
    attrs: Record<string, string | number | undefined>,
    color: string,
): void {
    strokeStyle(ctx, attrs, color);
    const fill = fillStyle(ctx, attrs);
    const x = Number(attrs.cx ?? 0);
    const y = Number(attrs.cy ?? 0);
    const rx = Number(attrs.rx ?? 0);
    const ry = Number(attrs.ry ?? 0);
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    if (fill) ctx.fill();
    ctx.stroke();
}

function drawLine(
    ctx: CanvasRenderingContext2D,
    attrs: Record<string, string | number | undefined>,
    color: string,
): void {
    strokeStyle(ctx, attrs, color);
    ctx.beginPath();
    ctx.moveTo(Number(attrs.x1 ?? 0), Number(attrs.y1 ?? 0));
    ctx.lineTo(Number(attrs.x2 ?? 0), Number(attrs.y2 ?? 0));
    ctx.stroke();
}

function drawPoints(
    ctx: CanvasRenderingContext2D,
    attrs: Record<string, string | number | undefined>,
    color: string,
    close: boolean,
): void {
    strokeStyle(ctx, attrs, color);
    const fill = fillStyle(ctx, attrs);
    const points = String(attrs.points ?? "")
        .trim()
        .split(/\s+/)
        .map((pair) => pair.split(",").map(Number));
    ctx.beginPath();
    points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point[0], point[1]);
        else ctx.lineTo(point[0], point[1]);
    });
    if (close) ctx.closePath();
    if (fill) ctx.fill();
    ctx.stroke();
}

const handlers: Record<
    string,
    (
        ctx: CanvasRenderingContext2D,
        attrs: Record<string, string | number | undefined>,
        color: string,
    ) => void
> = {
    path: drawPath,
    rect: drawRect,
    circle: drawCircle,
    ellipse: drawEllipse,
    line: drawLine,
    polyline: (ctx, attrs, color) => drawPoints(ctx, attrs, color, false),
    polygon: (ctx, attrs, color) => drawPoints(ctx, attrs, color, true),
};

export function drawLucideIcon(
    ctx: CanvasRenderingContext2D,
    node: IconNode,
    cx: number,
    cy: number,
    cellSize: number,
    color: string,
): void {
    const box = cellSize * 0.8;
    const scale = box / 24;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.translate(-12, -12);

    for (const [tag, attrs] of node) {
        const handler = handlers[tag];
        if (handler) handler(ctx, attrs, color);
    }

    ctx.restore();
}
