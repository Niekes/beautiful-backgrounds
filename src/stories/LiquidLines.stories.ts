import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { color } from "d3";
import { html } from "lit";
import "../components/liquidLines";

const meta: Meta = {
    title: "Backgrounds/Liquid Lines",
    component: "bb-liquid-lines",
    render: (args) => {
        const c = color(args.backgroundColor as string)?.rgb();
        const bgColor = c ? `${c.r}, ${c.g}, ${c.b}` : "0, 0, 0";

        return html`
            <bb-liquid-lines
                background-color=${bgColor}
                line-count=${args.lineCount}
                line-amplitude=${args.lineAmplitude}
                line-frequency=${args.lineFrequency}
                speed=${args.speed}
                line-spacing=${args.lineSpacing}
                line-width=${args.lineWidth}
                line-hue-start=${args.lineHueStart}
                line-hue-end=${args.lineHueEnd}
                line-saturation=${args.lineSaturation}
                line-offset-step=${args.lineOffsetStep}
                line-colors=${args.lineColors}
                wiggle-amplitude=${args.wiggleAmplitude}
                wiggle-speed=${args.wiggleSpeed}
                trail-opacity=${args.trailOpacity}
                style="width: 100%; height: 500px; display: flex;"
            ></bb-liquid-lines>
        `;
    },
    argTypes: {
        backgroundColor: { control: "color" },
        lineCount: { control: { type: "range", min: 1, max: 100, step: 1 } },
        lineAmplitude: {
            control: { type: "range", min: 0, max: 200, step: 1 },
        },
        lineFrequency: {
            control: { type: "range", min: 0.0001, max: 0.05, step: 0.0001 },
        },
        speed: { control: { type: "range", min: -5, max: 5, step: 0.01 } },
        lineSpacing: { control: { type: "range", min: 1, max: 200, step: 1 } },
        lineWidth: { control: { type: "range", min: 0.1, max: 20, step: 0.1 } },
        lineHueStart: { control: { type: "range", min: 0, max: 360, step: 1 } },
        lineHueEnd: { control: { type: "range", min: 0, max: 360, step: 1 } },
        lineSaturation: {
            control: { type: "range", min: 0, max: 100, step: 1 },
        },
        lineOffsetStep: {
            control: { type: "range", min: -2, max: 2, step: 0.01 },
        },
        lineColors: { control: "text" },
        wiggleAmplitude: {
            control: { type: "range", min: 0, max: 100, step: 1 },
        },
        wiggleSpeed: { control: { type: "range", min: 0, max: 5, step: 0.1 } },
        trailOpacity: {
            control: { type: "range", min: 0, max: 1, step: 0.05 },
        },
    },
    args: {
        backgroundColor: "#000000",
        lineCount: 20,
        lineAmplitude: 30,
        lineFrequency: 0.005,
        speed: 0.5,
        lineSpacing: 40,
        lineWidth: 2,
        lineHueStart: 200,
        lineHueEnd: 280,
        lineSaturation: 80,
        lineOffsetStep: 0.2,
        lineColors: "",
        wiggleAmplitude: 20,
        wiggleSpeed: 0.3,
        trailOpacity: 0.1,
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    args: {
        lineCount: 16,
        lineAmplitude: 48,
        speed: 2.05,
    },
};

export const DeepSea: Story = {
    args: {
        lineCount: 40,
        lineAmplitude: 60,
        lineFrequency: 0.003,
        speed: 0.2,
        lineSpacing: 25,
        lineHueStart: 180,
        lineHueEnd: 220,
        backgroundColor: "#000814",
        wiggleAmplitude: 1,
        wiggleSpeed: 5,
    },
};

export const SunsetGlow: Story = {
    args: {
        lineCount: 15,
        lineAmplitude: 40,
        lineFrequency: 0.008,
        speed: 0.8,
        lineSpacing: 50,
        lineHueStart: 10,
        lineHueEnd: 50,
        backgroundColor: "#1a0f00",
        wiggleSpeed: 0.7,
    },
};

export const NeonPulse: Story = {
    args: {
        lineCount: 30,
        lineAmplitude: 100,
        lineFrequency: 0.012,
        speed: 1.2,
        lineSpacing: 30,
        lineHueStart: 280,
        lineHueEnd: 320,
        lineWidth: 1,
        backgroundColor: "#050010",
        trailOpacity: 0.05,
        wiggleAmplitude: 2,
        wiggleSpeed: 3,
    },
};

export const Minimalist: Story = {
    args: {
        lineCount: 8,
        lineAmplitude: 20,
        lineFrequency: 0.002,
        speed: 0.1,
        lineSpacing: 100,
        lineHueStart: 0,
        lineHueEnd: 0,
        lineSaturation: 0,
        lineWidth: 0.5,
        backgroundColor: "#ffffff",
    },
};

export const AuroraBorealis: Story = {
    args: {
        lineCount: 25,
        lineAmplitude: 120,
        lineFrequency: 0.004,
        speed: 0.3,
        lineSpacing: 35,
        lineHueStart: 120,
        lineHueEnd: 180,
        lineSaturation: 90,
        lineWidth: 3,
        backgroundColor: "#000510",
        trailOpacity: 0.08,
        wiggleAmplitude: 40,
        wiggleSpeed: 3.1,
    },
};

export const MoltenMagma: Story = {
    args: {
        lineCount: 12,
        lineAmplitude: 50,
        lineFrequency: 0.006,
        speed: 0.15,
        lineSpacing: 60,
        lineHueStart: 0,
        lineHueEnd: 30,
        lineSaturation: 100,
        lineWidth: 12,
        backgroundColor: "#100000",
        wiggleAmplitude: 10,
        wiggleSpeed: 0.1,
    },
};

export const DigitalMist: Story = {
    args: {
        lineCount: 60,
        lineAmplitude: 15,
        lineFrequency: 0.02,
        speed: 0.8,
        lineSpacing: 15,
        lineHueStart: 200,
        lineHueEnd: 240,
        lineWidth: 0.5,
        backgroundColor: "#0a0a0a",
        trailOpacity: 0.2,
    },
};

export const Bioluminescence: Story = {
    args: {
        lineCount: 54,
        lineAmplitude: 80,
        lineFrequency: 0.004,
        speed: 0.88,
        lineSpacing: 16,
        lineHueStart: 164,
        lineHueEnd: 245,
        lineWidth: 3.2,
        backgroundColor: "#000a0a",
        trailOpacity: 0.03,
        lineOffsetStep: 0.04,
        wiggleAmplitude: 3,
        wiggleSpeed: 1.6,
    },
};

export const GoldenHour: Story = {
    args: {
        lineCount: 10,
        lineAmplitude: 30,
        lineFrequency: 0.003,
        speed: 0.2,
        lineSpacing: 80,
        lineHueStart: 40,
        lineHueEnd: 60,
        lineSaturation: 70,
        lineWidth: 5,
        backgroundColor: "#1a1500",
    },
};

export const Rainbow: Story = {
    args: {
        lineCount: 30,
        lineAmplitude: 40,
        lineFrequency: 0.005,
        speed: 0.5,
        lineSpacing: 30,
        lineColors:
            "#ff0000, #ffa500, #ffff00, #008000, #0000ff, #4b0082, #ee82ee",
        wiggleAmplitude: 10,
        wiggleSpeed: 0.5,
    },
};

export const PinkShutters: Story = {
    args: {
        backgroundColor: "#ffffff",
        lineCount: 61,
        lineAmplitude: 48,
        lineFrequency: 0.0007,
        speed: -1,
        lineSpacing: 23,
        lineWidth: 0.9,
        lineHueStart: 276,
        lineHueEnd: 360,
        lineSaturation: 80,
        lineOffsetStep: 0.2,
        wiggleAmplitude: 5,
        wiggleSpeed: 0.7,
        trailOpacity: 0.15,
    },
};
