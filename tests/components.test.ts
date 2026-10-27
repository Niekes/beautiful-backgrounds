import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import {
    BeautifulBackground,
    BbAmbientRibbon,
    BbContourFlow,
    BbDigitalRain,
    BbHexagonWave,
    BbLiquidLines,
    BbNeonRails,
    BbSmokeRing,
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
    ["bb-smoke-ring", BbSmokeRing],
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
            "particle-amount": "10",
        });
        const first = particles(el);

        el.flowSpeed = 50;
        await el.updateComplete;
        frame(el);
        expect(particles(el)).toBe(first);

        el.particleAmount = 20;
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
            "particle-amount": "50",
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
            "particle-amount": "1",
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
            "particle-amount": "0",
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
            "particle-amount": "0",
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
            "particle-amount": "1",
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

describe("bb-smoke-ring", () => {
    /** A pixel on the ring of a 300 x 200 canvas, whose radius is 40 px. */
    const RING_X = 150 + 37;

    /** The red, green and blue of the canvas at (x, y), in CSS px. */
    function light(el: BbSmokeRing, x: number, y: number): number[] {
        const dpr = el.canvas.width / el.width;
        const { data } = el.ctx.getImageData(x * dpr, y * dpr, 1, 1);
        return Array.from(data).slice(0, 3);
    }

    /** The red, green and blue of the whole canvas, summed. */
    function allLight(el: BbSmokeRing): number {
        const { width, height } = el.canvas;
        const { data } = el.ctx.getImageData(0, 0, width, height);
        return data.reduce((sum, value, i) => sum + (i % 4 < 3 ? value : 0));
    }

    /** All the light on a black background after `frames` frames. */
    async function lightAfter(
        frames: number,
        attributes: Record<string, string> = {},
        deltaTime: number = 1 / 60,
    ): Promise<number> {
        const el = await mount<BbSmokeRing>("bb-smoke-ring", {
            "bg-colors": "#000",
            ...attributes,
        });
        for (let i = 0; i < frames; i++) frame(el, deltaTime);
        return allLight(el);
    }

    it("shines in its ring color around the middle", async () => {
        const el = await mount<BbSmokeRing>("bb-smoke-ring", {
            "ring-colors": "#ff0000",
            "bg-colors": "#000",
        });
        for (let i = 0; i < 10; i++) frame(el);

        const [red, green, blue] = light(el, RING_X, 100);
        expect(red).toBeGreaterThan(50);
        expect([green, blue]).toEqual([0, 0]);
        expect(light(el, 150, 100)).toEqual([0, 0, 0]);
        expect(light(el, 5, 5)).toEqual([0, 0, 0]);
    });

    it("adds its light to the background", async () => {
        const el = await mount<BbSmokeRing>("bb-smoke-ring", {
            "ring-colors": "#ff0000",
            "bg-colors": "#0000ff",
        });
        for (let i = 0; i < 10; i++) frame(el);

        const [red, green, blue] = light(el, RING_X, 100);
        expect(red).toBeGreaterThan(50);
        expect([green, blue]).toEqual([0, 255]);
    });

    it("shines around the middle of a canvas bigger than its buffer", async () => {
        // 800 x 400 is more than the buffer holds, so the smoke is stretched:
        // the ring's radius is 80 px.
        const el = await mount<BbSmokeRing>(
            "bb-smoke-ring",
            { "ring-colors": "#ff0000", "bg-colors": "#000" },
            { width: 800, height: 400 },
        );
        for (let i = 0; i < 10; i++) frame(el);

        expect(light(el, 400 + 75, 200)[0]).toBeGreaterThan(50);
        expect(light(el, 400, 200)).toEqual([0, 0, 0]);
    });

    it("turns the way its smoke drifts", async () => {
        const el = await mount<BbSmokeRing>("bb-smoke-ring", {
            "ring-colors": "#ffffff",
            "bg-colors": "#000",
            "trail-opacity": "0.05",
        });
        /** The direction from the middle to the middle of all light. */
        function direction(): number {
            const { width, height } = el.canvas;
            const { data } = el.ctx.getImageData(0, 0, width, height);
            let [x, y] = [0, 0];
            for (let i = 0; i < data.length; i += 4) {
                const pixel = i / 4;
                x += data[i] * ((pixel % width) - width / 2);
                y += data[i] * (Math.floor(pixel / width) - height / 2);
            }
            return Math.atan2(y, x);
        }

        for (let i = 0; i < 180; i++) frame(el);
        const before = direction();
        for (let i = 0; i < 360; i++) frame(el);
        const turn = direction() - before;
        const turned = Math.abs(Math.atan2(Math.sin(turn), Math.cos(turn)));
        expect(turned).toBeGreaterThan(0.2);
    });

    it("runs through its ring colors", async () => {
        const el = await mount<BbSmokeRing>("bb-smoke-ring", {
            "ring-colors": "#ff0000, #0000ff",
            "bg-colors": "#000",
        });
        frame(el, 0.01);
        const [red, , blue] = light(el, RING_X, 100);
        expect(red).toBeGreaterThan(0);
        expect(blue).toBe(0);

        for (let i = 0; i < 100; i++) frame(el, 0.1);
        expect(light(el, RING_X, 100)[2]).toBeGreaterThan(0);
    });

    it("shines in its default colors without ring colors", async () => {
        const el = await mount<BbSmokeRing>("bb-smoke-ring", {
            "ring-colors": "",
            "bg-colors": "#000",
        });
        for (let i = 0; i < 10; i++) frame(el);

        expect(Math.max(...light(el, RING_X, 100))).toBeGreaterThan(50);
    });

    it("lets its smoke drift out beyond the ring", async () => {
        const el = await mount<BbSmokeRing>("bb-smoke-ring", {
            "ring-colors": "#0000ff",
            "bg-colors": "#000",
        });
        frame(el);
        expect(light(el, 150 + 56, 100)).toEqual([0, 0, 0]);

        for (let i = 0; i < 180; i++) frame(el);
        expect(light(el, 150 + 56, 100)[2]).toBeGreaterThan(10);
    });

    it("pushes its smoke left by its green and down by its red", async () => {
        /**
         * Which way the smoke leans after two seconds: left (+) or right (-),
         * and up (+) or down (-), 50 px either side of the middle.
         */
        async function lean(color: string): Promise<number[]> {
            const el = await mount<BbSmokeRing>("bb-smoke-ring", {
                "ring-colors": color,
                "bg-colors": "#000",
            });
            for (let i = 0; i < 120; i++) frame(el);
            const sum = (x: number, y: number): number =>
                light(el, x, y).reduce((a, b) => a + b, 0);
            // Pixels 100 and 199 lie equally far from the middle, at 150.
            return [
                sum(100, 100) - sum(199, 100),
                sum(150, 50) - sum(150, 149),
            ];
        }

        // Yellow is red with green, and green with red.
        const [redSideways] = await lean("#ff0000");
        const [, greenUpDown] = await lean("#00ff00");
        const [yellowSideways, yellowUpDown] = await lean("#ffff00");
        expect(yellowSideways).toBeGreaterThan(redSideways);
        expect(yellowUpDown).toBeLessThan(greenUpDown);
    });

    it("fades its smoke faster with a higher trail opacity", async () => {
        const fast = await lightAfter(120, { "trail-opacity": "0.05" });
        const slow = await lightAfter(120, { "trail-opacity": "0.002" });
        expect(fast).toBeLessThan(0.5 * slow);
    });

    it("looks the same at any frame rate", async () => {
        const at60 = await lightAfter(120);
        const at120 = await lightAfter(240, {}, 1 / 120);
        // Not exactly: every step blurs the smoke a little.
        expect(at120).toBeGreaterThan(0.8 * at60);
        expect(at120).toBeLessThan(1.2 * at60);
    });

    it("plays at its speed", async () => {
        const oneSecondAtDouble = await lightAfter(60, { speed: "2" });
        const twoSeconds = await lightAfter(120, { speed: "1" });
        expect(oneSecondAtDouble).toBeGreaterThan(0.8 * twoSeconds);
        expect(oneSecondAtDouble).toBeLessThan(1.2 * twoSeconds);
    });

    it("softens its light into the pixels around it", async () => {
        const el = await mount<BbSmokeRing>("bb-smoke-ring", {
            "bg-colors": "#000",
            "ring-colors": "#ffffff",
            "ring-wobble": "0",
            // Only the light of the last frame, without any smoke.
            "trail-opacity": "1",
        });
        frame(el, 1 / 15);

        // Pixel 190 lies just outside the ring's radius of 40 px, where the
        // ring itself gives off no light; pixel 189 lies just inside.
        expect(light(el, 189, 100)[0]).toBeGreaterThan(0);
        expect(light(el, 190, 100)[0]).toBeGreaterThan(0);
        expect(light(el, 192, 100)[0]).toBe(0);
    });

    it("swells its ring into waves", async () => {
        /** The spread of the ring's light around a circle near its edge. */
        async function unevenness(ringWobble: string): Promise<number> {
            const el = await mount<BbSmokeRing>("bb-smoke-ring", {
                "bg-colors": "#000",
                "ring-colors": "#ffffff",
                "ring-wobble": ringWobble,
                // Only the light of the last frame, without any smoke.
                "trail-opacity": "1",
            });
            for (let i = 0; i < 60; i++) frame(el);
            const around = Array.from({ length: 28 }, (_, k) => {
                const angle = (k / 28) * 2 * Math.PI;
                const x = Math.round(150 + 37 * Math.cos(angle));
                const y = Math.round(100 + 37 * Math.sin(angle));
                return light(el, x, y)[0];
            });
            return Math.max(...around) - Math.min(...around);
        }

        expect(await unevenness("0.1")).toBeGreaterThan(
            2 * (await unevenness("0")),
        );
    });

    it("shows no ring at size 0, and the ring again at a size", async () => {
        // An odd size puts a pixel right in the middle of the ring.
        const el = await mount<BbSmokeRing>(
            "bb-smoke-ring",
            { "ring-colors": "#ff0000", "bg-colors": "#000", "ring-size": "0" },
            { width: 301, height: 201 },
        );
        for (let i = 0; i < 60; i++) frame(el);
        expect(drewSomething(el)).toBe(false);

        el.ringSize = 0.2;
        for (let i = 0; i < 10; i++) frame(el);
        expect(light(el, RING_X, 100)[0]).toBeGreaterThan(50);
    });

    it("starts over in the middle of its new size", async () => {
        const el = await mount<BbSmokeRing>("bb-smoke-ring", {
            "bg-colors": "#000",
            "ring-colors": "#ffffff",
        });
        for (let i = 0; i < 10; i++) frame(el);

        el.style.width = "600px";
        window.dispatchEvent(new Event("resize"));
        await new Promise((resolve) => setTimeout(resolve, 150));
        for (let i = 0; i < 10; i++) frame(el);
        expect(light(el, 300 + 37, 100)[0]).toBeGreaterThan(50);
    });

    it.each([0, -1])("stands still at speed %d", async (speed) => {
        const el = await mount<BbSmokeRing>("bb-smoke-ring", {
            "bg-colors": "#000",
        });
        for (let i = 0; i < 30; i++) frame(el);
        el.speed = speed;
        const before = allLight(el);

        for (let i = 0; i < 30; i++) frame(el);
        expect(before).toBeGreaterThan(0);
        expect(allLight(el)).toBe(before);
    });

    it.each([
        ["2", "1"],
        ["-1", "0"],
    ])("treats a trail opacity of %s as %s", async (outside, inside) => {
        expect(await lightAfter(60, { "trail-opacity": outside })).toBe(
            await lightAfter(60, { "trail-opacity": inside }),
        );
    });

    it("moves on by no more than a moment after a long pause", async () => {
        async function smoke(pause: number): Promise<number> {
            const el = await mount<BbSmokeRing>("bb-smoke-ring", {
                "bg-colors": "#000",
            });
            for (let i = 0; i < 30; i++) frame(el);
            frame(el, pause);
            return allLight(el);
        }

        expect(await smoke(0.5)).toBe(await smoke(1));
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
