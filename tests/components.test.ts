import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import {
    BeautifulBackground,
    BbAmbientRibbon,
    BbConcentricPulse,
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
    ["bb-concentric-pulse", BbConcentricPulse],
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

describe("bb-concentric-pulse", () => {
    it("draws rings in colors between its ring colors", async () => {
        const el = await mount<BbConcentricPulse>("bb-concentric-pulse", {
            "ring-colors": "#ff0000, #0000ff",
        });
        const seen = styles(el, () => frame(el));
        const rings = [...seen].filter((s) => s.startsWith("rgba"));

        expect(rings.length).toBeGreaterThan(1);
        for (const ring of rings) {
            expect(ring).toMatch(/^rgba\(\d+, 0, \d+, [\d.]+\)$/);
        }
    });

    it.each([
        ["one ring color", { "ring-colors": "#00ff00" }, /^rgba\(0, 255, 0,/],
        ["no ring colors", { "ring-colors": "" }, /^rgba\(\d+, \d+, 255,/],
    ])("draws with %s", async (_, attributes, color) => {
        const el = await mount<BbConcentricPulse>(
            "bb-concentric-pulse",
            attributes,
        );
        const seen = styles(el, () => frame(el));
        const rings = [...seen].filter((s) => s.startsWith("rgba"));

        expect(rings.length).toBeGreaterThan(0);
        rings.forEach((ring) => expect(ring).toMatch(color));
    });

    it("skips rings with a negative radius", async () => {
        const el = await mount<BbConcentricPulse>("bb-concentric-pulse", {
            "ring-count": "1",
            "ring-spacing": "0",
            "ring-amplitude": "-1000",
        });
        vi.spyOn(Math, "sin").mockReturnValue(1);
        const arc = vi.spyOn(el.ctx, "arc");
        frame(el);
        expect(arc).not.toHaveBeenCalled();
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
