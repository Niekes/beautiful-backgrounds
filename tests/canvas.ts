import { vi } from "vite-plus/test";

/** A 2D context stand-in that records the calls the tests care about. */
export function recordingContext(): CanvasRenderingContext2D & {
    calls: [string, ...unknown[]][];
} {
    const calls: [string, ...unknown[]][] = [];
    const record =
        (name: string) =>
        (...args: unknown[]): void => {
            calls.push([name, ...args]);
        };

    return {
        calls,
        globalAlpha: 1,
        beginPath: vi.fn(),
        stroke: vi.fn(),
        moveTo: record("moveTo"),
        lineTo: record("lineTo"),
        fillText: record("fillText"),
    } as unknown as CanvasRenderingContext2D & {
        calls: [string, ...unknown[]][];
    };
}
