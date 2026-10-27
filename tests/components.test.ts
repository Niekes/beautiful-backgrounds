import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import {
    BeautifulBackground,
    BbAmbientRibbon,
    BbContourFlow,
    BbDigitalRain,
    BbHexagonWave,
    BbLiquidLines,
    BbNeonRails,
    BbStarTrail,
} from "../index";
import { frame, mount, unmountAll } from "./mount";

/** Whether anything but the background was drawn into the canvas. */
function drewSomething(el: { ctx: CanvasRenderingContext2D }): boolean {
    const { width, height } = el.ctx.canvas;
    const data = el.ctx.getImageData(0, 0, width, height).data;
    return data.some((value, i) => i % 4 !== 3 && value > 0);
}

/** Collects every color a frame strokes or fills with. */
function styles(
    el: { ctx: CanvasRenderingContext2D },
    run: () => void,
): Set<string> {
    const seen = new Set<string>();
    const ctx = el.ctx;
    const proto: object = Object.getPrototypeOf(ctx);
    for (const key of ["strokeStyle", "fillStyle"] as const) {
        const descriptor = Object.getOwnPropertyDescriptor(proto, key)!;
        vi.spyOn(ctx, key, "set").mockImplementation((value) => {
            if (typeof value === "string") seen.add(value);
            descriptor.set!.call(ctx, value);
        });
    }
    run();
    return seen;
}

afterEach(() => {
    unmountAll();
    vi.restoreAllMocks();
});

describe.each([
    ["bb-ambient-ribbon", BbAmbientRibbon],
    ["bb-contour-flow", BbContourFlow],
    ["bb-digital-rain", BbDigitalRain],
    ["bb-hexagon-wave", BbHexagonWave],
    ["bb-liquid-lines", BbLiquidLines],
    ["bb-neon-rails", BbNeonRails],
    ["bb-star-trail", BbStarTrail],
])("<%s>", (tag, Element) => {
    it("is registered as a BeautifulBackground", () => {
        expect(customElements.get(tag)).toBe(Element);
        expect(document.createElement(tag)).toBeInstanceOf(BeautifulBackground);
    });
});

describe("bb-ambient-ribbon", () => {
    it("draws its ribbons", async () => {
        const el = await mount<BbAmbientRibbon>("bb-ambient-ribbon", {
            "ribbon-count": "2",
            "ribbon-width": "5",
            "ribbon-line-opacity": "1",
        });
        el.ctx.clearRect(0, 0, el.width, el.height);
        frame(el);
        expect(el).toBeInstanceOf(BbAmbientRibbon);
        expect(drewSomething(el)).toBe(true);
    });

    it("turns either way, at random", async () => {
        let i = 0;
        vi.spyOn(Math, "random").mockImplementation(() => [0.2, 0.8][i++ % 2]);
        const el = await mount<BbAmbientRibbon>("bb-ambient-ribbon", {
            "ribbon-count": "1",
            "ribbon-width": "1",
        });
        frame(el);
        expect(drewSomething(el)).toBe(true);
    });

    it("applies changes to its speed, count and width", async () => {
        const el = await mount<BbAmbientRibbon>("bb-ambient-ribbon", {
            "ribbon-count": "1",
            "ribbon-width": "10",
        });
        const ribbons = (): { lines: number[][]; speed: number[] }[] =>
            (el as unknown as { ribbons: [] }).ribbons;

        el.ribbonSpeedMin = 1;
        el.ribbonSpeedMax = 1;
        await el.updateComplete;
        expect(ribbons()[0].speed.map(Math.abs)).toEqual([1, 1, 1, 1]);

        el.ribbonCount = 3;
        await el.updateComplete;
        expect(ribbons()).toHaveLength(3);

        el.ribbonWidth = 4;
        await el.updateComplete;
        expect(ribbons()[0].lines).toHaveLength(4);

        el.ribbonWidth = 8;
        await el.updateComplete;
        expect(ribbons()[0].lines).toHaveLength(4);
    });
});

