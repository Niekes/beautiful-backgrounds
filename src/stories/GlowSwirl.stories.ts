import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "../components/glowSwirl";

const meta: Meta = {
    title: "Backgrounds/Glow Swirl",
    component: "bb-glow-swirl",
    render: (args) => {
        return html`
            <bb-glow-swirl
                swirl-colors=${args.swirlColors}
                particle-amount=${args.particleAmount}
                particle-size=${args.particleSize}
                spread=${args.spread}
                turns=${args.turns}
                glow=${args.glow}
                speed=${args.speed}
                bg-colors=${args.bgColors}
                bg-angle=${args.bgAngle}
                trail-opacity=${args.trailOpacity}
                style="width: 100%; height: 500px; border-radius: 15px"
            ></bb-glow-swirl>
        `;
    },
    argTypes: {
        swirlColors: { control: "text" },
        particleAmount: {
            control: { type: "range", min: 0, max: 2000, step: 10 },
        },
        particleSize: {
            control: { type: "range", min: 1, max: 20, step: 0.5 },
        },
        spread: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
        turns: { control: { type: "range", min: 0, max: 20, step: 0.5 } },
        glow: { control: { type: "range", min: 0, max: 30, step: 1 } },
        speed: { control: { type: "range", min: 0, max: 5, step: 0.05 } },
        bgColors: { control: "text" },
        bgAngle: { control: { type: "range", min: 0, max: 360, step: 1 } },
        trailOpacity: {
            control: { type: "range", min: 0, max: 1, step: 0.01 },
        },
    },
    args: {
        swirlColors: "#3377ff, #8833ff, #dd33ff, #ff33cc",
        particleAmount: 700,
        particleSize: 5,
        spread: 0.35,
        turns: 8,
        glow: 8,
        speed: 1,
        bgColors: "#0c0a12",
        bgAngle: 90,
        trailOpacity: 1,
    },
};

export default meta;
type Story = StoryObj;

export const Galaxy: Story = {
    args: {
        swirlColors: "#ffffff, #b8c0ff, #ffd6ff",
        particleAmount: 1500,
        particleSize: 2,
        spread: 1,
        turns: 16,
        glow: 4,
        speed: 0.4,
        bgColors: "#02010a, #10002b",
    },
};

export const Vortex: Story = {};

export const Fireflies: Story = {
    args: {
        swirlColors: "#fff3a3, #ffd23f, #9be15d",
        particleAmount: 400,
        particleSize: 4,
        spread: 0.8,
        turns: 4,
        glow: 12,
        speed: 0.5,
        bgColors: "#030a06, #0b1f12",
    },
};

export const Embers: Story = {
    args: {
        swirlColors: "#ffd166, #ff7b00, #d62828",
        particleSize: 4,
        spread: 0.1,
        turns: 6,
        bgColors: "#120402",
    },
};

export const Silk: Story = {
    args: {
        swirlColors: "#a5f3fc, #c4b5fd, #f5d0fe",
        particleAmount: 400,
        particleSize: 2,
        turns: 3,
        glow: 6,
        speed: 0.6,
        trailOpacity: 0.11,
        bgColors: "#0b0b1a",
    },
};

export const Plasma: Story = {
    args: {
        swirlColors: "#00f5d4, #00bbf9, #9b5de5, #f15bb5",
        particleAmount: 1200,
        particleSize: 6,
        spread: 0.35,
        turns: 12,
        glow: 14,
        speed: 1.5,
    },
};

export const Aurora: Story = {
    args: {
        swirlColors: "#22e39b, #19c2c2, #8a5cff",
        particleAmount: 900,
        spread: 0.5,
        turns: 2,
        glow: 16,
        speed: 0.7,
        trailOpacity: 0.15,
        bgColors: "#000, #04201c",
        bgAngle: 0,
    },
};

export const Ink: Story = {
    args: {
        swirlColors: "#1d3557, #457b9d",
        particleAmount: 900,
        particleSize: 3,
        glow: 0,
        trailOpacity: 0.05,
        bgColors: "#f1faee",
    },
};

export const Neon: Story = {
    args: {
        swirlColors: "#39ff14, #00e5ff",
        particleSize: 2,
        spread: 0.05,
        turns: 10,
        glow: 10,
        speed: 2,
        bgColors: "#000",
    },
};

export const Rose: Story = {
    args: {
        swirlColors: "#ffccd5, #ff4d6d, #c9184a",
        particleAmount: 500,
        particleSize: 8,
        spread: 0.25,
        turns: 5,
        glow: 20,
        speed: 0.8,
        bgColors: "#14000a",
    },
};
