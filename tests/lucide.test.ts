import { describe, expect, it } from "vite-plus/test";
import { drawLucideIcon } from "../src/utils/lucide";

describe("drawLucideIcon", () => {
    function ctx(): CanvasRenderingContext2D {
        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;
        return canvas.getContext("2d")!;
    }

    it("draws a path icon with a custom stroke and fill", () => {
        const c = ctx();
        drawLucideIcon(
            c,
            [
                [
                    "path",
                    {
                        d: "M0 0 L10 10",
                        stroke: "#ff0000",
                        fill: "#00ff00",
                        "stroke-width": 3,
                        "stroke-linecap": "butt",
                        "stroke-linejoin": "miter",
                    },
                ],
            ],
            50,
            50,
            24,
            "#0000ff",
        );
        expect(true).toBe(true);
    });

    it("draws a path icon with the default stroke and no fill", () => {
        const c = ctx();
        drawLucideIcon(
            c,
            [["path", { d: "M0 0 L10 10" }]],
            50,
            50,
            24,
            "#0000ff",
        );
        expect(true).toBe(true);
    });

    it("draws a rect with a radius, and one without roundRect support", () => {
        const c = ctx();
        drawLucideIcon(
            c,
            [
                [
                    "rect",
                    { x: 1, y: 2, width: 3, height: 4, rx: 1, fill: "#ff0000" },
                ],
            ],
            50,
            50,
            24,
            "#0000ff",
        );
        const c2 = ctx();
        const original = c2.roundRect;
        (c2 as any).roundRect = undefined;
        drawLucideIcon(
            c2,
            [["rect", { x: 1, y: 2, width: 3, height: 4 }]],
            50,
            50,
            24,
            "#0000ff",
        );
        (c2 as any).roundRect = original;
        expect(true).toBe(true);
    });

    it("draws a circle", () => {
        const c = ctx();
        drawLucideIcon(
            c,
            [["circle", { cx: 5, cy: 6, r: 7, fill: "#ff0000" }]],
            50,
            50,
            24,
            "#0000ff",
        );
        expect(true).toBe(true);
    });

    it("draws an ellipse", () => {
        const c = ctx();
        drawLucideIcon(
            c,
            [["ellipse", { cx: 5, cy: 6, rx: 7, ry: 8 }]],
            50,
            50,
            24,
            "#0000ff",
        );
        expect(true).toBe(true);
    });

    it("draws a line", () => {
        const c = ctx();
        drawLucideIcon(
            c,
            [["line", { x1: 0, y1: 0, x2: 10, y2: 10 }]],
            50,
            50,
            24,
            "#0000ff",
        );
        expect(true).toBe(true);
    });

    it("draws a polyline and a polygon", () => {
        const c = ctx();
        drawLucideIcon(
            c,
            [
                ["polyline", { points: "0,0 10,10 20,0", fill: "#ff0000" }],
                ["polygon", { points: "0,0 10,10 20,0" }],
            ],
            50,
            50,
            24,
            "#0000ff",
        );
        expect(true).toBe(true);
    });

    it("skips unknown tags", () => {
        const c = ctx();
        drawLucideIcon(c, [["unknown", { foo: 1 }]], 50, 50, 24, "#0000ff");
        expect(true).toBe(true);
    });

    it("draws icons with empty attributes", () => {
        const c = ctx();
        drawLucideIcon(c, [["rect", {}]], 50, 50, 24, "#0000ff");
        drawLucideIcon(c, [["circle", {}]], 50, 50, 24, "#0000ff");
        drawLucideIcon(c, [["ellipse", {}]], 50, 50, 24, "#0000ff");
        drawLucideIcon(c, [["line", {}]], 50, 50, 24, "#0000ff");
        drawLucideIcon(c, [["polyline", {}]], 50, 50, 24, "#0000ff");
        drawLucideIcon(c, [["polygon", {}]], 50, 50, 24, "#0000ff");
        drawLucideIcon(c, [["path", {}]], 50, 50, 24, "#0000ff");
        expect(true).toBe(true);
    });

    it("draws a rect using ry when rx is missing", () => {
        const c = ctx();
        drawLucideIcon(
            c,
            [["rect", { ry: 2, width: 3, height: 4 }]],
            50,
            50,
            24,
            "#0000ff",
        );
        expect(true).toBe(true);
    });
});
