import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "../components/ambientRibbon";

const meta: Meta = {
    title: "Backgrounds/Ambient Ribbon",
    component: "bb-ambient-ribbon",
    render: (args) => html`
        <bb-ambient-ribbon
            ribbon-count=${args.ribbonCount}
            ribbon-width=${args.ribbonWidth}
            ribbon-rotation=${args.ribbonRotation}
            ribbon-hue-start=${args.ribbonHueStart}
            ribbon-hue-end=${args.ribbonHueEnd}
            ribbon-saturation-start=${args.ribbonSaturationStart}
            ribbon-saturation-end=${args.ribbonSaturationEnd}
            ribbon-lightness-start=${args.ribbonLightnessStart}
            ribbon-lightness-end=${args.ribbonLightnessEnd}
            ribbon-amplitude=${args.ribbonAmplitude}
            ribbon-speed-min=${args.ribbonSpeedMin}
            ribbon-speed-max=${args.ribbonSpeedMax}
            ribbon-line-width=${args.ribbonLineWidth}
            ribbon-line-opacity=${args.ribbonLineOpacity}
            bg-colors=${args.bgColors}
            bg-angle=${args.bgAngle}
            trail-opacity=${args.trailOpacity}
            style="width: 100%; height: 500px; border-radius: 15px"
        ></bb-ambient-ribbon>
    `,
    argTypes: {
        ribbonCount: { control: { type: "range", min: 1, max: 50, step: 1 } },
        ribbonWidth: {
            control: { type: "range", min: 10, max: 500, step: 10 },
        },
        ribbonRotation: {
            control: { type: "range", min: 0, max: 360, step: 1 },
        },
        ribbonHueStart: {
            control: { type: "range", min: 0, max: 360, step: 1 },
        },
        ribbonHueEnd: { control: { type: "range", min: 0, max: 360, step: 1 } },
        ribbonSaturationStart: {
            control: { type: "range", min: 0, max: 100, step: 1 },
        },
        ribbonSaturationEnd: {
            control: { type: "range", min: 0, max: 100, step: 1 },
        },
        ribbonLightnessStart: {
            control: { type: "range", min: 0, max: 100, step: 1 },
        },
        ribbonLightnessEnd: {
            control: { type: "range", min: 0, max: 100, step: 1 },
        },
        ribbonAmplitude: {
            control: { type: "range", min: 0.1, max: 2.0, step: 0.1 },
        },
        ribbonSpeedMin: {
            control: { type: "range", min: -5, max: 5, step: 0.001 },
        },
        ribbonSpeedMax: {
            control: { type: "range", min: -5, max: 5, step: 0.001 },
        },
        ribbonLineWidth: {
            control: { type: "range", min: 0.1, max: 10, step: 0.1 },
        },
        ribbonLineOpacity: {
            control: { type: "range", min: 0.01, max: 1, step: 0.01 },
        },
        bgColors: { control: "text" },
        bgAngle: { control: { type: "range", min: 0, max: 360, step: 1 } },
        trailOpacity: {
            control: { type: "range", min: 0, max: 1, step: 0.05 },
        },
    },
    args: {
        ribbonCount: 5,
        ribbonWidth: 100,
        ribbonRotation: 45,
        ribbonHueStart: 11,
        ribbonHueEnd: 14,
        ribbonSaturationStart: 100,
        ribbonSaturationEnd: 100,
        ribbonLightnessStart: 50,
        ribbonLightnessEnd: 50,
        ribbonAmplitude: 0.5,
        ribbonSpeedMin: 0.004,
        ribbonSpeedMax: 0.008,
        ribbonLineWidth: 2,
        ribbonLineOpacity: 0.2,
        bgColors: "#000, #333",
        bgAngle: 90,
        trailOpacity: 0.1,
    },
};

export default meta;
type Story = StoryObj;

export const SignatureFlow: Story = {
    args: {
        ribbonCount: 20,
        ribbonRotation: 159,
        ribbonHueStart: 330,
        ribbonHueEnd: 360,
        ribbonLineWidth: 0.3,
        ribbonLineOpacity: 0.26,
        bgColors: "#000, #5d0e21",
        bgAngle: 90,
    },
};