describe("bb-contour-flow", () => {
    type FlowParticle = { x: number; y: number; dx: number; dy: number };
    const particles = (el: BbContourFlow): FlowParticle[] =>
        (el as unknown as { particles: FlowParticle[] }).particles;

    it("draws its lines in shades between its line colors", async () => {
        const el = await mount<BbContourFlow>("bb-contour-flow", {
            "line-colors": "#ff0000, #0000ff",
            "line-opacity": "1",
        });
        const seen = styles(el, () => {
            frame(el);
            frame(el);
        });

        expect(seen).toContain("rgb(255, 0, 0)");
        expect(seen).toContain("rgb(0, 0, 255)");
        for (const color of seen) expect(color).toMatch(/^rgb\(\d+, 0, \d+\)$/);
        expect(drewSomething(el)).toBe(true);
    });

    it("draws in its default color without line colors", async () => {
        const el = await mount<BbContourFlow>("bb-contour-flow", {
            "line-colors": "",
        });
        const seen = styles(el, () => frame(el));

        expect([...seen]).toEqual(["rgb(137, 150, 78)"]);
    });

    it("starts over when its size or terrain changes", async () => {
        const el = await mount<BbContourFlow>("bb-contour-flow", {
            "particle-count": "10",
        });
        const first = particles(el);

        el.flowSpeed = 50;
        await el.updateComplete;
        frame(el);
        expect(particles(el)).toBe(first);

        el.particleCount = 20;
        await el.updateComplete;
        frame(el);
        expect(particles(el)).toHaveLength(20);

        for (const change of [
            () => (el.terrainSize = 500),
            () => (el.lineColors = ["#ff0000"]),
            () => (el.width = 600),
        ]) {
            const before = particles(el);
            change();
            await el.updateComplete;
            frame(el);
            expect(particles(el)).not.toBe(before);
        }
    });

    it("wraps particles around the edges", async () => {
        const el = await mount<BbContourFlow>("bb-contour-flow", {
            "particle-count": "50",
        });
        const [particle] = particles(el);
        Object.assign(particle, { x: 499.9, y: 0.1, dx: 1, dy: -1 });

        for (let i = 0; i < 100; i++) frame(el);
        for (const { x, y } of particles(el)) {
            expect(x).toBeGreaterThanOrEqual(0);
            expect(x).toBeLessThan(500);
            expect(y).toBeGreaterThanOrEqual(0);
            expect(y).toBeLessThan(400);
        }
    });

    it("respawns particles somewhere new at the end of their life", async () => {
        const random = vi.spyOn(Math, "random").mockReturnValue(0.5);
        const el = await mount<BbContourFlow>("bb-contour-flow", {
            "particle-count": "1",
            "particle-life": "1",
            "flow-speed": "0",
        });
        frame(el, 0.9);
        expect(particles(el)[0]).toMatchObject({ x: 250, y: 200 });

        random.mockReturnValue(0.1);
        frame(el, 0.2);
        expect(particles(el)[0]).toMatchObject({ x: 50, y: 40 });
    });

    it("fades its lines away until at most a trace is left", async () => {
        const el = await mount<BbContourFlow>("bb-contour-flow", {
            "particle-count": "0",
            "trail-opacity": "0.005",
        });
        // As faint as a single stroke of a line.
        el.ctx.globalAlpha = 0.05;
        el.ctx.fillStyle = "#fff";
        el.ctx.fillRect(0, 0, el.width, el.height);
        el.ctx.globalAlpha = 1;

        for (let i = 0; i < 600; i++) frame(el);
        const { width, height } = el.canvas;
        const { data } = el.ctx.getImageData(0, 0, width, height);
        const left = data.filter((_, i) => i % 4 === 3);
        expect(Math.max(...left)).toBeLessThanOrEqual(4);
    });

    it("keeps its lines for good without a trail", async () => {
        const el = await mount<BbContourFlow>("bb-contour-flow", {
            "particle-count": "0",
            "trail-opacity": "0",
        });
        el.ctx.fillStyle = "#fff";
        el.ctx.fillRect(0, 0, el.width, el.height);

        for (let i = 0; i < 100; i++) frame(el);
        expect(el.ctx.getImageData(1, 1, 1, 1).data[3]).toBe(255);
    });

    it.each([
        ["#ff0000, #0000ff", "linear-gradient(rgb(255, 0, 0), rgb(0, 0, 255))"],
        ["#00ff00", "rgb(0, 255, 0)"],
        ["", "rgb(0, 0, 0)"],
    ])("shows %j behind its lines", async (colors, background) => {
        const el = await mount<BbContourFlow>("bb-contour-flow", {
            "bg-colors": colors,
            "bg-angle": "90",
        });

        expect(el.canvas.style.background).toBe(background);
    });

    /**
     * The opacity of the lines at each height, from the lowest ground to the
     * highest, over one frame. Their colors run from red (low) to blue (high).
     */
    function lightByHeight(el: BbContourFlow, deltaTime: number): number[] {
        const light = new Map<number, number>();
        vi.spyOn(el.ctx, "stroke").mockImplementation(() => {
            const red = parseInt(String(el.ctx.strokeStyle).slice(1, 3), 16);
            light.set(255 - red, el.ctx.globalAlpha);
        });
        frame(el, deltaTime);
        vi.mocked(el.ctx.stroke).mockRestore();
        return [...light].sort(([a], [b]) => a - b).map(([, alpha]) => alpha);
    }

    it("keeps every line at its line opacity without a pulse", async () => {
        const el = await mount<BbContourFlow>("bb-contour-flow", {
            "line-colors": "#ff0000, #0000ff",
            "line-opacity": "0.2",
            "pulse-strength": "0",
        });

        expect(new Set(lightByHeight(el, 0.1))).toEqual(new Set([0.2]));
    });

    it("sends waves of light downhill", async () => {
        const el = await mount<BbContourFlow>("bb-contour-flow", {
            "line-colors": "#ff0000, #0000ff",
            "line-opacity": "0.5",
            "pulse-strength": "1",
            "pulse-speed": "1",
        });
        const before = lightByHeight(el, 0.1);
        const after = lightByHeight(el, 0.1);

        expect(Math.max(...before)).toBeCloseTo(1, 2);
        expect(Math.min(...before)).toBeCloseTo(0, 2);
        // How far the light moved, in heights: the best match of the two.
        const mismatch = (shift: number): number =>
            after.reduce(
                (sum, alpha, i) =>
                    sum + Math.abs(alpha - (before[i + shift] ?? alpha)),
                0,
            );
        const shifts = Array.from({ length: 21 }, (_, i) => i - 10);
        const moved = shifts.reduce((a, b) =>
            mismatch(b) < mismatch(a) ? b : a,
        );
        expect(moved).toBeGreaterThan(0);
    });

    it("leaves particles standing on a flat terrain", async () => {
        vi.spyOn(Math, "random").mockReturnValue(0.5);
        const el = await mount<BbContourFlow>("bb-contour-flow", {
            "particle-count": "1",
        });
        frame(el);

        expect(particles(el)[0]).toMatchObject({
            x: 250,
            y: 200,
            dx: 0,
            dy: 0,
        });
    });
});

