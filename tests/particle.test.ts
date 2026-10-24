import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import Particle, { type ParticleOptions } from "../src/Particle";
import { recordingContext } from "./canvas";

const base: ParticleOptions = {
    size: 2,
    speed: 0,
    color: "red",
    angle: 0,
    lifespan: 1000,
    gridSides: 4,
    gridSize: 10,
    gridAngle: 0,
};

/** The segment the particle draws: from its last position to the current. */
function segment(particle: Particle): number[] {
    const ctx = recordingContext();
    particle.draw(ctx);
    return ctx.calls.flatMap(([, ...xy]) => xy as number[]);
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe("Particle", () => {
    it("draws a round line of twice its size in its color", () => {
        const ctx = recordingContext();
        new Particle({ ...base, x: 3, y: 4 }).draw(ctx);

        expect(ctx.lineCap).toBe("round");
        expect(ctx.lineWidth).toBe(4);
        expect(ctx.strokeStyle).toBe("red");
        expect(ctx.globalAlpha).toBe(1);
        expect(ctx.calls).toEqual([
            ["moveTo", 3, 4],
            ["lineTo", 3, 4],
        ]);
    });

    it("starts at the origin by default", () => {
        expect(segment(new Particle(base))).toEqual([0, 0, 0, 0]);
    });

    it("fades in, stays and fades out over its lifespan", () => {
        const now = vi.spyOn(Date, "now").mockReturnValue(0);
        const particle = new Particle(base);
        const opacity = (age: number): number => {
            now.mockReturnValue(age);
            let alpha = 0;
            const ctx = recordingContext();
            Object.defineProperty(ctx, "globalAlpha", {
                set: (value: number) => {
                    alpha ||= value;
                },
            });
            particle.draw(ctx);
            return alpha;
        };

        expect(opacity(125)).toBe(0.5);
        expect(opacity(400)).toBe(1);
        expect(opacity(750)).toBe(0.5);
    });

    it("dies once its lifespan is over", () => {
        const now = vi.spyOn(Date, "now").mockReturnValue(0);
        const particle = new Particle(base);

        now.mockReturnValue(1000);
        expect(particle.isDead()).toBe(false);
        now.mockReturnValue(1001);
        expect(particle.isDead()).toBe(true);
    });

    describe("circularMove", () => {
        it("orbits the center, drifting outwards by its force", () => {
            const particle = new Particle({
                ...base,
                speed: Math.PI / 2,
                radius: 10,
                force: 2,
            });

            particle.circularMove(100, 100, 1);
            const [x, y] = segment(particle).slice(2);
            expect(x).toBeCloseTo(100);
            expect(y).toBeCloseTo(112);

            particle.circularMove(100, 100, 1);
            const [px, py, x2, y2] = segment(particle);
            expect([px, py]).toEqual([x, y]);
            expect(x2).toBeCloseTo(86);
            expect(y2).toBeCloseTo(100);
        });

        it("starts on a unit radius and drifts by 1 by default", () => {
            const particle = new Particle(base);
            particle.circularMove(0, 0, 1);
            expect(segment(particle)).toEqual([2, 0, 2, 0]);
        });
    });

    describe("railMove", () => {
        it.each([
            [4, { x: 14, y: 26 }, [10, 30]],
            [6, { x: 4, y: 9 }, [5, 8.660254]],
            [3, { x: 4, y: 9 }, [5, 8.660254]],
            [5, { x: 4, y: 9 }, [4, 9]],
        ])(
            "snaps a %s-sided grid particle onto a node",
            (gridSides, start, node) => {
                const particle = new Particle({ ...base, gridSides, ...start });
                particle.railMove(0, 0, 0);

                const [px, py, x, y] = segment(particle);
                expect(px).toBeCloseTo(node[0]);
                expect(py).toBeCloseTo(node[1]);
                expect([x, y]).toEqual([px, py]);
            },
        );

        it("snaps in the grid's rotated frame around the center", () => {
            const particle = new Particle({
                ...base,
                gridAngle: Math.PI / 2,
                x: 103,
                y: 116,
            });
            particle.railMove(100, 100, 0);

            const [x, y] = segment(particle);
            expect(x).toBeCloseTo(100);
            expect(y).toBeCloseTo(120);
        });

        it("runs along a rail and turns at the next node", () => {
            // Random 0 picks the first direction, along the x axis.
            vi.spyOn(Math, "random").mockReturnValue(0);
            const particle = new Particle({ ...base, speed: -1 });
            particle.railMove(0, 0, 0);

            // 20px per second on a 10px grid: half a rail in 0.25s.
            particle.railMove(0, 0, 0.25);
            expect(segment(particle).slice(2)).toEqual([5, 0]);

            particle.railMove(0, 0, 0.5);
            expect(segment(particle).slice(2)).toEqual([15, 0]);
        });
    });
});
