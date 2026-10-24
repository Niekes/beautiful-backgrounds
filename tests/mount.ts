import type { BeautifulBackground } from "../index";

const mounted: HTMLElement[] = [];

/**
 * Renders a background at a fixed size and waits for its first update, which
 * sizes the canvas and starts the animation.
 */
export async function mount<T extends BeautifulBackground>(
    tag: string,
    attributes: Record<string, string> = {},
    size: { width: number; height: number } = { width: 300, height: 200 },
): Promise<T> {
    const el = document.createElement(tag) as T;
    for (const [name, value] of Object.entries(attributes)) {
        el.setAttribute(name, value);
    }
    el.style.width = `${size.width}px`;
    el.style.height = `${size.height}px`;
    document.body.append(el);
    mounted.push(el);
    await el.updateComplete;
    return el;
}

export function unmountAll(): void {
    mounted.splice(0).forEach((el) => el.remove());
}

/** Runs one frame of the animation by hand. */
export function frame(
    el: BeautifulBackground,
    deltaTime: number = 1 / 60,
): void {
    (el as unknown as { loop(deltaTime: number): void }).loop(deltaTime);
}

/** Waits for the browser to paint the next animation frame. */
export function nextFrame(): Promise<number> {
    return new Promise((resolve) => requestAnimationFrame(resolve));
}
