import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { color } from "d3";
import { html } from "lit";
import "./neonRails";

const meta: Meta = {
    title: "Backgrounds/Neon Rails",
    component: "bb-neon-rails",
    render: (args) => {
        const c = color(args.backgroundColor)?.rgb();
        const bgColor = c ? `${c.r}, ${c.g}, ${c.b}` : "0, 0, 0";
        const angle = args.gridAngle * (Math.PI / 180);

        return html`
            <bb-neon-rails
                background-color=${bgColor}
                particle-size-min=${args.particleSizeMin}
                particle-size-max=${args.particleSizeMax}
                particle-speed-min=${args.particleSpeedMin}
                particle-speed-max=${args.particleSpeedMax}
                particle-color-hue-start=${args.particleColorHueStart}
                particle-color-hue-end=${args.particleColorHueEnd}
                particle-color-saturation-start=${args.particleColorSaturationStart}
                particle-color-saturation-end=${args.particleColorSaturationEnd}
                particle-color-lightness-start=${args.particleColorLightnessStart}
                particle-color-lightness-end=${args.particleColorLightnessEnd}
                particle-lifespan-min=${args.particleLifespanMin}
                particle-lifespan-max=${args.particleLifespanMax}
                particle-amount=${args.particleAmount}
                grid-sides=${args.gridSides}
                grid-size=${args.gridSize}
                grid-angle=${angle}
                trail-opacity=${args.trailOpacity}
                .particleColors=${args.particleColors}
                style="width: 100%; height: 450px; display: flex;"
            ></bb-neon-rails>
        `;
    },
    argTypes: {
        backgroundColor: { control: "color" },
        particleSizeMin: {
            control: { type: "range", min: 0.1, max: 10, step: 0.1 },
        },
        particleSizeMax: {
            control: { type: "range", min: 0.1, max: 10, step: 0.1 },
        },
        particleSpeedMin: {
            control: { type: "range", min: -10, max: 10, step: 0.1 },
        },
        particleSpeedMax: {
            control: { type: "range", min: -10, max: 10, step: 0.1 },
        },
        particleColorHueStart: { control: { type: "range", min: 0, max: 360 } },
        particleColorHueEnd: { control: { type: "range", min: 0, max: 360 } },
        particleColorSaturationStart: {
            control: { type: "range", min: 0, max: 100 },
        },
        particleColorSaturationEnd: {
            control: { type: "range", min: 0, max: 100 },
        },
        particleColorLightnessStart: {
            control: { type: "range", min: 0, max: 100 },
        },
        particleColorLightnessEnd: {
            control: { type: "range", min: 0, max: 100 },
        },
        particleLifespanMin: {
            control: { type: "range", min: 100, max: 100000, step: 100 },
        },
        particleLifespanMax: {
            control: { type: "range", min: 100, max: 100000, step: 100 },
        },
        particleAmount: { control: { type: "range", min: 1, max: 5000 } },
        gridSides: { control: { type: "range", min: 1, max: 12 } },
        gridSize: { control: { type: "range", min: 10, max: 200 } },
        gridAngle: {
            control: { type: "range", min: 0, max: 360, step: 1 },
        },
        trailOpacity: {
            control: { type: "range", min: 0.001, max: 1, step: 0.001 },
        },
        particleColors: { control: "object" },
    },
    args: {
        backgroundColor: "#000",
        particleSizeMin: 1,
        particleSizeMax: 1,
        particleSpeedMin: -10,
        particleSpeedMax: 10,
        particleColorHueStart: 130,
        particleColorHueEnd: 300,
        particleColorSaturationStart: 100,
        particleColorSaturationEnd: 100,
        particleColorLightnessStart: 50,
        particleColorLightnessEnd: 0,
        particleLifespanMin: 100,
        particleLifespanMax: 50000,
        particleAmount: 2000,
        gridSides: 6,
        gridSize: 60,
        gridAngle: 180,
        trailOpacity: 0.0125,
        particleColors: [],
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    args: {
        backgroundColor: "#000",
        particleSpeedMin: -1,
        particleSpeedMax: 1,
    },
};

export const LaserSecurityGrid: Story = {
    args: {
        backgroundColor: "#000",
        particleSizeMin: 0.1,
        particleSizeMax: 0.1,
        particleSpeedMin: 1.7,
        particleSpeedMax: 3.2,
        particleColorHueStart: 350,
        particleColorHueEnd: 353,
        particleColorSaturationStart: 100,
        particleColorSaturationEnd: 100,
        particleColorLightnessStart: 0,
        particleColorLightnessEnd: 50,
        particleLifespanMin: 3600,
        particleLifespanMax: 7900,
        particleAmount: 2000,
        gridSides: 6,
        gridSize: 60,
        gridAngle: 90,
    },
};

export const GoldenMesh: Story = {
    args: {
        backgroundColor: "#000",
        particleSizeMin: 0.1,
        particleSizeMax: 1.3,
        particleSpeedMin: -0.8,
        particleSpeedMax: 0.9,
        particleColorHueStart: 21,
        particleColorHueEnd: 33,
        particleColorSaturationStart: 100,
        particleColorSaturationEnd: 100,
        particleColorLightnessStart: 62,
        particleColorLightnessEnd: 98,
        particleLifespanMin: 100,
        particleLifespanMax: 3200,
        particleAmount: 5000,
        gridSides: 3,
        gridSize: 31,
        gridAngle: 90,
    },
};

export const StarRole: Story = {
    args: {
        backgroundColor: "#000",
        particleSizeMin: 1,
        particleSizeMax: 1.7,
        particleSpeedMin: 0.1,
        particleSpeedMax: 2.7,
        particleColorHueStart: 194,
        particleColorHueEnd: 360,
        particleColorSaturationStart: 100,
        particleColorSaturationEnd: 100,
        particleColorLightnessStart: 50,
        particleColorLightnessEnd: 0,
        particleLifespanMin: 100,
        particleLifespanMax: 6000,
        particleAmount: 997,
        gridSides: 2,
        gridSize: 60,
        gridAngle: 90,
        trailOpacity: 0.078,
    },
};

export const Maze: Story = {
    args: {
        particleColors: ["#ffffff", "#008BFF", "#E4FF30"],
        particleAmount: 506,
        gridSides: 4,
        gridSize: 29,
        particleSpeedMin: 40,
        particleSpeedMax: 60,
        particleSizeMin: 2,
        particleSizeMax: 2,
        trailOpacity: 0.05,
    },
};

export const TriangleChain: Story = {
    args: {
        backgroundColor: "#000",
        particleSizeMin: 0.1,
        particleSizeMax: 0.2,
        particleSpeedMin: 0.1,
        particleSpeedMax: 10,
        particleColorHueStart: 63,
        particleColorHueEnd: 81,
        particleColorSaturationStart: 60,
        particleColorSaturationEnd: 70,
        particleColorLightnessStart: 0,
        particleColorLightnessEnd: 100,
        particleLifespanMin: 100,
        particleLifespanMax: 6000,
        particleAmount: 200,
        gridSides: 3,
        gridSize: 29,
        gridAngle: 360,
        trailOpacity: 0.001,
        particleColors: [],
    },
};

export const PinkVeins: Story = {
    args: {
        backgroundColor: "#000",
        particleSizeMin: 0.1,
        particleSizeMax: 1,
        particleSpeedMin: -4.6,
        particleSpeedMax: 2.8,
        particleColorHueStart: 278,
        particleColorHueEnd: 307,
        particleColorSaturationStart: 19,
        particleColorSaturationEnd: 82,
        particleColorLightnessStart: 0,
        particleColorLightnessEnd: 100,
        particleLifespanMin: 100,
        particleLifespanMax: 31800,
        particleAmount: 166,
        gridSides: 6,
        gridSize: 10,
        gridAngle: 168,
        trailOpacity: 0.001,
        particleColors: []
    }
};
