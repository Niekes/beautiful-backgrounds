import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { randomColor } from "../utils/color";
import Symbol from "../Symbol";
import { getRandomInt } from "../utils/number";

@customElement("bb-digital-rain")
export class BbDigitalRain extends LitElement {
    @property({ type: Number, attribute: "data-fps" })
    fps: number = 60;

    @property({ type: String, attribute: "data-characters" })
    characters: string =
        'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ13579ｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝZ:."¦=*+-<>|ﾘçδ╘';

    @property({ type: Number, attribute: "data-randomness" })
    randomness: number = 0.975;

    @property({ type: Number, attribute: "data-font-size" })
    fontSize: number = 24;

    @property({ type: Number, attribute: "data-font-color-hue-start" })
    fontColorHueStart: number = 60;

    @property({ type: Number, attribute: "data-font-color-hue-end" })
    fontColorHueEnd: number = 150;

    @property({ type: Number, attribute: "data-font-color-saturation-start" })
    fontColorSaturationStart: number = 90;

    @property({ type: Number, attribute: "data-font-color-saturation-end" })
    fontColorSaturationEnd: number = 100;

    @property({ type: Number, attribute: "data-font-color-lightness-start" })
    fontColorLightnessStart: number = 50;

    @property({ type: Number, attribute: "data-font-color-lightness-end" })
    fontColorLightnessEnd: number = 50;

    @property({ type: String, attribute: "data-background-color" })
    backgroundColor: string = "0, 0, 0";

    // Properties inherited from BB class
    public columns: number = 0;
    public symbols: Symbol[] = [];
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public width: number = 0;
    public height: number = 0;
    public animationFrameId: number | null = null;
    public trailOpacity: number = 0.1;

    constructor() {
        super();

        // Initialize canvas
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d")!;

        // Set initial font color hue end
        this.fontColorHueEnd = this.fontColorHueStart + 90;
    }

    protected firstUpdated(): void {
        // Create shadow DOM and append canvas
        if (!this.shadowRoot) {
            this.attachShadow({ mode: "open" });
        }
        this.shadowRoot!.appendChild(this.canvas);

        this.resizeCanvas();
        this.initialize();
        this.startAnimation();

        window.addEventListener(
            "resize",
            this.debouncedResizeCanvas.bind(this)
        );
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener(
            "resize",
            this.debouncedResizeCanvas.bind(this)
        );
        if (this.animationFrameId !== null) {
            window.cancelAnimationFrame(this.animationFrameId);
        }
    }

    private resizeCanvas(): void {
        const rect = this.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    private debouncedResizeCanvas = this.debounce(
        this.resizeCanvas.bind(this),
        100
    );

    private debounce(func: Function, wait: number): (...args: any[]) => void {
        let timeout: any;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    protected initialize(): void {
        this.symbols = [];
        this.createSymbols();
    }

    private createSymbols(): void {
        this.columns = Math.floor(this.width / this.fontSize);

        for (let i = 0; i < this.columns; i++) {
            this.symbols[i] = this.createSymbol(i);
        }
    }

    private updateSymbols(): void {
        const currentColumns = Math.floor(this.width / this.fontSize);

        for (let i = this.symbols.length; i < currentColumns; i++) {
            this.symbols[i] = this.createSymbol(i);
        }

        if (this.symbols.length > currentColumns) {
            this.symbols.length = currentColumns;
        }
    }

    private startAnimation(): void {
        let lastFrameTime = 0;

        const animate = (currentTime: number) => {
            const targetFrameTime = 1000 / this.fps;
            if (currentTime - lastFrameTime >= targetFrameTime) {
                this.animation();
                lastFrameTime = currentTime;
            }
            this.animationFrameId = requestAnimationFrame(animate);
        };

        this.animationFrameId = requestAnimationFrame(animate);
    }

    protected animation(): void {
        this.updateSymbols();
        this.ctx.fillStyle = `rgba(${this.backgroundColor}, ${this.trailOpacity})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.textAlign = "center";
        this.ctx.font = `${this.fontSize}px monospace`;

        this.symbols.forEach((symbol) => {
            symbol.draw(
                this.ctx,
                this.characters.charAt(
                    Math.floor(Math.random() * this.characters.length)
                ),
                randomColor(
                    [this.fontColorHueStart, this.fontColorHueEnd],
                    [
                        this.fontColorSaturationStart,
                        this.fontColorSaturationEnd,
                    ],
                    [this.fontColorLightnessStart, this.fontColorLightnessEnd]
                ),
                this.fontSize
            );
            symbol.update(this.height, this.randomness, this.fontSize);
        });
    }

    protected createSymbol(index: number): Symbol {
        return new Symbol(index, getRandomInt(0, -this.height / this.fontSize));
    }

    // Override render to return empty template since we're using canvas
    render() {
        return;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-digital-rain": BbDigitalRain;
    }
}
