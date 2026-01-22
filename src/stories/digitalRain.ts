import { customElement, property } from "lit/decorators.js";
import { randomColor } from "../utils/color";
import Symbol from "../Symbol";
import { getRandomInt } from "../utils/number";
import { BeautifulBackground } from "../BeautifulBackground";
import { stringToArrayConverter } from "../utils/lit";

@customElement("bb-digital-rain")
export class BbDigitalRain extends BeautifulBackground {
    @property({ type: Number, attribute: "speed" })
    speed: number = 10; // rows per second

    @property({ type: String, attribute: "characters" })
    characters: string = "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ";

    @property({ type: Number, attribute: "randomness" })
    randomness: number = 0.975;

    @property({ type: Number, attribute: "font-size" })
    fontSize: number = 24;

    @property({ type: Number, attribute: "font-color-hue-start" })
    fontColorHueStart: number = 60;

    @property({ type: Number, attribute: "font-color-hue-end" })
    fontColorHueEnd: number = 150;

    @property({ type: Number, attribute: "font-color-saturation-start" })
    fontColorSaturationStart: number = 90;

    @property({ type: Number, attribute: "font-color-saturation-end" })
    fontColorSaturationEnd: number = 100;

    @property({ type: Number, attribute: "font-color-lightness-start" })
    fontColorLightnessStart: number = 50;

    @property({ type: Number, attribute: "font-color-lightness-end" })
    fontColorLightnessEnd: number = 50;

    @property({
        type: Array,
        attribute: "font-colors",
        converter: stringToArrayConverter,
    })
    fontColors: string[] = [];

    // Properties inherited from BB class
    public columns: number = 0;
    public symbols: Symbol[] = [];

    constructor() {
        super();
        this.fontColorHueEnd = this.fontColorHueStart + 90;
    }

    protected initialize(): void {
        this.symbols = [];
        this.createSymbols();

        // Initialize background to prevent white flash
        this.ctx.fillStyle = `rgba(${this.backgroundColor})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
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

    protected loop(deltaTime: number): void {
        this.updateSymbols();
        this.ctx.fillStyle = `rgba(${this.backgroundColor}, ${this.trailOpacity})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.textAlign = "center";
        this.ctx.font = `${this.fontSize}px monospace`;

        this.symbols.forEach((symbol) => {
            symbol.draw(
                this.ctx,
                this.characters.charAt(
                    Math.floor(Math.random() * this.characters.length),
                ),
                this.fontColors && this.fontColors.length > 0
                    ? this.fontColors[
                          Math.floor(Math.random() * this.fontColors.length)
                      ]
                    : randomColor(
                          [this.fontColorHueStart, this.fontColorHueEnd],
                          [
                              this.fontColorSaturationStart,
                              this.fontColorSaturationEnd,
                          ],
                          [
                              this.fontColorLightnessStart,
                              this.fontColorLightnessEnd,
                          ],
                      ),
                this.fontSize,
                this.speed * 3,
            );

            symbol.update(
                this.height,
                this.randomness,
                this.fontSize,
                deltaTime,
                this.speed * 3,
            );
        });
    }

    protected createSymbol(index: number): Symbol {
        return new Symbol(index, getRandomInt(0, -this.height / this.fontSize));
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-digital-rain": BbDigitalRain;
    }
}
