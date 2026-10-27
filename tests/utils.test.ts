import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { gradient, hsla, randomColor, toHsl, toRgb } from "../src/utils/color";
import { debounce } from "../src/utils/function";
import { stringToArrayConverter } from "../src/utils/lit";
import { strokeLine } from "../src/utils/line";
import { createTerrain } from "../src/utils/terrain";
import { getRandomFloat, getRandomInt } from "../src/utils/number";

afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
});

describe("getRandomFloat", () => {
    it("scales Math.random into the range", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.5);
        expect(getRandomFloat(10, 20)).toBe(15);
    });
});

describe("getRandomInt", () => {
    it("includes both ends of the range", () => {
        vi.spyOn(Math, "random")
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0.999);
        expect(getRandomInt(1, 3)).toBe(1);
        expect(getRandomInt(1, 3)).toBe(3);
    });
});

describe("randomColor", () => {
    it("picks hue, saturation and lightness from their ranges", () => {
        vi.spyOn(Math, "random").mockReturnValue(0);
        expect(randomColor([10, 20], [30, 40], [50, 60])).toBe(
            "hsl(10, 30%, 50%)",
        );
    });

    it("defaults to any hue with a medium lightness", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.999);
        expect(randomColor()).toBe("hsl(360, 100%, 60%)");
    });
});

describe("hsla", () => {
    it("formats a CSS color", () => {
        expect(hsla(1, 2, 3, 0.5)).toBe("hsla(1, 2%, 3%, 0.5)");
    });
});

describe("toRgb", () => {
    it("reads hex, named and functional colors", () => {
        expect(toRgb("#ff8000")).toEqual([255, 128, 0]);
        expect(toRgb("rebeccapurple")).toEqual([102, 51, 153]);
        expect(toRgb("rgb(1 2 3 / 50%)")).toEqual([1, 2, 3]);
    });

    it("turns an invalid color into black", () => {
        expect(toRgb("not a color")).toEqual([0, 0, 0]);
    });
});

describe("gradient", () => {
    it("runs evenly from the first color to the last", () => {
        expect(gradient(["#ff0000", "#0000ff"], 3)).toEqual([
            "rgb(255, 0, 0)",
            "rgb(128, 0, 128)",
            "rgb(0, 0, 255)",
        ]);
    });

    it("passes through every color in between", () => {
        expect(gradient(["#ff0000", "#00ff00", "#0000ff"], 5)).toEqual([
            "rgb(255, 0, 0)",
            "rgb(128, 128, 0)",
            "rgb(0, 255, 0)",
            "rgb(0, 128, 128)",
            "rgb(0, 0, 255)",
        ]);
    });

    it("repeats a single color", () => {
        expect(gradient(["#00ff00"], 2)).toEqual([
            "rgb(0, 255, 0)",
            "rgb(0, 255, 0)",
        ]);
    });
});

describe("toHsl", () => {
    it.each([
        ["red", { h: 0, s: 1, l: 0.5 }],
        ["#ff00ff", { h: 300, s: 1, l: 0.5 }],
        ["lime", { h: 120, s: 1, l: 0.5 }],
        ["blue", { h: 240, s: 1, l: 0.5 }],
        ["gray", { h: 0, s: 0, l: 128 / 255 }],
    ])("converts %s", (color, hsl) => {
        const result = toHsl(color);
        expect(result.h).toBeCloseTo(hsl.h);
        expect(result.s).toBeCloseTo(hsl.s);
        expect(result.l).toBeCloseTo(hsl.l);
    });
});

describe("debounce", () => {
    it("calls once, with the last arguments, after the wait", () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const debounced = debounce(fn, 100);

        debounced(1);
        debounced(2);
        vi.advanceTimersByTime(99);
        expect(fn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalledExactlyOnceWith(2);
    });
});

describe("stringToArrayConverter", () => {
    it("splits and trims a list, dropping empty entries", () => {
        expect(
            stringToArrayConverter.fromAttribute!(" a, b ,,c ", Array),
        ).toEqual(["a", "b", "c"]);
    });

    it("turns a missing or empty attribute into an empty list", () => {
        expect(stringToArrayConverter.fromAttribute!(null, Array)).toEqual([]);
        expect(stringToArrayConverter.fromAttribute!("", Array)).toEqual([]);
    });

    it("joins a list back into an attribute", () => {
        expect(stringToArrayConverter.toAttribute!(["a", "b"], Array)).toBe(
            "a,b",
        );
    });
});

describe("createTerrain", () => {
    it("is a smooth terrain between 0 and 1", () => {
        const terrain = createTerrain();
        for (let i = 0; i < 100; i++) {
            const [x, y] = [i * 0.37 - 10, i * 0.53 - 10];
            const height = terrain(x, y);

            expect(height).toBeGreaterThanOrEqual(0);
            expect(height).toBeLessThan(1);
            expect(Math.abs(terrain(x + 0.001, y) - height)).toBeLessThan(0.01);
        }
    });

    it("is flat when every random height is the same", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.5);
        const terrain = createTerrain();

        expect(terrain(1.3, -7.2)).toBeCloseTo(0.5 * 0.9375);
        expect(terrain(-40.1, 99.9)).toBeCloseTo(0.5 * 0.9375);
    });
});

describe("strokeLine", () => {
    /**
     * The opacity of each pixel row that a line across a canvas of pixel ratio
     * 2 leaves, `width` px wide at y = 10 px.
     */
    function rows(width: number, alpha: number = 1): number[] {
        const canvas = document.createElement("canvas");
        canvas.width = 20;
        canvas.height = 40;
        const ctx = canvas.getContext("2d")!;
        ctx.scale(2, 2);
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(10, 10);
        strokeLine(ctx, width);
        expect(ctx.globalAlpha).toBe(alpha);

        const { data } = ctx.getImageData(10, 0, 1, 40);
        return Array.from(data).filter((_, i) => i % 4 === 3);
    }

    it("strokes a line as wide as it is", () => {
        const opacity = rows(3);
        expect(opacity.slice(17, 23)).toEqual([255, 255, 255, 255, 255, 255]);
        expect([opacity[16], opacity[23]]).toEqual([0, 0]);
    });

    it("strokes a hairline two screen pixels wide, and as much fainter", () => {
        // A quarter of the width, at half the opacity: an eighth of 255.
        const opacity = rows(0.25, 0.5);
        expect(opacity.slice(19, 21)).toEqual([32, 32]);
        expect([opacity[18], opacity[21]]).toEqual([0, 0]);
    });

    it.each([0, -1])("strokes nothing %d px wide", (width) => {
        expect(Math.max(...rows(width))).toBe(0);
    });
});
