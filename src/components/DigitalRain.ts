import BB from './BeautifulBackground';

export class BbDigitalRain extends BB {
    public backgroundColor: string;

    public fontSize: number;
    public fontColor: string;
    public columns: number;
    public speed: number;
    public randomness: number;

    public characters: string;
    public rain: number[];

    private trailOpacity: number;

    private animationFrameId: number | null;

    static observedAttributes = [
        'data-characters',
        'data-speed',
        'data-randomness',
        'data-font-size',
        'data-font-color-hue-start',
        'data-font-color-hue-end',
        'data-background-color'
    ];

    protected ignoredProps: string[] = ['data-characters', 'data-background-color'];

    constructor() {
        super();

        this.backgroundColor = '0, 0, 0';
        this.fontSize = 24;
        this.fontColor = '#0F0';
        this.speed = 2;
        this.randomness = 0.9;
        this.trailOpacity = 0.1;
        this.characters = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ13579ｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝZ:・."¦=*+-<>|ﾘç';
    }

    protected connectedCallback(): void {
        this.shadowR.appendChild(this.canvas);
        this.resizeCanvas();
        this.initialize();
        this.startAnimation();

        window.addEventListener('resize', this.debouncedResizeCanvas.bind(this));
    }

    protected disconnectedCallback(): void {
        window.removeEventListener('resize', this.debouncedResizeCanvas.bind(this));
        if (this.animationFrameId !== null) {
            window.cancelAnimationFrame(this.animationFrameId);
        }
    }

    protected initialize(): void {
        this.columns = Math.floor(this.width / this.fontSize);
        this.rain = Array(this.columns).fill(this.height);
    }

    protected startAnimation(): void {
        const animate = (): void => {
            this.ctx.fillStyle = `rgba(${this.backgroundColor}, ${this.trailOpacity})`;
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.font = `${this.fontSize}px monospace`;

            for (let i = 0; i < this.rain.length; i++) {
                if (this.rain[i] % this.speed === 0) {
                    const text = this.characters.charAt(
                        Math.floor(Math.random() * this.characters.length)
                    );
                    this.ctx.fillStyle = this.fontColor;
                    this.ctx.fillText(
                        text,
                        i * this.fontSize,
                        (this.rain[i] / this.speed) * this.fontSize
                    );

                    if (
                        (this.rain[i] / this.speed) * this.fontSize > this.height &&
                        Math.random() > this.randomness
                    ) {
                        this.rain[i] = 0;
                    }
                }
                this.rain[i]++;
            }

            this.animationFrameId = requestAnimationFrame(animate);
        };

        this.animationFrameId = requestAnimationFrame(animate);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        this.setValues(this.ignoredProps, name, oldValue, newValue);
    }
}

if (!window.customElements.get('bb-digital-rain')) {
    window.customElements.define('bb-digital-rain', BbDigitalRain);
}
