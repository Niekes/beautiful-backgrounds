import { has } from '../utils/object';

export default abstract class BeautifulBackground extends HTMLElement {
    protected shadowR: ShadowRoot;
    protected width: number;
    protected height: number;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;

    private resizeDebounceTimer: number | null;
    private interpolationDuration: number = 1000;
    private interpolationStep: number = 100;
    private fullyInitialized: boolean = false;

    constructor() {
        super();

        this.shadowR = this.attachShadow({ mode: 'open' });

        this.shadowR.innerHTML = `
            <style>
                :host {
                    display: flex;
                }
            </style>
        `;

        this.resizeDebounceTimer = null;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
    }

    protected abstract connectedCallback(): void;
    protected abstract disconnectedCallback(): void;
    protected abstract initialize(): void;

    protected debouncedResizeCanvas(): void {
        clearTimeout(this.resizeDebounceTimer);
        this.resizeDebounceTimer = setTimeout(() => {
            this.resizeCanvas();
        }, 1000); // Adjust the debounce time as needed
    }

    protected interpolateWithThrottle(
        startValue: number,
        newValue: number,
        durationMs: number,
        throttleMs: number,
        onInterpolate: Function
    ) {
        const numSteps = Math.ceil(durationMs / throttleMs);
        const stepValue = (newValue - startValue) / numSteps;

        let currentValue = startValue;
        let currentTime = 0;
        let isInterpolating = true;
        let timeoutID = null;

        function interpolateStep() {
            if (currentTime < durationMs && isInterpolating) {
                onInterpolate(currentValue, false);
                currentValue += stepValue;
                currentTime += throttleMs;
                timeoutID = window.setTimeout(interpolateStep, throttleMs);
            } else if (isInterpolating) {
                onInterpolate(newValue, true);
                isInterpolating = false;

                if (timeoutID) {
                    window.clearTimeout(timeoutID);
                }
            }
        }

        interpolateStep();
    }

    protected triggerInterpolation(name: string, oldValue: string, newValue: string) {
        const old = Number(oldValue);
        const target = Number(newValue);
        const prop = this.getPropNameCamelCased(name);

        if (old !== target && this.fullyInitialized) {
            if (has(this, prop)) {
                this.interpolateWithThrottle(
                    oldValue ? old : this[prop],
                    target,
                    this.interpolationDuration,
                    this.interpolationStep,
                    (i: number) => {
                        this[prop] = i;
                    }
                );
            }
        } else {
            this[prop] = target;
        }
    }

    protected getPropNameCamelCased(dashCased: string): string {
        return dashCased
            .substring(5)
            .replace(/-(.)/g, (_: string, char: string) => char.toUpperCase());
    }

    protected resizeCanvas(): void {
        const newWidth =
            Number.parseInt(this.getAttribute('data-width')) || this.parentElement.clientWidth;

        const newHeight =
            Number.parseInt(this.getAttribute('data-height')) || this.parentElement.clientHeight;

        if (newWidth !== this.width || newHeight !== this.height) {
            this.width = newWidth;
            this.canvas.width = newWidth;
            this.height = newHeight;
            this.canvas.height = newHeight;
        }

        this.fullyInitialized = true;
    }
}
