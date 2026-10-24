import { getRandomInt } from "./number";

export type Hsl = { h: number; s: number; l: number };

let probe: CanvasRenderingContext2D | null = null;

export function randomColor(
    hRange: number[] = [0, 360],
    sRange: number[] = [0, 100],
    lRange: number[] = [40, 60],
): string {
    const h: number = getRandomInt(hRange[0], hRange[1]);
    const s: number = getRandomInt(sRange[0], sRange[1]);
    const l: number = getRandomInt(lRange[0], lRange[1]);

    return `hsl(${h}, ${s}%, ${l}%)`;
}

export function hsla(
    hue: number,
    saturation: number,
    lightness: number,
    opacity: number,
): string {
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;
}

/**
 * Converts any CSS color to HSL, with `s` and `l` from 0 to 1. The browser
 * parses the color, so every format a canvas accepts works. An invalid color
 * turns into black.
 */
export function toHsl(color: string): Hsl {
    const [r, g, b] = toRgb(color).map((channel) => channel / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min;

    if (d === 0) return { h: 0, s: 0, l };

    const s = d / (1 - Math.abs(2 * l - 1));
    let h: number;
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;

    return { h: h * 60, s, l };
}

function toRgb(color: string): number[] {
    probe ??= document.createElement("canvas").getContext("2d")!;
    probe.fillStyle = "#000";
    probe.fillStyle = color;
    // The canvas serialises opaque colors as #rrggbb and the others as rgba().
    const value = String(probe.fillStyle);

    if (value.startsWith("#")) {
        return [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16));
    }
    return value.match(/[\d.]+/g)!.slice(0, 3).map(Number);
}
