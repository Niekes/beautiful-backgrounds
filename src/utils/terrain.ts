/** A smooth random landscape: its height at (x, y), from 0 to 1. */
export type Terrain = (x: number, y: number) => number;

/** The lattice of random heights repeats every PERIOD units. */
const PERIOD = 256;
const OCTAVES = 4;

/**
 * Creates a new random terrain from value noise: random heights on a lattice,
 * blended with cosine interpolation in four octaves, each half as high as the
 * one before. The same recipe as p5's noise().
 */
export function createTerrain(): Terrain {
    const heights = Float32Array.from({ length: PERIOD * PERIOD }, () =>
        Math.random(),
    );
    // `& (PERIOD - 1)` wraps negative coordinates too.
    const height = (x: number, y: number): number =>
        heights[(y & (PERIOD - 1)) * PERIOD + (x & (PERIOD - 1))];

    const octave = (x: number, y: number): number => {
        const x0 = Math.floor(x);
        const y0 = Math.floor(y);
        const tx = ease(x - x0);
        const ty = ease(y - y0);
        const top = lerp(height(x0, y0), height(x0 + 1, y0), tx);
        const bottom = lerp(height(x0, y0 + 1), height(x0 + 1, y0 + 1), tx);
        return lerp(top, bottom, ty);
    };

    return (x, y) => {
        let sum = 0;
        for (let i = 1; i <= OCTAVES; i++) {
            sum += octave(x * 2 ** (i - 1), y * 2 ** (i - 1)) / 2 ** i;
        }
        return sum;
    };
}

function ease(t: number): number {
    return (1 - Math.cos(t * Math.PI)) / 2;
}

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}
