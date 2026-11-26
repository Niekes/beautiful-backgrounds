import { customElement, property } from "lit/decorators.js";

import { TextBackground } from "../TextBackground";
import Symbol from "../Symbol";
import { getRandomInt } from "../utils/number";

@customElement("bb-digital-rain")
export class BbDigitalRain extends TextBackground {
    @property({ type: Number, attribute: "speed" })
    speed: number = 10; // rows per second

    @property({ type: String, attribute: "characters" })
    characters: string = "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ";

    @property({ type: Number, attribute: "randomness" })
    randomness: number = 0.975;

    @property({ type: Number, attribute: "font-size" })
    fontSize: number = 24;

    // Properties inherited from BB class
    public columns: number = 0;
    public symbols: Symbol[] = [];

    protected initialize(): void {
        this.symbols = [];
        this.createSymbols();

        // Initialize background to prevent white flash
        this.drawBackground(this.ctx);
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
        this.fadeTrail();

        this.ctx.textAlign = "center";
        this.ctx.font = `${this.fontSize}px monospace`;

        const speed = this.speed * 3;
        this.symbols.forEach((symbol) => {
            symbol.draw(
                this.ctx,
                this.randomCharacter(),
                this.symbolColor(),
                this.fontSize,
                speed,
            );
            symbol.update(
                this.height,
                this.randomness,
                this.fontSize,
                deltaTime,
                speed,
            );
        });
    }

    private randomCharacter(): string {
        return this.characters.charAt(
            Math.floor(Math.random() * this.characters.length),
        );
    }

    private symbolColor(): string {
        return this.randomFontColor();
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
