import { describe, expect, it, vi } from "vite-plus/test";
import Symbol from "../src/Symbol";
import { recordingContext } from "./canvas";

describe("Symbol", () => {
    it("falls by its speed", () => {
        const symbol = new Symbol(2, 0);
        symbol.update(1000, 0.5, 10, 0.5, 30);

        const ctx = recordingContext();
        symbol.draw(ctx, "A", "red", 10, 30);
        expect(ctx.fillStyle).toBe("red");
        expect(ctx.calls).toEqual([["fillText", "A", 20, 150]]);
    });

    it("restarts at the top once below the canvas, at random", () => {
        const symbol = new Symbol(0, 200);
        const ctx = recordingContext();

        vi.spyOn(Math, "random").mockReturnValueOnce(0.1);
        symbol.update(100, 0.5, 1, 1, 30);
        symbol.draw(ctx, "A", "red", 1, 30);

        vi.spyOn(Math, "random").mockReturnValueOnce(0.9);
        symbol.update(100, 0.5, 1, 1, 30);
        symbol.draw(ctx, "A", "red", 1, 30);

        expect(ctx.calls).toEqual([
            ["fillText", "A", 0, 230],
            ["fillText", "A", 0, 0],
        ]);
    });
});
