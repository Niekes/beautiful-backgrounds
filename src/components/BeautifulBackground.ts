export default abstract class BeautifulBackground extends HTMLElement {
    protected shadowR: ShadowRoot;
    protected width: number;
    protected height: number;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    private resizeDebounceTimer: number | null;

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

    protected resizeCanvas(): void {
        this.setSize();
        this.initialize();
    }

    protected setSize() {
        this.width =
            Number.parseInt(this.getAttribute('data-width')) || this.parentElement.clientWidth;
        this.height =
            Number.parseInt(this.getAttribute('data-height')) || this.parentElement.clientHeight;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    protected parseAttributeToFloat(attr: string, prefix: string = 'data'): number {
        return Number.parseFloat(this.getAttribute(`${prefix}-${attr}`));
    }

    protected parseAttributeToInt(attr: string, prefix: string = 'data'): number {
        return Number.parseInt(this.getAttribute(`${prefix}-${attr}`));
    }
}
