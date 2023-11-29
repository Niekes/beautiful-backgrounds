import BB from './BeautifulBackground';
import Star from './particles/Star';
import { getRandomFloat } from '../utils/number';
import { randomColor } from '../utils/color';

export class BbStarField extends BB {
    private numStars: number;
    private trailOpacity: number;
    private stars: Star[];
    private animationFrameId: number | null;

    constructor() {
        super();
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
        this.numStars = this.parseAttributeToFloat('num-stars') || 100;
        this.trailOpacity = 0.1;
        this.stars = [];
        this.animationFrameId = null;

        for (let i = 0; i < this.numStars; i++) {
            this.stars.push(this.createStar());
        }
    }

    protected startAnimation(): void {
        const animate = (): void => {
            this.ctx.fillStyle = `rgba(0, 0, 0, ${this.trailOpacity})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.stars = this.stars.filter((star) => !star.isDead());

            while (this.stars.length < this.numStars) {
                this.stars.push(this.createStar());
            }

            this.stars.forEach((star) => {
                star.update(this.canvas.width / 2, this.canvas.height / 2);
                star.draw(this.ctx);
            });

            this.animationFrameId = requestAnimationFrame(animate);
        };

        this.animationFrameId = requestAnimationFrame(animate);
    }

    protected createStar(): Star {
        const minOrbitRadius = this.parseAttributeToFloat('orbit-radius-min') || 10;
        const maxOrbitRadius =
            this.parseAttributeToFloat('orbit-radius-max') ||
            Math.max(this.width, this.height) / 2;
        const orbitRange = maxOrbitRadius - minOrbitRadius;

        const size = getRandomFloat(
            this.parseAttributeToInt('star-size-min') || 0.1,
            this.parseAttributeToInt('star-size-max') || 1.5
        );

        const speed = getRandomFloat(
            this.parseAttributeToInt('star-speed-min') || 0.001,
            this.parseAttributeToInt('star-speed-max') || 0.003
        );

        const lifespan = getRandomFloat(
            this.parseAttributeToInt('star-lifespan-min') || 1000,
            this.parseAttributeToInt('star-lifespan-max') || 10000
        );

        const color = randomColor([
            this.parseAttributeToFloat('star-color-hue-start') || 30,
            this.parseAttributeToFloat('star-color-hue-end') || 75
        ]);

        const angle = getRandomFloat(0, Math.PI * 2);
        const orbitRadius = Math.sqrt(Math.random()) * orbitRange + minOrbitRadius;

        return new Star(size, speed, lifespan, color, orbitRadius, angle);
    }
}

if (!window.customElements.get('bb-star-field')) {
    window.customElements.define('bb-star-field', BbStarField);
}
