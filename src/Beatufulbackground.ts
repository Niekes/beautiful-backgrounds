import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import { has } from "./utils/object";

export default abstract class BeautifulBackground extends LitElement {
    protected width: number = 0;
    protected height: number = 0;
    protected canvas!: HTMLCanvasElement;
    protected ctx!: CanvasRenderingContext2D;

    @property({ type: String, attribute: "data-background-color" })
    backgroundColor: string = "0, 0, 0";

    @property({ type: Number, attribute: "data-trail-opacity" })
    trailOpacity: number = 0.1;

    @property({ type: Number, attribute: "data-width" })
    dataWidth?: number;

    @property({ type: Number, attribute: "data-height" })
    dataHeight?: number;

    protected lastTime: number = 0;
    protected fps: number = 30;
    protected timer: number = 0;
    protected animationFrameId: number | null = null;

    private resizeDebounceTimer: number | null = null;
    private interpolationDuration: number = 1000;
    private interpolationStep: number = 100;
    private fullyInitialized: boolean = false;

    static styles = css`
        :host {
            display: flex;
        }

        canvas {
            width: 100%;
            height: 100%;
        }
    `;

    render() {
        return html`<canvas></canvas>`;
    }

    firstUpdated() {
        this.canvas = this.shadowRoot!.querySelector("canvas")!;
        this.ctx = this.canvas.getContext("2d")!;
        this.initialize();
        this.resizeCanvas();

        // Set up resize observer instead of manual event listeners
        const resizeObserver = new ResizeObserver(() => {
            this.debouncedResizeCanvas();
        });
        resizeObserver.observe(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        if (this.resizeDebounceTimer) {
            clearTimeout(this.resizeDebounceTimer);
        }
    }

    updated(changedProperties: Map<string, any>) {
        super.updated(changedProperties);

        // Handle property changes with interpolation
        changedProperties.forEach((oldValue, propName) => {
            if (this.fullyInitialized && typeof oldValue !== "undefined") {
                this.handlePropertyChange(
                    propName,
                    oldValue,
                    this[propName as keyof this]
                );
            }
        });
    }

    protected abstract initialize(): void;

    protected handlePropertyChange(
        propName: string,
        oldValue: any,
        newValue: any
    ) {
        // Convert property name to attribute name for compatibility
        const attrName = this.getAttributeName(propName);

        if (typeof oldValue === "number" && typeof newValue === "number") {
            this.triggerInterpolation(
                attrName,
                oldValue.toString(),
                newValue.toString()
            );
        } else {
            // For non-numeric properties, just update directly
            this[propName as keyof this] = newValue;
        }
    }

    protected getAttributeName(propName: string): string {
        // Convert camelCase property names back to kebab-case attribute names
        return (
            "data-" +
            propName.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
        );
    }

    protected debouncedResizeCanvas(): void {
        if (this.resizeDebounceTimer) {
            clearTimeout(this.resizeDebounceTimer);
        }
        this.resizeDebounceTimer = setTimeout(() => {
            this.resizeCanvas();
        }, 100); // Reduced debounce time for better responsiveness
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
        let timeoutID: number | null = null;

        const interpolateStep = () => {
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
        };

        interpolateStep();
    }

    protected triggerInterpolation(
        name: string,
        oldValue: string,
        newValue: string
    ) {
        const old = Number(oldValue);
        const target = Number(newValue);
        const prop = this.getPropNameCamelCased(name);

        if (old !== target && this.fullyInitialized) {
            if (has(this, prop)) {
                this.interpolateWithThrottle(
                    oldValue ? old : (this[prop as keyof this] as number),
                    target,
                    this.interpolationDuration,
                    this.interpolationStep,
                    (i: number) => {
                        (this as any)[prop] = i;
                        this.requestUpdate(); // Trigger re-render if needed
                    }
                );
            }
        } else {
            (this as any)[prop] = target;
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
            (this as any)[propName] = newValue;
        }

        if (!ignoredProps.includes(name)) {
            this.triggerInterpolation(name, oldValue, newValue);
        }
    }

    protected getPropNameCamelCased(dashCased: string): string {
        return dashCased
            .substring(5) // Remove 'data-' prefix
            .replace(/-(.)/g, (_: string, char: string) => char.toUpperCase());
    }

    protected resizeCanvas(): void {
        const newWidth = this.dataWidth || this.clientWidth;
        const newHeight = this.dataHeight || this.clientHeight;

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
