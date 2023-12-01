import BB from './BeautifulBackground';
import Particle from './Particle';
import { getRandomFloat, interpolateLinear } from '../utils/number';
import { randomColor } from '../utils/color';

export class bbStarTrail extends BB {
    private starSizeMin: number;
    private starSizeMax: number;

    private starSpeedMin: number;
    private starSpeedMax: number;

    private starColorHueStart: number;
    private starColorHueEnd: number;

    private starRadiusMin: number;
    private starRadiusMax: number;

    private starLifespanMin: number;
    private starLifespanMax: number;

    private numStars: number;

    private trailOpacity: number;

    private stars: Particle[];

    private animationFrameId: number | null;

    static observedAttributes = [
        'data-star-size-min',
        'data-star-size-max',
        'data-star-speed-min',
        'data-star-speed-max',
        'data-star-color-hue-start',
        'data-star-color-hue-end',
        'data-star-radius-min',
        'data-star-radius-max',
        'data-star-lifespan-min',
        'data-star-lifespan-max',
        'data-num-stars'
    ];

    constructor() {
        super();

        this.starSizeMin = 0.1;
        this.starSizeMax = 1.5;

        this.starSpeedMin = 0.025;
        this.starSpeedMax = 0.05;

        this.starColorHueStart = 30;
        this.starColorHueEnd = 75;

        this.starRadiusMin = 1;
        this.starRadiusMax = 100;

        this.starLifespanMin = 1000;
        this.starLifespanMax = 10000;

        this.numStars = 1000;
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
        this.stars = [];
        this.starRadiusMax = Math.max(this.width, this.height) / 2;
        this.trailOpacity = 0.1;
        this.animationFrameId = null;

        for (let i = 0; i < this.numStars; i++) {
            this.stars.push(this.createStar());
        }
    }

    protected startAnimation(): void {
        const animate = (): void => {
            this.ctx.fillStyle = `rgba(0, 0, 0, ${this.trailOpacity})`;
            this.ctx.fillRect(0, 0, this.width, this.height);

            this.stars = this.stars.filter((star) => !star.isDead());

            while (this.stars.length < this.numStars) {
                this.stars.push(this.createStar());
            }

            this.stars.forEach((star) => {
                star.update(this.width / 2, this.height / 2);
                star.draw(this.ctx);
            });

            this.animationFrameId = requestAnimationFrame(animate);
        };

        this.animationFrameId = requestAnimationFrame(animate);
    }

    protected createStar(): Particle {
        const size = getRandomFloat(this.starSizeMin, this.starSizeMax);
        const speed = getRandomFloat(
            interpolateLinear(this.starSpeedMin, -1, 1, -0.04, 0.04),
            interpolateLinear(this.starSpeedMax, -1, 1, -0.04, 0.04)
        );
        const lifespan = getRandomFloat(this.starLifespanMin, this.starLifespanMax);
        const color = randomColor([this.starColorHueStart, this.starColorHueEnd]);
        const angle = getRandomFloat(0, Math.PI * 2);

        const radiusRange = this.starRadiusMax - this.starRadiusMin;
        const radius = Math.sqrt(Math.random()) * radiusRange + this.starRadiusMin;

        return new Particle(size, speed, color, radius, angle, lifespan);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        this.triggerInterpolation(name, oldValue, newValue);
    }
}

if (!window.customElements.get('bb-star-trail')) {
    window.customElements.define('bb-star-trail', bbStarTrail);
}
