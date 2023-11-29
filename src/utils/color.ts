import { getRandomInt } from './number';

export function randomColor(
    hRange: number[] = [0, 360],
    sRange: number[] = [0, 100],
    lRange: number[] = [40, 60]
): string {
    const h: number = getRandomInt(hRange[0], hRange[1]);
    const s: number = getRandomInt(sRange[0], sRange[1]);
    const l: number = getRandomInt(lRange[0], lRange[1]);

    return `hsl(${h}, ${s}%, ${l}%)`;
}
