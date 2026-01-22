import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { color } from "d3";
import { html } from "lit";
import "./hexagonWave";

const meta: Meta = {
    title: "Backgrounds/HexagonWave",
    component: "bb-hexagon-wave",
    render: (args) => {
        const c = color(args.backgroundColor as string)?.rgb();
        const bgColor = c ? `${c.r}, ${c.g}, ${c.b}` : "0, 0, 0";

        return html`
            <bb-hexagon-wave
                background-color=${bgColor}
                hex-size=${args.hexSize}
                wave-amplitude=${args.waveAmplitude}
                wave-speed=${args.waveSpeed}
                wave-x-factor=${args.waveXFactor}
                wave-y-factor=${args.waveYFactor}
                base-lightness=${args.baseLightness}
                lightness-range=${args.lightnessRange}
                hex-hue-start=${args.hexHueStart}
                hex-hue-end=${args.hexHueEnd}
                hex-saturation=${args.hexSaturation}
                hex-scale=${args.hexScale}
                trail-opacity=${args.trailOpacity}
                hex-colors=${args.hexColors}
                style="width: 100%; height: 500px; display: flex;"
            ></bb-hexagon-wave>
        `;
    },
    argTypes: {
        backgroundColor: { control: "color" },
        hexSize: { control: { type: "range", min: 1, max: 200, step: 1 } },
        waveAmplitude: {
            control: { type: "range", min: 0, max: 25, step: 0.1 },
        },
        waveSpeed: { control: { type: "range", min: -5, max: 5, step: 0.1 } },
        waveXFactor: {
            control: { type: "range", min: -0.05, max: 0.05, step: 0.001 },
        },
        waveYFactor: {
            control: { type: "range", min: -0.05, max: 0.05, step: 0.001 },
        },
        baseLightness: {
            control: { type: "range", min: 0, max: 100, step: 1 },
        },
        lightnessRange: {
            control: { type: "range", min: 0, max: 50, step: 1 },
        },
        hexHueStart: { control: { type: "range", min: 0, max: 360, step: 1 } },
        hexHueEnd: { control: { type: "range", min: 0, max: 360, step: 1 } },
        hexSaturation: {
            control: { type: "range", min: 0, max: 100, step: 1 },
        },
        hexScale: {
            control: { type: "range", min: 0.1, max: 2.0, step: 0.05 },
        },
        trailOpacity: {
            control: { type: "range", min: 0, max: 1, step: 0.05 },
        },
        hexColors: { control: "text" },
    },
    args: {
        backgroundColor: "#000",
        hexSize: 50,
        waveAmplitude: 5.5,
        waveSpeed: 1.1,
        waveXFactor: -0.005,
        waveYFactor: -0.005,
        baseLightness: 10,
        lightnessRange: 25,
        hexHueStart: 310,
        hexHueEnd: 200,
        hexSaturation: 60,
        hexScale: 1.0,
        trailOpacity: 0.1,
        hexColors: "",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    args: {
        baseLightness: 30,
        hexHueStart: 207,
        hexHueEnd: 318,
        waveAmplitude: 5.5,
        lightnessRange: 32,
        hexSaturation: 75,
        hexScale: 1,
        hexSize: 50,
        waveSpeed: 1.3,
    },
};

export const SunsetGradient: Story = {
    args: {
        hexHueStart: 10,
        hexHueEnd: 60,
        baseLightness: 50,
        lightnessRange: 30,
    },
};

export const NeonVibe: Story = {
    args: {
        backgroundColor: "#050510",
        hexHueStart: 280,
        hexHueEnd: 320,
        baseLightness: 50,
        lightnessRange: 40,
        hexScale: 0.8,
    },
};

export const HoneyCombs: Story = {
    args: {
        hexScale: 0.9,
        hexSize: 50,
        hexHueStart: 40,
        hexHueEnd: 80,
        backgroundColor: "#eeff00",
        baseLightness: 50,
    },
};

export const TinyCells: Story = {
    args: {
        hexSize: 16,
        waveAmplitude: 4,
        hexHueStart: 200,
        hexHueEnd: 260,
        backgroundColor: "#090414",
        baseLightness: 50,
        hexScale: 0.6,
    },
};

export const OceanDepths: Story = {
    args: {
        backgroundColor: "#001a33",
        hexHueStart: 180,
        hexHueEnd: 220,
        baseLightness: 45,
        lightnessRange: 23,
        waveSpeed: 0.5,
        hexSize: 60,
        waveAmplitude: 9.9,
        hexScale: 1.1,
    },
};

export const LavaFlow: Story = {
    args: {
        backgroundColor: "#ff8e00",
        hexHueStart: 0,
        hexHueEnd: 38,
        baseLightness: 50,
        lightnessRange: 15,
        waveSpeed: 0.8,
        hexSize: 45,
        hexScale: 1,
        waveXFactor: 0.005,
        waveYFactor: 0.005,
    },
};

export const ArcticIce: Story = {
    args: {
        backgroundColor: "#e6f7ff",
        hexHueStart: 180,
        hexHueEnd: 200,
        baseLightness: 60,
        lightnessRange: 20,
        waveSpeed: 1.1,
        hexSize: 70,
        trailOpacity: 0.15,
        hexScale: 0.95,
    },
};

export const CyberpunkGrid: Story = {
    args: {
        backgroundColor: "#0a0014",
        hexColors: "#ff00ff, #00ffff, #ff0080",
        baseLightness: 50,
        lightnessRange: 30,
        waveSpeed: 2.0,
        hexSize: 35,
    },
};

export const ForestCanopy: Story = {
    args: {
        backgroundColor: "#0d1f0d",
        hexHueStart: 90,
        hexHueEnd: 150,
        baseLightness: 15,
        lightnessRange: 25,
        waveSpeed: 0.6,
        hexSize: 55,
    },
};

export const DesertMirage: Story = {
    args: {
        backgroundColor: "#2b1f0f",
        hexHueStart: 30,
        hexHueEnd: 50,
        baseLightness: 35,
        lightnessRange: 30,
        waveSpeed: 1.2,
        hexSize: 40,
        waveAmplitude: 0.8,
    },
};

export const ElectricStorm: Story = {
    args: {
        backgroundColor: "#0f0f1a",
        hexHueStart: 240,
        hexHueEnd: 280,
        baseLightness: 46,
        lightnessRange: 43,
        waveSpeed: 3.0,
        hexSize: 30,
        hexScale: 1.15,
        waveAmplitude: 21.4,
    },
};

export const PastelDream: Story = {
    args: {
        backgroundColor: "#fff5f8",
        hexColors: "#ffb3d9, #b3d9ff, #d9b3ff, #ffffb3",
        baseLightness: 63,
        lightnessRange: 15,
        waveSpeed: 2.4,
        hexSize: 50,
        hexScale: 0.9,
        trailOpacity: 0.2,
        waveAmplitude: 0.3,
    },
};

export const SurfersParadise: Story = {
    args: {
        backgroundColor: "#000",
        hexSize: 7,
        waveAmplitude: 5.5,
        waveSpeed: -1,
        waveXFactor: -0.007,
        waveYFactor: 0.03,
        baseLightness: 37,
        lightnessRange: 25,
        hexHueStart: 182,
        hexHueEnd: 233,
        hexSaturation: 100,
        hexScale: 1.2,
        trailOpacity: 0.1,
        hexColors: null,
    },
};
