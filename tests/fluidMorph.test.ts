import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { BeautifulBackground, BbFluidMorph } from "../index";
import { frame, mount, unmountAll } from "./mount";

/** Whether anything but the background was drawn into the canvas. */
function drewSomething(el: { ctx: CanvasRenderingContext2D }): boolean {
    const { width, height } = el.ctx.canvas;
    const data = el.ctx.getImageData(0, 0, width, height).data;
    return data.some((value, i) => i % 4 !== 3 && value > 0);
}

/** The whole canvas as red, green and blue channels. */
function data(el: BbFluidMorph): number[] {
    const { width, height } = el.canvas;
    return Array.from(el.ctx.getImageData(0, 0, width, height).data);
}

/** How much the two canvases differ, at most. */
function maxDiff(one: number[], other: number[]): number {
    return one.reduce(
        (diff, value, i) => Math.max(diff, Math.abs(value - other[i])),
        0,
    );
}

/** Mounts a background after running it for a number of frames. */
async function morph(
    attributes: Record<string, string> = {},
    frames: number = 1,
): Promise<BbFluidMorph> {
    const el = await mount<BbFluidMorph>("bb-fluid-morph", attributes);
    for (let i = 0; i < frames; i++) frame(el);
    return el;
}

afterEach(unmountAll);

describe("bb-fluid-morph", () => {
    it("is registered as a BeautifulBackground", () => {
        expect(customElements.get("bb-fluid-morph")).toBe(BbFluidMorph);
        expect(document.createElement("bb-fluid-morph")).toBeInstanceOf(
            BeautifulBackground,
        );
    });

    it("draws its blobs in its colors", async () => {
        const el = await mount<BbFluidMorph>("bb-fluid-morph", {
            colors: "#ff0000,#0000ff",
            speed: "10",
        });

        const seen = new Set<string>();
        const ctx = el.ctx;
        const proto: object = Object.getPrototypeOf(ctx);
        const descriptor = Object.getOwnPropertyDescriptor(proto, "fillStyle")!;
        const spy = vi
            .spyOn(ctx, "fillStyle", "set")
            .mockImplementation((value) => {
                if (typeof value === "string") seen.add(value);
                descriptor.set!.call(ctx, value);
            });

        for (let i = 0; i < 20; i++) frame(el, 1 / 60);
        spy.mockRestore();

        expect(seen).toContain("#ff0000");
        expect(seen).toContain("#0000ff");
        expect(drewSomething(el)).toBe(true);
    });

    it("falls back to its default colors when none are given", async () => {
        const el = await mount<BbFluidMorph>("bb-fluid-morph", {
            colors: "",
        });

        const seen = new Set<string>();
        const ctx = el.ctx;
        const proto: object = Object.getPrototypeOf(ctx);
        const descriptor = Object.getOwnPropertyDescriptor(proto, "fillStyle")!;
        const spy = vi
            .spyOn(ctx, "fillStyle", "set")
            .mockImplementation((value) => {
                if (typeof value === "string") seen.add(value);
                descriptor.set!.call(ctx, value);
            });
        frame(el);
        spy.mockRestore();

        expect(seen).toContain("#0d9488");
    });

    it("does not throw at zero height", async () => {
        const el = await mount<BbFluidMorph>(
            "bb-fluid-morph",
            {},
            {
                width: 300,
                height: 0,
            },
        );
        expect(() => frame(el)).not.toThrow();
    });

    it("plays at its speed", async () => {
        const atDouble = data(await morph({ speed: "2" }, 60));
        const atNormal = data(await morph({ speed: "1" }, 120));
        expect(maxDiff(atDouble, atNormal)).toBeLessThanOrEqual(3);
        expect(
            maxDiff(data(await morph({ speed: "10" }, 60)), atNormal),
        ).toBeGreaterThan(2);
    });

    it.each(["0", "abc", "Infinity"])(
        "stands still at speed %s",
        async (speed) => {
            const el = await morph({ speed }, 1);
            const before = data(el);
            for (let i = 0; i < 30; i++) frame(el);
            expect(data(el)).toEqual(before);
        },
    );

    it("runs the cycle back to where it started at a negative speed", async () => {
        const el = await morph({}, 1);
        const before = data(el);
        for (let i = 0; i < 30; i++) frame(el);
        expect(maxDiff(data(el), before)).toBeGreaterThan(2);

        el.speed = -1;
        for (let i = 0; i < 30; i++) frame(el);
        expect(data(el)).toEqual(before);
    });

    it("varies and staggers its shapes", async () => {
        const base = data(await morph({}, 60));
        expect(
            maxDiff(base, data(await morph({ variation: "2" }, 60))),
        ).toBeGreaterThan(2);
        expect(
            maxDiff(base, data(await morph({ stagger: "3" }, 60))),
        ).toBeGreaterThan(2);
    });

    it("treats unreadable variation and stagger as none", async () => {
        const none = data(await morph({ variation: "0", stagger: "0" }, 20));
        expect(
            maxDiff(
                none,
                data(await morph({ variation: "abc", stagger: "abc" }, 20)),
            ),
        ).toBe(0);
    });

    it("holds every shape until its stagger has passed", async () => {
        const still = data(await morph({ speed: "0" }, 1));
        expect(data(await morph({ stagger: "3" }, 1))).toEqual(still);
    });

    it("treats a negative variation as none", async () => {
        expect(data(await morph({ variation: "-2" }, 20))).toEqual(
            data(await morph({ variation: "0" }, 20)),
        );
    });
});
