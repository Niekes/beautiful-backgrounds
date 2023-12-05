import BB from './BeautifulBackground';
import Particle from './Particle';
import { getRandomFloat, interpolateLinear } from '../utils/number';
import { randomColor } from '../utils/color';

export class BbStarTrail extends BB {
    public backgroundColor: string;

    public starSizeMin: number;
    public starSizeMax: number;

    public starSpeedMin: number;
    public starSpeedMax: number;

    public starColorHueStart: number;
    public starColorHueEnd: number;
    public starColorSaturationStart: number;
    public starColorSaturationEnd: number;
    public starColorLightnessStart: number;
    public starColorLightnessEnd: number;

    public starRadiusMin: number;
    public starRadiusMax: number;

    public starLifespanMin: number;
    public starLifespanMax: number;

    public numStars: number;

    private stars: Particle[];

    static observedAttributes = [
        'data-fps',
        'data-background-color',
        'data-star-size-min',
        'data-star-size-max',
        'data-star-speed-min',
        'data-star-speed-max',
        'data-star-color-hue-start',
        'data-star-color-hue-end',
        'data-star-color-saturation-start',
        'data-star-color-saturation-end',
        'data-star-color-lightness-start',
        'data-star-color-lightness-end',
        'data-star-radius-min',
        'data-star-radius-max',
        'data-star-lifespan-min',
        'data-star-lifespan-max',
        'data-num-stars'
    ];

    private ignoredProps: string[] = ['data-characters', 'data-background-color'];

    constructor() {
        super();

        this.backgroundColor = '0, 0, 0';

        this.starSizeMin = 0.5;
        this.starSizeMax = 1.5;

        this.starSpeedMin = 0.025;
        this.starSpeedMax = 0.05;

        this.starColorHueStart = 30;
        this.starColorHueEnd = 75;
        this.starColorSaturationStart = 100;
        this.starColorSaturationEnd = 100;
        this.starColorLightnessStart = 50;
        this.starColorLightnessEnd = 50;

        this.starRadiusMin = 1;
        this.starRadiusMax = 100;

        this.starLifespanMin = 1000;
        this.starLifespanMax = 10000;

        this.numStars = 1000;

        this.trailOpacity = 0.1;
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
        this.stars = [];
        this.starRadiusMax = Math.max(this.width, this.height) / 2;
        this.animationFrameId = null;

        for (let i = 0; i < this.numStars; i++) {
            this.stars.push(this.createStar());
        }
    }

    protected animation(): void {
        this.ctx.fillStyle = `rgba(${this.backgroundColor}, ${this.trailOpacity})`;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.stars = this.stars.filter((star) => !star.isDead());

        while (this.stars.length < this.numStars) {
            this.stars.push(this.createStar());
        }

        this.stars.forEach((star) => {
            star.update(this.width / 2, this.height / 2);
            star.draw(this.ctx);
        });
    }

    protected createStar(): Particle {
        const size = getRandomFloat(this.starSizeMin, this.starSizeMax);
        const speed = getRandomFloat(
            interpolateLinear(this.starSpeedMin, -1, 1, -0.04, 0.04),
            interpolateLinear(this.starSpeedMax, -1, 1, -0.04, 0.04)
        );
        const lifespan = getRandomFloat(this.starLifespanMin, this.starLifespanMax);
        const color = randomColor(
            [this.starColorHueStart, this.starColorHueEnd],
            [this.starColorSaturationStart, this.starColorSaturationEnd],
            [this.starColorLightnessStart, this.starColorLightnessEnd]
        );
        const angle = getRandomFloat(0, Math.PI * 2);

        const radiusRange = this.starRadiusMax - this.starRadiusMin;
        const radius = Math.sqrt(Math.random()) * radiusRange + this.starRadiusMin;

        return new Particle(size, speed, color, radius, angle, lifespan);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        this.setValues(this.ignoredProps, name, oldValue, newValue);
    }
}

if (!window.customElements.get('bb-star-trail')) {
    window.customElements.define('bb-star-trail', BbStarTrail);
}
