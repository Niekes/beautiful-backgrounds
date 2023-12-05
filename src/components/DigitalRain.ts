import BB from './BeautifulBackground';
import { randomColor } from '../utils/color';
import Symbol from './Symbol';
import { getRandomInt } from '../utils/number';

export class BbDigitalRain extends BB {
    public fontSize: number;
    public fontColorHueStart: number;
    public fontColorHueEnd: number;
    public fontColorSaturationStart: number;
    public fontColorSaturationEnd: number;
    public fontColorLightnessStart: number;
    public fontColorLightnessEnd: number;
    public columns: number;
    public randomness: number;
    public characters: string;
    public symbols: Symbol[];

    static observedAttributes = [
        'data-fps',
        'data-characters',
        'data-randomness',
        'data-font-size',
        'data-font-color-hue-start',
        'data-font-color-hue-end',
        'data-font-color-saturation-start',
        'data-font-color-saturation-end',
        'data-font-color-lightness-start',
        'data-font-color-lightness-end',
        'data-background-color'
    ];

    protected ignoredProps: string[] = ['data-characters', 'data-background-color'];

    constructor() {
        super();

        this.fontSize = 24;
        this.fontColorHueStart = 60;
        this.fontColorHueEnd = this.fontColorHueStart + 90;
        this.fontColorSaturationStart = 90;
        this.fontColorSaturationEnd = 100;
        this.fontColorLightnessStart = 50;
        this.fontColorLightnessEnd = 50;
        this.randomness = 0.975;
        this.trailOpacity = 0.1;
        this.characters = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ13579ｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝZ:."¦=*+-<>|ﾘçδ╘';
    }

    protected connectedCallback(): void {
        this.shadowR.appendChild(this.canvas);
        this.resizeCanvas();
        this.initialize();
        this.startAnimation(this.animation.bind(this));

        window.addEventListener('resize', this.debouncedResizeCanvas.bind(this));
    }

    protected disconnectedCallback(): void {
        window.removeEventListener('resize', this.debouncedResizeCanvas.bind(this));
        if (this.animationFrameId !== null) {
            window.cancelAnimationFrame(this.animationFrameId);
        }
    }

    protected initialize(): void {
        this.symbols = [];
        this.columns = Math.floor(this.width / this.fontSize);

        for (let i = 0; i < this.columns; i++) {
            this.symbols[i] = this.createSymbol(i);
        }
    }

    protected animation(): void {
        this.ctx.fillStyle = `rgba(${this.backgroundColor}, ${this.trailOpacity})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.textAlign = 'center';
        this.ctx.font = `${this.fontSize}px monospace`;

        this.symbols.forEach((symbol) => {
            symbol.draw(
                this.ctx,
                this.characters.charAt(Math.floor(Math.random() * this.characters.length))
            );
            symbol.update(this.height, this.randomness);
        });
    }

    protected createSymbol(index: number): Symbol {
        return new Symbol(
            index,
            getRandomInt(0, -this.height / this.fontSize),
            this.fontSize,
            randomColor(
                [this.fontColorHueStart, this.fontColorHueEnd],
                [this.fontColorSaturationStart, this.fontColorSaturationEnd],
                [this.fontColorLightnessStart, this.fontColorLightnessEnd]
            )
        );
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        this.setValues(this.ignoredProps, name, oldValue, newValue);
    }
}

if (!window.customElements.get('bb-digital-rain')) {
    window.customElements.define('bb-digital-rain', BbDigitalRain);
}
