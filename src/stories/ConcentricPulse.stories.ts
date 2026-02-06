import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "../components/concentricPulse";

const meta: Meta = {
    title: "Backgrounds/Concentric Pulse",
    component: "bb-concentric-pulse",
    render: (args) => {
        return html`
            <div
                style="position: relative; width: 100%; height: 500px; overflow: hidden; border-radius: 15px"
            >
                <bb-concentric-pulse
                    ring-count=${args.ringCount}
                    pulse-speed=${args.pulseSpeed}
                    ring-amplitude=${args.ringAmplitude}
                    ring-spacing=${args.ringSpacing}
                    ring-colors=${args.ringColors}
                    bg-colors=${args.bgColors}
                    bg-angle=${args.bgAngle}
                    trail-opacity=${args.trailOpacity}
                    style="width: 100%; height: 100%"
                ></bb-concentric-pulse>
                <div
                    style="position: absolute; bottom: 10px; left: 10px; color: #fff; font-family: sans-serif; pointer-events: none; opacity: 0.6; font-size: 12px"
                >
                    Click on the canvas to create ripples
                </div>
            </div>
        `;
    },
    argTypes: {
        ringCount: {
            control: { type: "range", min: 1, max: 100, step: 1 },
            attribute: "ring-count",
        },
        pulseSpeed: {
            control: { type: "range", min: 0, max: 5, step: 0.1 },
            attribute: "pulse-speed",
        },
        ringColors: { control: "text", attribute: "ring-colors" },
        ringAmplitude: {
            control: { type: "range", min: 0, max: 200, step: 1 },
            attribute: "ring-amplitude",
        },
        ringSpacing: {
            control: { type: "range", min: 5, max: 200, step: 1 },
            attribute: "ring-spacing",
        },
        bgColors: { control: "text", attribute: "bg-colors" },
        bgAngle: {
            control: { type: "range", min: 0, max: 360, step: 1 },
            attribute: "bg-angle",
        },
        trailOpacity: {
            control: { type: "range", min: 0.001, max: 1, step: 0.001 },
            attribute: "trail-opacity",
        },
    },
    args: {
        ringCount: 20,
        pulseSpeed: 1.0,
        ringColors: "#78c8ff, #0064ff",
        ringAmplitude: 15,
        ringSpacing: 40,
        bgColors: "#05080f, #05080f",
        bgAngle: 0,
        trailOpacity: 0.25,
    },
};

export default meta;
type Story = StoryObj;

export const SignaturePulse: Story = {
    args: {
        ringCount: 20,
        pulseSpeed: 1.0,
        ringColors: "#78c8ff, #0064ff",
        ringAmplitude: 15,
        ringSpacing: 40,
    },
};

export const DeepSea: Story = {
    args: {
        ringCount: 15,
        pulseSpeed: 0.4,
        ringColors: "#0050ff, #001020",
        ringAmplitude: 10,
        ringSpacing: 60,
        bgColors: "#000510, #001020",
    },
};

export const SolarFlare: Story = {
    args: {
        ringCount: 30,
        pulseSpeed: 2.5,
        ringColors: "#ffb400, #ff3200",
        ringAmplitude: 40,
        ringSpacing: 30,
        bgColors: "#100800, #201000",
    },
};

export const CyberpunkNeon: Story = {
    args: {
        ringCount: 50,
        pulseSpeed: 1.8,
        ringColors: "#ff00ff, #00ffff",
        ringAmplitude: 20,
        ringSpacing: 15,
        trailOpacity: 0.1,
    },
};

export const ZenithWhite: Story = {
    args: {
        ringCount: 10,
        pulseSpeed: 0.3,
        ringColors: "#ffffff, #888888",
        ringAmplitude: 5,
        ringSpacing: 80,
        bgColors: "#1a1a1a, #2a2a2a",
    },
};

export const ForestMist: Story = {
    args: {
        ringCount: 25,
        pulseSpeed: 0.7,
        ringColors: "#64ff96, #006432",
        ringAmplitude: 12,
        ringSpacing: 35,
        bgColors: "#001005, #00150a",
    },
};

export const ElectricStorm: Story = {
    args: {
        ringCount: 40,
        pulseSpeed: 4.0,
        ringColors: "#00ffff, #ffffff",
        ringAmplitude: 90,
        ringSpacing: 20,
        trailOpacity: 0.05,
    },
};

export const ObsidianFlow: Story = {
    args: {
        ringCount: 12,
        pulseSpeed: 0.5,
        ringColors: "#32323c, #000000",
        ringAmplitude: 25,
        ringSpacing: 50,
        bgColors: "#000, #030303",
    },
};

export const GoldenRatio: Story = {
    args: {
        ringCount: 22,
        pulseSpeed: 0.9,
        ringColors: "#ffd700, #8b4513",
        ringAmplitude: 15,
        ringSpacing: 44,
    },
};

export const InfraredPulse: Story = {
    args: {
        ringCount: 45,
        pulseSpeed: 3.5,
        ringColors: "#ff0000, #000000",
        ringAmplitude: 30,
        ringSpacing: 12,
        bgColors: "#100, #200",
    },
};