export const Colorful: Story = {
    args: {
        ribbonHueStart: 0,
        ribbonHueEnd: 360,
        ribbonCount: 10,
        bgColors: "#000, #681666",
    },
};

export const Monochrome: Story = {
    args: {
        ribbonHueStart: 0,
        ribbonHueEnd: 0,
        ribbonSaturationStart: 0,
        ribbonSaturationEnd: 0,
        ribbonLightnessStart: 70,
        ribbonLightnessEnd: 40,
        ribbonCount: 6,
        bgColors: "#0a0a0a, #1a1a1a",
    },
};

export const EmeraldForest: Story = {
    args: {
        ribbonHueStart: 120,
        ribbonHueEnd: 160,
        ribbonSaturationStart: 60,
        ribbonSaturationEnd: 80,
        ribbonLightnessStart: 40,
        ribbonLightnessEnd: 60,
        ribbonCount: 15,
        bgColors: "#062006, #000",
    },
};

export const GoldenHour: Story = {
    args: {
        ribbonHueStart: 40,
        ribbonHueEnd: 55,
        ribbonSaturationStart: 80,
        ribbonSaturationEnd: 100,
        ribbonLightnessStart: 50,
        ribbonLightnessEnd: 70,
        ribbonCount: 12,
        bgColors: "#2d1b00, #4d3300",
        bgAngle: 180,
        ribbonRotation: 0,
    },
};

export const MidnightAura: Story = {
    args: {
        ribbonHueStart: 240,
        ribbonHueEnd: 280,
        ribbonSaturationStart: 50,
        ribbonSaturationEnd: 70,
        ribbonLightnessStart: 40,
        ribbonLightnessEnd: 50,
        ribbonCount: 40,
        ribbonLineWidth: 0.1,
        ribbonLineOpacity: 0.1,
        bgColors: "#000, #0a001a",
    },
};

export const SoftPastel: Story = {
    args: {
        ribbonHueStart: 180,
        ribbonHueEnd: 260,
        ribbonSaturationStart: 40,
        ribbonSaturationEnd: 60,
        ribbonLightnessStart: 70,
        ribbonLightnessEnd: 85,
        ribbonSpeedMin: 0.002,
        ribbonSpeedMax: 0.004,
        bgColors: "#f5f7fa, #e4ecf5",
    },
};

export const NeonGlow: Story = {
    args: {
        ribbonHueStart: 280,
        ribbonHueEnd: 320,
        ribbonSaturationStart: 100,
        ribbonSaturationEnd: 100,
        ribbonLightnessStart: 60,
        ribbonLightnessEnd: 70,
        ribbonLineWidth: 3,
        ribbonLineOpacity: 0.6,
        ribbonCount: 7,
        bgColors: "#050008, #12001f",
    },
};

export const MinimalLines: Story = {
    args: {
        ribbonCount: 2,
        ribbonLineWidth: 0.2,
        ribbonLineOpacity: 0.15,
        ribbonAmplitude: 0.2,
        bgColors: "#000, #000",
    },
};

export const SunsetFlow: Story = {
    args: {
        ribbonHueStart: 15,
        ribbonHueEnd: 45,
        ribbonSaturationStart: 90,
        ribbonSaturationEnd: 100,
        ribbonLightnessStart: 55,
        ribbonLightnessEnd: 45,
        ribbonSpeedMin: 0.004,
        ribbonSpeedMax: 0.007,
        bgColors: "#2b0a1f, #ff6a00",
        bgAngle: 120,
    },
};

export const ColdWave: Story = {
    args: {
        ribbonHueStart: 190,
        ribbonHueEnd: 220,
        ribbonSaturationStart: 70,
        ribbonSaturationEnd: 80,
        ribbonLightnessStart: 60,
        ribbonLightnessEnd: 50,
        ribbonSpeedMin: 0.003,
        ribbonSpeedMax: 0.006,
        bgColors: "#020617, #0f172a",
        ribbonCount: 2,
    },
};
