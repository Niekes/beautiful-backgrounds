import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "../components/contourFlow";

const meta: Meta = {
    title: "Backgrounds/Contour Flow",
    component: "bb-contour-flow",
    render: (args) => {
        return html`
            <bb-contour-flow
                particle-count=${args.particleCount}
                particle-life=${args.particleLife}
                flow-speed=${args.flowSpeed}
                terrain-size=${args.terrainSize}
                line-colors=${args.lineColors}
                line-opacity=${args.lineOpacity}
                pulse-strength=${args.pulseStrength}
                pulse-speed=${args.pulseSpeed}
                bg-colors=${args.bgColors}
                bg-angle=${args.bgAngle}
                trail-opacity=${args.trailOpacity}
                style="width: 100%; height: 500px; border-radius: 15px"
            ></bb-contour-flow>
        `;
    },
    argTypes: {
        particleCount: {
            control: { type: "range", min: 100, max: 20000, step: 100 },
        },
        particleLife: {
            control: { type: "range", min: 0.5, max: 60, step: 0.5 },
        },
        flowSpeed: { control: { type: "range", min: 0, max: 600, step: 1 } },
        terrainSize: {
            control: { type: "range", min: 200, max: 10000, step: 1 },
        },
        lineColors: { control: "text" },
        lineOpacity: {
            control: { type: "range", min: 0.005, max: 1, step: 0.005 },
        },
        pulseStrength: {
            control: { type: "range", min: 0, max: 1, step: 0.05 },
        },
        pulseSpeed: {
            control: { type: "range", min: 0, max: 2, step: 0.01 },
        },
        bgColors: { control: "text" },
        bgAngle: { control: { type: "range", min: 0, max: 360, step: 1 } },
        trailOpacity: {
            control: { type: "range", min: 0, max: 0.2, step: 0.001 },
        },
    },
    args: {
        particleCount: 4500,
        particleLife: 6,
        flowSpeed: 132,
        terrainSize: 3333,
        lineColors: "#89964e",
        lineOpacity: 0.08,
        pulseStrength: 0.5,
        pulseSpeed: 0.1,
        bgColors: "#002222",
        bgAngle: 0,
        trailOpacity: 0.005,
    },
};

export default meta;
type Story = StoryObj;

export const TopographicMoss: Story = {};

export const Spectrum: Story = {
    args: {
        lineColors: "#7b2ff7, #4cc9f0, #3ddc97, #ffb703, #ff4d6d",
        lineOpacity: 0.06,
        bgColors: "#070b14",
    },
};

export const DesertDunes: Story = {
    args: {
        terrainSize: 6000,
        lineColors: "#e0b872, #c98a4b",
        bgColors: "#2b1a0e, #1a0f08",
        bgAngle: 90,
    },
};

export const ArcticSurvey: Story = {
    args: {
        particleCount: 6000,
        lineColors: "#bfe6ff",
        lineOpacity: 0.04,
        bgColors: "#06141f, #0b2233",
        bgAngle: 90,
    },
};

export const NeonContours: Story = {
    args: {
        lineColors: "#ff00ff, #00ffff",
        lineOpacity: 0.06,
        bgColors: "#05050f",
    },
};

export const Blueprint: Story = {
    args: {
        terrainSize: 2000,
        lineColors: "#ffffff",
        lineOpacity: 0.03,
        bgColors: "#0a2a5c",
    },
};

export const EmberRidge: Story = {
    args: {
        particleCount: 8000,
        flowSpeed: 200,
        lineColors: "#ff6a00, #ffd000",
        lineOpacity: 0.04,
        bgColors: "#120500, #200a00",
        bgAngle: 45,
    },
};

export const PulseWaves: Story = {
    args: {
        lineColors: "#1b3a6b, #7fffd4",
        lineOpacity: 0.08,
        pulseStrength: 1,
        pulseSpeed: 0.2,
        bgColors: "#001a1a",
    },
};
