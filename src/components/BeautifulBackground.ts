import { has } from '../utils/object';

export default abstract class BeautifulBackground extends HTMLElement {
    protected shadowR: ShadowRoot;
    protected width: number;
    protected height: number;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected backgroundColor: string;
    protected trailOpacity: number;

    protected lastTime: number;
    protected fps: number;
    protected timer: number;
    protected animationFrameId: number | null;

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

        this.lastTime = 0;
        this.fps = 30;
        this.timer = 0;
        this.resizeDebounceTimer = null;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
        this.backgroundColor = '0, 0, 0';
    }

    protected abstract connectedCallback(): void;
    protected abstract disconnectedCallback(): void;
    protected abstract initialize(): void;

    protected debouncedResizeCanvas(): void {
        clearTimeout(this.resizeDebounceTimer);
        this.resizeDebounceTimer = setTimeout(() => {
            this.resizeCanvas();
        }, 1000);
    }

    protected startAnimation(fn: Function): void {
        const animate = (timeStamp: number): void => {
            const deltaTime: number = timeStamp - this.lastTime;
            this.lastTime = timeStamp;

            if (this.timer > 1000 / this.fps) {
                fn();

                this.timer = 0;
            } else {
                this.timer += deltaTime;
            }

            this.animationFrameId = requestAnimationFrame(animate);
        };

        this.animationFrameId = requestAnimationFrame(animate);
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

    protected setValues(
        ignoredProps: string[],
        name: string,
        oldValue: string,
        newValue: string
    ): void {
        if (ignoredProps.includes(name)) {
            const propName = this.getPropNameCamelCased(name);
            this[propName] = newValue;
        }

        if (!ignoredProps.includes(name)) {
            this.triggerInterpolation(name, oldValue, newValue);
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
            this.height = newHeight;

            this.canvas.width = newWidth;
            this.canvas.height = newHeight;
            this.canvas.style.backgroundColor = `rgb(${this.backgroundColor})`;
        }

        this.fullyInitialized = true;
    }
}
