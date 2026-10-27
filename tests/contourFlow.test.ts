import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { BbContourFlow } from "../index";
import { frame, mount, unmountAll } from "./mount";

// Its own file, since vi.mock replaces the terrain for every test in a file:
// one that rises evenly to the right, so every line flows left.
vi.mock("../src/utils/terrain", () => ({
    createTerrain: () => (x: number) => x,
}));

/** The summed red and blue of a vertical strip of the canvas, in CSS px. */
function redAndBlue(el: BbContourFlow, from: number, to: number): number[] {
    const dpr = el.canvas.width / el.width;
    const { data } = el.ctx.getImageData(
        from * dpr,
        0,
        (to - from) * dpr,
        el.canvas.height,
    );
    let red = 0;
    let blue = 0;
    for (let i = 0; i < data.length; i += 4) {
        red += data[i];
        blue += data[i + 2];
    }
    return [red, blue];
}

afterEach(unmountAll);

describe("bb-contour-flow on a slope", () => {
    it("colors low ground in its first line color and high ground in its last", async () => {
        const el = await mount<BbContourFlow>("bb-contour-flow", {
            "line-colors": "#ff0000, #0000ff",
            "line-opacity": "1",
        });
        for (let i = 0; i < 5; i++) frame(el);

        const [lowRed, lowBlue] = redAndBlue(el, 0, 50);
        const [highRed, highBlue] = redAndBlue(el, 250, 300);
        expect(lowRed).toBeGreaterThan(2 * lowBlue);
        expect(highBlue).toBeGreaterThan(2 * highRed);
    });
});