describe("bb-digital-rain", () => {
    it("rains one column per font size, in its font colors", async () => {
        const el = await mount<BbDigitalRain>("bb-digital-rain", {
            "font-size": "30",
            "font-colors": "#ff0000",
        });
        const seen = styles(el, () => frame(el));

        expect(el.symbols).toHaveLength(10);
        expect(seen).toContain("#ff0000");
    });

    it("picks random colors from its hue range by default", async () => {
        const el = await mount<BbDigitalRain>("bb-digital-rain", {
            "font-color-hue-start": "10",
        });
        const seen = styles(el, () => frame(el));

        expect([...seen].some((s) => s.startsWith("hsl("))).toBe(true);
    });

    it("adds and drops columns when the width changes", async () => {
        const el = await mount<BbDigitalRain>("bb-digital-rain", {
            "font-size": "30",
        });
        el.width = 600;
        frame(el);
        expect(el.symbols).toHaveLength(20);

        el.width = 150;
        frame(el);
        expect(el.symbols).toHaveLength(5);
    });
});

describe("bb-hexagon-wave", () => {
    it("shades its hexagons in a hue range by default", async () => {
        const el = await mount<BbHexagonWave>("bb-hexagon-wave");
        const seen = styles(el, () => frame(el));

        expect([...seen].some((s) => s.startsWith("hsl("))).toBe(true);
    });

    it("keeps the hue of its hex colors", async () => {
        const el = await mount<BbHexagonWave>("bb-hexagon-wave", {
            "hex-colors": "#ff0000",
        });
        const seen = styles(el, () => frame(el));

        expect([...seen].some((s) => s.startsWith("hsl(0, 100%"))).toBe(true);
    });

    it("rebuilds its grid when the hexagon size changes", async () => {
        const el = await mount<BbHexagonWave>("bb-hexagon-wave");
        const grid = (): unknown[] => (el as unknown as { grid: [] }).grid;
        const before = grid();

        el.waveSpeed = 2;
        await el.updateComplete;
        expect(grid()).toBe(before);

        el.hexSize = 100;
        await el.updateComplete;
        expect(grid().length).toBeLessThan(before.length);
    });
});

