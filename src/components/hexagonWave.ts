import { hsl } from "d3";
import { type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BeautifulBackground } from "../BeautifulBackground";
import { stringToArrayConverter } from "../utils/lit";

type HexCell = {
    x: number;
    y: number;
    phase: number;
    colorIndex?: number;
};

@customElement("bb-hexagon-wave")
export class BbHexagonWave extends BeautifulBackground {
    @property({ type: Number, attribute: "hex-size" })
    hexSize: number = 50;

    @property({ type: Number, attribute: "wave-amplitude" })
    waveAmplitude: number = 5.5;

    @property({ type: Number, attribute: "wave-speed" })
    waveSpeed: number = 1.0;

    @property({ type: Number, attribute: "wave-x-factor" })
    waveXFactor: number = -0.005;

    @property({ type: Number, attribute: "wave-y-factor" })
    waveYFactor: number = -0.005;

    @property({ type: Number, attribute: "shade-amplitude" })
    shadeAmplitude: number = 0.5;

    @property({ type: Number, attribute: "shade-lightness-boost" })
    shadeLightnessBoost: number = 15;

    @property({ type: Number, attribute: "base-lightness" })
    baseLightness: number = 10;

    @property({ type: Number, attribute: "lightness-range" })
    lightnessRange: number = 25;

    @property({ type: Number, attribute: "hex-hue-start" })
    hexHueStart: number = 310;

    @property({ type: Number, attribute: "hex-hue-end" })
    hexHueEnd: number = 200;

    @property({ type: Number, attribute: "hex-saturation" })
    hexSaturation: number = 100;

    @property({ type: Number, attribute: "hex-scale" })
    hexScale: number = 1.0;

    @property({
        type: Array,
        attribute: "hex-colors",
        converter: stringToArrayConverter,
    })
    hexColors: string[] = [];

    private grid: HexCell[] = [];
    private time: number = 0;

    protected updated(changedProperties: PropertyValues): void {
        super.updated(changedProperties);
        if (changedProperties.has("hexSize")) {
            this.initialize();
        }
    }

    protected initialize(): void {
        this.grid = [];
        this.time = 0;

        const size = this.hexSize;
        const hexW = Math.sqrt(3) * size;
        const xSpacing = hexW;
        const ySpacing = size * 1.5;

        const cols = Math.ceil(this.width / xSpacing) + 2;
        const rows = Math.ceil(this.height / ySpacing) + 2;

        for (let r = -1; r < rows; r++) {
            for (let q = -1; q < cols; q++) {
                const xOffset = r % 2 !== 0 ? xSpacing / 2 : 0;
                this.grid.push({
                    x: q * xSpacing + xOffset,
                    y: r * ySpacing,
                    phase: Math.random() * Math.PI * 2,
                    colorIndex: Math.floor(Math.random() * 1000),
                });
            }
        }
    }

    protected loop(deltaTime: number): void {
        this.time += deltaTime;

        this.ctx.fillStyle = `rgba(${this.backgroundColor}, ${this.trailOpacity})`;
        this.ctx.fillRect(0, 0, this.width, this.height);

        for (const cell of this.grid) {
            const waveX = cell.x * this.waveXFactor;
            const waveY = cell.y * this.waveYFactor;
            const wavePhase = Math.sin(
                this.time * this.waveSpeed + waveX + waveY,
            );

            const offsetY = wavePhase * this.waveAmplitude;

            const lightCoord = cell.x + cell.y;
            const shade =
                Math.sin(this.time + lightCoord) * this.shadeAmplitude;

            const lightness =
                this.baseLightness + wavePhase * this.lightnessRange + shade;

            let fill: string;

            if (this.hexColors && this.hexColors.length > 0) {
                const colorStr =
                    this.hexColors[
                        (cell.colorIndex || 0) % this.hexColors.length
                    ];
                const c = hsl(colorStr);
                fill = `hsl(${c.h}, ${c.s * 100}%, ${lightness}%)`;
            } else {
                const totalPath = this.width + this.height;
                const posFactor = (cell.x + cell.y) / totalPath;
                const currentHue =
                    this.hexHueStart +
                    (this.hexHueEnd - this.hexHueStart) * posFactor;
                fill = `hsl(${currentHue}, ${this.hexSaturation}%, ${lightness}%)`;
            }

            this.drawHex(
                cell.x,
                cell.y + offsetY,
                this.hexSize * this.hexScale,
                fill,
            );
        }
    }

    private drawHex(x: number, y: number, size: number, fill: string): void {
        const ctx = this.ctx;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = ((Math.PI * 2) / 6) * i - Math.PI / 2;
            const px = x + Math.cos(angle) * size;
            const py = y + Math.sin(angle) * size;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();

        ctx.fillStyle = fill;
        ctx.fill();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-hexagon-wave": BbHexagonWave;
    }
}
