import { property } from "lit/decorators.js";
import { stringToArrayConverter } from "./utils/lit";
import { randomColor } from "./utils/color";
import { BeautifulBackground } from "./BeautifulBackground";

/**
 * A background whose glyphs are colored from a font color range, shared by
 * the Digital Rain and Digital Glitch backgrounds.
 */
export abstract class TextBackground extends BeautifulBackground {
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

    constructor() {
        super();
        this.fontColorHueEnd = this.fontColorHueStart + 90;
    }

    protected randomFontColor(): string {
        if (this.fontColors.length > 0) {
            return this.fontColors[
                Math.floor(Math.random() * this.fontColors.length)
            ];
        }
        return randomColor(
            [this.fontColorHueStart, this.fontColorHueEnd],
            [this.fontColorSaturationStart, this.fontColorSaturationEnd],
            [this.fontColorLightnessStart, this.fontColorLightnessEnd],
        );
    }
}
