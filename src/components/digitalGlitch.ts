import { customElement, property } from "lit/decorators.js";
import type { PropertyValues } from "lit";

import { getRandomInt } from "../utils/number";
import { TextBackground } from "../TextBackground";
import { drawLucideIcon } from "../utils/lucide";
import type { IconNode } from "../utils/lucide";

type Glyph = { kind: "text"; char: string } | { kind: "icon"; node: IconNode };

interface Cell {
    glyph: Glyph;
    opacity: number;
    color: string;
}

@customElement("bb-digital-glitch")
export class BbDigitalGlitch extends TextBackground {
    @property({ type: String, attribute: "characters" })
    characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    @property({ type: String, attribute: "icons" })
    icons: string = "";

    @property({ type: Number, attribute: "randomness" })
    randomness: number = 0.98;

    @property({ type: Number, attribute: "speed" })
    speed: number = 10;

    @property({ type: Number, attribute: "font-size" })
    fontSize: number = 16;

    public columns: number = 0;
    public rows: number = 0;

    private cells: Cell[][] = [];
    private glyphPool: Glyph[] = [];
    private accumulator: number = 0;
    private lucide:
        | ({ icons?: Record<string, IconNode> } & Record<string, unknown>)
        | null = null;

    protected initialize(): void {
        this.rebuildPool();
        void this.loadLucide();
        this.drawBackground(this.ctx);
    }

    private async loadLucide(): Promise<void> {
        try {
            this.lucide = await import("lucide");
        } catch {
            /* istanbul ignore next */
            this.lucide = null;
        }
        this.rebuildPool();
        this.cells = [];
    }

    private normalizeIconName(name: string): string {
        return name
            .trim()
            .split(/[-_\s]+/)
            .filter((part) => part.length > 0)
            .map(
                (part) =>
                    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
            )
            .join("");
    }

    private resolveIcon(name: string): IconNode | null {
        const key = this.normalizeIconName(name);
        const candidate =
            this.lucide!.icons?.[key] ?? this.lucide![key] ?? null;
        if (!Array.isArray(candidate)) return null;
        return candidate as IconNode;
    }

    private rebuildPool(): void {
        const pool: Glyph[] = [];
        for (const char of this.characters) {
            pool.push({ kind: "text", char });
        }
        if (this.lucide && this.icons.trim().length > 0) {
            for (const name of this.icons.split(/[\s,]+/)) {
                const node = this.resolveIcon(name);
                if (node) pool.push({ kind: "icon", node });
            }
        }
        if (pool.length === 0) {
            pool.push({ kind: "text", char: "0" });
        }
        this.glyphPool = pool;
    }

    protected updated(changedProperties: PropertyValues): void {
        super.updated(changedProperties);
        if (
            changedProperties.has("characters") ||
            changedProperties.has("icons")
        ) {
            this.rebuildPool();
            this.cells = [];
        }
    }

    private randomGlyph(): Glyph {
        const index = getRandomInt(0, this.glyphPool.length - 1);
        return this.glyphPool[index];
    }

    private glyphColor(): string {
        return this.randomFontColor();
    }

    private ensureGrid(): void {
        const cellSize = Math.max(1, this.fontSize);
        const cols = Math.max(1, Math.ceil(this.width / cellSize));
        const rows = Math.max(1, Math.ceil(this.height / cellSize));
        if (
            cols === this.columns &&
            rows === this.rows &&
            this.cells.length === cols
        ) {
            return;
        }
        this.columns = cols;
        this.rows = rows;
        this.cells = Array.from({ length: cols }, () =>
            Array.from({ length: rows }, () => this.createCell()),
        );
    }

    private createCell(): Cell {
        return {
            glyph: this.randomGlyph(),
            opacity: 0.1 + Math.random() * 0.9,
            color: this.glyphColor(),
        };
    }

    private tickCell(cell: Cell): void {
        if (Math.random() > this.randomness) {
            cell.glyph = this.randomGlyph();
            cell.opacity = 0.1 + Math.random() * 0.9;
            cell.color = this.glyphColor();
        } else {
            cell.opacity *= 0.95;
            if (cell.opacity < 0.1) cell.opacity = 0.1;
        }
    }

    protected loop(deltaTime: number): void {
        this.ensureGrid();
        this.runTicks(deltaTime);
        this.renderGrid();
    }

    private runTicks(deltaTime: number): void {
        this.accumulator += deltaTime;
        const interval = 1 / Math.max(0.1, this.speed);
        let ticks = 0;
        while (this.accumulator >= interval && ticks < 5) {
            this.accumulator -= interval;
            ticks += 1;
        }
        if (ticks === 0) return;
        for (let col = 0; col < this.columns; col++) {
            for (let row = 0; row < this.rows; row++) {
                for (let t = 0; t < ticks; t++) {
                    this.tickCell(this.cells[col][row]);
                }
            }
        }
    }

    private renderGrid(): void {
        this.drawBackground(this.ctx);
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        const cellSize = this.fontSize;

        for (let col = 0; col < this.columns; col++) {
            for (let row = 0; row < this.rows; row++) {
                const cell = this.cells[col][row];
                const cx = (col + 0.5) * cellSize;
                const cy = (row + 0.5) * cellSize;
                this.ctx.globalAlpha = cell.opacity;
                if (cell.glyph.kind === "text") {
                    this.ctx.font = `${cellSize}px monospace`;
                    this.ctx.fillStyle = cell.color;
                    this.ctx.fillText(cell.glyph.char, cx, cy);
                } else {
                    drawLucideIcon(
                        this.ctx,
                        cell.glyph.node,
                        cx,
                        cy,
                        cellSize,
                        cell.color,
                    );
                }
            }
        }
        this.ctx.globalAlpha = 1.0;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "bb-digital-glitch": BbDigitalGlitch;
    }
}
