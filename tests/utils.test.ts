import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { hsla, randomColor, toHsl, toRgb } from "../src/utils/color";
import { debounce } from "../src/utils/function";
import { stringToArrayConverter } from "../src/utils/lit";
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