describe("bb-liquid-lines", () => {
    it("colors its lines in a hue range by default", async () => {
        const el = await mount<BbLiquidLines>("bb-liquid-lines");
        const seen = styles(el, () => frame(el));

        expect([...seen].some((s) => s.startsWith("hsl("))).toBe(true);
    });

    it("keeps the hue of its line colors", async () => {
        const el = await mount<BbLiquidLines>("bb-liquid-lines", {
            "line-colors": "#0000ff",
        });
        const seen = styles(el, () => frame(el));

        expect([...seen].some((s) => s.startsWith("hsl(240, 100%"))).toBe(true);
    });
});

describe.each([
    ["bb-neon-rails", BbNeonRails],
    ["bb-star-trail", BbStarTrail],
])("%s", (tag, Element) => {
    it("keeps its particle amount, replacing particles that die", async () => {
        const now = vi.spyOn(Date, "now").mockReturnValue(0);
        const el = await mount<InstanceType<typeof Element>>(tag, {
            "particle-amount": "5",
            "particle-lifespan-min": "10",
            "particle-lifespan-max": "10",
            "particle-colors": "#ff00ff",
        });
        const particles = (): unknown[] =>
            (el as unknown as { particles: [] }).particles;
        const first = particles()[0];

        now.mockReturnValue(5);
        const seen = styles(el, () => frame(el));
        expect(seen).toContain("#ff00ff");
        expect(particles()[0]).toBe(first);

        now.mockReturnValue(20);
        frame(el);
        expect(particles()).toHaveLength(5);
        expect(particles()).not.toContain(first);
    });

    it("picks random colors from its hue range by default", async () => {
        const el = await mount<InstanceType<typeof Element>>(tag, {
            "particle-amount": "3",
        });
        const seen = styles(el, () => frame(el));

        expect([...seen].some((s) => s.startsWith("hsl("))).toBe(true);
    });
});

describe("bb-star-trail", () => {
    it("orbits up to the canvas width when particle-radius-max is 0", async () => {
        vi.spyOn(Math, "random").mockReturnValue(0.999999);
        const el = await mount<BbStarTrail>("bb-star-trail", {
            "particle-amount": "1",
            "particle-radius-max": "0",
        });

        expect(el.particleRadiusMax).toBe(300);
    });
});
