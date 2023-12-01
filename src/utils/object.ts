export function has(object: object, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(object, key);
}

export function isObject(object: unknown): boolean {
    return (
        typeof object === 'object' && Object.prototype.toString.call(object) === '[object Object]'
    );
}

export function isEmpty(object: object): boolean {
    return isObject(object) && Object.keys(object).length === 0;
}
