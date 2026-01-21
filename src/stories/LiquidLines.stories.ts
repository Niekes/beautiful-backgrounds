import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { color } from "d3";
import { html } from "lit";
import "./liquidLines";

const meta: Meta = {
    title: "Backgrounds/LiquidLines",
    component: "bb-liquid-lines",
    render: (args) => {
        const c = color(args.backgroundColor as string)?.rgb();
        const bgColor = c ? `${c.r}, ${c.g}, ${c.b}` : "0, 0, 0";

        return html`
            <bb-liquid-lines
                background-color=${bgColor}
                line-count=${args.lineCount}
                amplitude=${args.amplitude}
                frequency=${args.frequency}
                speed=${args.speed}
                line-spacing=${args.lineSpacing}
                line-width=${args.lineWidth}
                hue-start=${args.hueStart}
                hue-end=${args.hueEnd}
                saturation=${args.saturation}
                offset-step=${args.offsetStep}
                trail-opacity=${args.trailOpacity}
                style="width: 100%; height: 500px; display: flex;"
            ></bb-liquid-lines>
        `;
    },
    argTypes: {
        backgroundColor: { control: "color" },
        lineCount: { control: { type: "range", min: 1, max: 100, step: 1 } },
        amplitude: { control: { type: "range", min: 0, max: 200, step: 1 } },
        frequency: {
            control: { type: "range", min: 0.0001, max: 0.05, step: 0.0001 },
        },
        speed: { control: { type: "range", min: 0.01, max: 5, step: 0.01 } },
        lineSpacing: { control: { type: "range", min: 1, max: 200, step: 1 } },
        lineWidth: { control: { type: "range", min: 0.1, max: 20, step: 0.1 } },
        hueStart: { control: { type: "range", min: 0, max: 360, step: 1 } },
        hueEnd: { control: { type: "range", min: 0, max: 360, step: 1 } },
        saturation: { control: { type: "range", min: 0, max: 100, step: 1 } },
        offsetStep: { control: { type: "range", min: -2, max: 2, step: 0.01 } },
        trailOpacity: {
            control: { type: "range", min: 0, max: 1, step: 0.05 },
        },
    },
    args: {
        backgroundColor: "#000000",
        lineCount: 20,
        amplitude: 30,
        frequency: 0.005,
        speed: 0.5,
        lineSpacing: 40,
        lineWidth: 2,
        hueStart: 200,
        hueEnd: 280,
        saturation: 80,
        offsetStep: 0.2,
        trailOpacity: 0.1,
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const DeepSea: Story = {
    args: {
        lineCount: 40,
        amplitude: 60,
        frequency: 0.003,
        speed: 0.2,
        lineSpacing: 25,
        hueStart: 180,
        hueEnd: 220,
        backgroundColor: "#000814",
    },
};

export const SunsetGlow: Story = {
    args: {
        lineCount: 15,
        amplitude: 40,
        frequency: 0.008,
        speed: 0.8,
        lineSpacing: 50,
        hueStart: 10,
        hueEnd: 50,
        backgroundColor: "#1a0f00",
    },
};

export const NeonPulse: Story = {
    args: {
        lineCount: 30,
        amplitude: 100,
        frequency: 0.012,
        speed: 1.2,
        lineSpacing: 30,
        hueStart: 280,
        hueEnd: 320,
        lineWidth: 1,
        backgroundColor: "#050010",
        trailOpacity: 0.05,
    },
};

export const Minimalist: Story = {
    args: {
        lineCount: 8,
        amplitude: 20,
        frequency: 0.002,
        speed: 0.1,
        lineSpacing: 100,
        hueStart: 0,
        hueEnd: 0,
        saturation: 0,
        lineWidth: 0.5,
        backgroundColor: "#ffffff",
    },
};

export const AuroraBorealis: Story = {
    args: {
        lineCount: 25,
        amplitude: 120,
        frequency: 0.004,
        speed: 0.3,
        lineSpacing: 35,
        hueStart: 120,
        hueEnd: 180,
        saturation: 90,
        lineWidth: 3,
        backgroundColor: "#000510",
        trailOpacity: 0.08,
    },
};

export const MoltenMagma: Story = {
    args: {
        lineCount: 12,
        amplitude: 50,
        frequency: 0.006,
        speed: 0.15,
        lineSpacing: 60,
        hueStart: 0,
        hueEnd: 30,
        saturation: 100,
        lineWidth: 12,
        backgroundColor: "#100000",
    },
};

export const DigitalMist: Story = {
    args: {
        lineCount: 60,
        amplitude: 15,
        frequency: 0.02,
        speed: 0.8,
        lineSpacing: 15,
        hueStart: 200,
        hueEnd: 240,
        lineWidth: 0.5,
        backgroundColor: "#0a0a0a",
        trailOpacity: 0.2,
    },
};

export const Bioluminescence: Story = {
    args: {
        lineCount: 35,
        amplitude: 80,
        frequency: 0.01,
        speed: 1.5,
        lineSpacing: 20,
        hueStart: 160,
        hueEnd: 200,
        lineWidth: 1,
        backgroundColor: "#000a0a",
        trailOpacity: 0.03,
    },
};

export const GoldenHour: Story = {
    args: {
        lineCount: 10,
        amplitude: 30,
        frequency: 0.003,
        speed: 0.2,
        lineSpacing: 80,
        hueStart: 40,
        hueEnd: 60,
        saturation: 70,
        lineWidth: 5,
        backgroundColor: "#1a1500",
    },
};
