export function getRandomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function interpolate(
    value: number,
    domainStart: number,
    domainEnd: number,
    rangeStart: number,
    rangeEnd: number
): number {
    // Ensure the value is within the domain
    if (value < domainStart) value = domainStart;
    if (value > domainEnd) value = domainEnd;

    // Normalize the value within the domain
    const normalized = (value - domainStart) / (domainEnd - domainStart);

    // Scale the normalized value to the range and return it
    return normalized * (rangeEnd - rangeStart) + rangeStart;
}
