export function debounce(
    func: Function,
    wait: number,
): (...args: any[]) => void {
    let timeout: any;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
