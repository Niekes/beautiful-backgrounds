import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { BeautifulBackground, BbFluidMorph } from "../index";
import { frame, mount, unmountAll } from "./mount";

/** Whether anything but the background was drawn into the canvas. */
function drewSomething(el: { ctx: CanvasRenderingContext2D }): boolean {
    const { width, height } = el.ctx.canvas;
    const data = el.ctx.getImageData(0, 0, width, height).data;
    return data.some((value, i) => i % 4 !== 3 && value > 0);
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
            duration: "0.1",
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
});
