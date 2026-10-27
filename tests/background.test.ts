import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { BbHexagonWave } from "../index";
import { mount, nextFrame, unmountAll } from "./mount";

const TAG = "bb-hexagon-wave";

/** The color of the canvas pixel at (x, y), in CSS pixels. */
function pixel(el: BbHexagonWave, x: number, y: number): number[] {
    const dpr = el.canvas.width / el.width;
    return Array.from(el.ctx.getImageData(x * dpr, y * dpr, 1, 1).data).slice(
        0,
        3,
    );
}

/** Paints only the background, without the hexagons on top. */
function paintBackground(el: BbHexagonWave): void {
    el.ctx.globalAlpha = 1;
    (el as unknown as { drawBackground(ctx: unknown): void }).drawBackground(
        el.ctx,
    );
}

afterEach(() => {
    unmountAll();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe("BeautifulBackground", () => {
    it("renders a canvas sized to the element, for the pixel ratio", async () => {
        const el = await mount<BbHexagonWave>(TAG);

        expect(el.shadowRoot!.querySelector("canvas")).toBe(el.canvas);
        expect([el.width, el.height]).toEqual([300, 200]);
        expect(el.canvas.width).toBe(Math.floor(300 * devicePixelRatio));
        expect(el.canvas.style.width).toBe("300px");
        expect(el.canvas.style.borderRadius).toBe("inherit");
    });

    it("assumes a pixel ratio of 1 when the browser reports none", async () => {
        vi.stubGlobal("devicePixelRatio", 0);
        const el = await mount<BbHexagonWave>(TAG);

        expect(el.canvas.width).toBe(300);
    });

    it("follows the element's size after a window resize", async () => {
        vi.useFakeTimers();
        const el = await mount<BbHexagonWave>(TAG);

        // Same size: nothing to do.
        window.dispatchEvent(new Event("resize"));
        vi.advanceTimersByTime(100);
        expect(el.width).toBe(300);

        el.style.width = "120px";
        window.dispatchEvent(new Event("resize"));
        vi.advanceTimersByTime(100);
        expect(el.width).toBe(120);
        vi.useRealTimers();
    });

    it("animates every frame, and pauses while the page is hidden", async () => {
        const el = await mount<BbHexagonWave>(TAG);
        const loop = vi.spyOn(el as unknown as { loop(): void }, "loop");
        await nextFrame();
        await nextFrame();
        expect(loop).toHaveBeenCalled();

        const visibility = vi.spyOn(document, "visibilityState", "get");
        visibility.mockReturnValue("hidden");
        document.dispatchEvent(new Event("visibilitychange"));
        expect(el.animationFrameId).toBeNull();

        visibility.mockReturnValue("visible");
        document.dispatchEvent(new Event("visibilitychange"));
        const running = el.animationFrameId;
        expect(running).not.toBeNull();

        // A second "visible" keeps the running animation.
        document.dispatchEvent(new Event("visibilitychange"));
        expect(el.animationFrameId).toBe(running);
    });

    it("never runs a frame backwards in time", async () => {
        const el = await mount<BbHexagonWave>(TAG);
        const loop = vi.spyOn(
            el as unknown as { loop(deltaTime: number): void },
            "loop",
        );
        const visibility = vi.spyOn(document, "visibilityState", "get");
        visibility.mockReturnValue("hidden");
        document.dispatchEvent(new Event("visibilitychange"));

        // The animation restarts later than the next frame's timestamp.
        vi.spyOn(performance, "now").mockReturnValue(1e12);
        visibility.mockReturnValue("visible");
        document.dispatchEvent(new Event("visibilitychange"));
        await nextFrame();

        expect(loop).toHaveBeenCalledWith(0);
    });

    it("stops animating and listening once removed", async () => {
        const el = await mount<BbHexagonWave>(TAG);
        const resize = vi.spyOn(
            el as unknown as { resizeCanvas(): void },
            "resizeCanvas",
        );
        el.remove();
        expect(el.animationFrameId).toBeNull();

        window.dispatchEvent(new Event("resize"));
        await new Promise((resolve) => setTimeout(resolve, 150));
        expect(resize).not.toHaveBeenCalled();

        // Removing a stopped background is fine too.
        document.body.append(el);
        vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
        document.dispatchEvent(new Event("visibilitychange"));
        el.remove();
        expect(el.animationFrameId).toBeNull();
    });

    describe("background gradient", () => {
        it("runs from the first color to the last at bg-angle", async () => {
            const el = await mount<BbHexagonWave>(TAG, {
                "bg-colors": "#ff0000, #0000ff",
                "bg-angle": "90",
            });
            paintBackground(el);

            expect(pixel(el, 150, 1)[0]).toBeGreaterThan(240);
            expect(pixel(el, 150, 199)[2]).toBeGreaterThan(240);
        });

        it("fills a single color evenly", async () => {
            const el = await mount<BbHexagonWave>(TAG, {
                "bg-colors": "#00ff00",
            });
            paintBackground(el);

            expect(pixel(el, 1, 1)).toEqual([0, 255, 0]);
            expect(pixel(el, 299, 199)).toEqual([0, 255, 0]);
        });

        it.each(["", "#00ff00, nope"])(
            "falls back to black for %j",
            async (colors) => {
                const el = await mount<BbHexagonWave>(TAG, {
                    "bg-colors": colors,
                });
                paintBackground(el);

                expect(pixel(el, 150, 100)).toEqual([0, 0, 0]);
            },
        );
    });
});
