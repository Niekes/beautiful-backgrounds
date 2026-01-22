import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "../components/neonRails";

const meta: Meta = {
    title: "Backgrounds/Neon Rails",
    component: "bb-neon-rails",
    render: (args) => {
        const angle = args.gridAngle * (Math.PI / 180);

        return html`
            <bb-neon-rails
                bg-colors=${args.bgColors}
                bg-angle=${args.bgAngle}
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
                particle-colors=${args.particleColors}
                style="width: 100%; height: 450px; display: flex;"
            ></bb-neon-rails>
        `;
    },
    argTypes: {
        particleColors: { control: "text" },
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
        bgColors: { control: "text" },
        bgAngle: { control: { type: "range", min: 0, max: 360, step: 1 } },
        trailOpacity: {
            control: { type: "range", min: 0.001, max: 1, step: 0.001 },
        },
    },
    args: {
        bgColors: "#000, #000",
        bgAngle: 0,
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
        particleColors: "",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    args: {
        bgColors: "#000, #000",
        particleSpeedMin: -1,
        particleSpeedMax: 1,
    },
};

export const LaserSecurityGrid: Story = {
    args: {
        bgColors: "#000, #000",
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
        bgColors: "#000, #000",
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
        bgColors: "#000, #000",
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
        particleColors: "#ffffff, #008BFF, #E4FF30",
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
        bgColors: "#000, #000",
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
        bgColors: "#000, #000",
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
        particleColors: [],
    },
};

export const ElectricHighway: Story = {
    args: {
        bgColors: "#000a1a, #000a1a",
        particleColors: "#00ffff, #0080ff",
        particleSizeMin: 1.5,
        particleSizeMax: 3.0,
        particleSpeedMin: 15,
        particleSpeedMax: 25,
        particleLifespanMin: 2000,
        particleLifespanMax: 8000,
        particleAmount: 800,
        gridSides: 4,
        gridSize: 80,
        gridAngle: 0,
        trailOpacity: 0.08,
    },
};

export const VioletLattice: Story = {
    args: {
        bgColors: "#0f0014, #0f0014",
        particleColors: "#ff00ff, #ff0080, #8000ff",
        particleSizeMin: 0.5,
        particleSizeMax: 2.0,
        particleSpeedMin: -3,
        particleSpeedMax: 3,
        particleLifespanMin: 5000,
        particleLifespanMax: 15000,
        particleAmount: 1500,
        gridSides: 6,
        gridSize: 45,
        gridAngle: 30,
        trailOpacity: 0.02,
    },
};

export const TronLegacy: Story = {
    args: {
        bgColors: "#000000, #000000",
        particleColorHueStart: 180,
        particleColorHueEnd: 200,
        particleColorSaturationStart: 100,
        particleColorSaturationEnd: 100,
        particleColorLightnessStart: 50,
        particleColorLightnessEnd: 80,
        particleSizeMin: 0.8,
        particleSizeMax: 1.7,
        particleSpeedMin: 8,
        particleSpeedMax: 20,
        particleLifespanMin: 3000,
        particleLifespanMax: 10000,
        particleAmount: 2500,
        gridSides: 4,
        gridSize: 50,
        gridAngle: 115,
        trailOpacity: 0.05,
    },
};

export const NeuralNetwork: Story = {
    args: {
        bgColors: "#0a0a0f, #0a0a0f",
        particleColors: "#00ff88, #00ffcc, #00ffff",
        particleSizeMin: 0.3,
        particleSizeMax: 1.2,
        particleSpeedMin: -2,
        particleSpeedMax: 2,
        particleLifespanMin: 8000,
        particleLifespanMax: 25000,
        particleAmount: 3000,
        gridSides: 5,
        gridSize: 35,
        gridAngle: 0,
        trailOpacity: 0.044,
    },
};

export const RainbowCircuit: Story = {
    args: {
        bgColors: "#000000, #000000",
        particleColorHueStart: 0,
        particleColorHueEnd: 360,
        particleColorSaturationStart: 100,
        particleColorSaturationEnd: 100,
        particleColorLightnessStart: 50,
        particleColorLightnessEnd: 70,
        particleSizeMin: 1.0,
        particleSizeMax: 2.5,
        particleSpeedMin: 5,
        particleSpeedMax: 15,
        particleLifespanMin: 4000,
        particleLifespanMax: 12000,
        particleAmount: 1800,
        gridSides: 8,
        gridSize: 60,
        gridAngle: 22.5,
        trailOpacity: 0.03,
    },
};

export const QuantumTunnels: Story = {
    args: {
        bgColors: "#000000, #000000",
        particleColorHueStart: 260,
        particleColorHueEnd: 280,
        particleColorSaturationStart: 80,
        particleColorSaturationEnd: 100,
        particleColorLightnessStart: 40,
        particleColorLightnessEnd: 90,
        particleSizeMin: 0.2,
        particleSizeMax: 1.8,
        particleSpeedMin: -12,
        particleSpeedMax: 12,
        particleLifespanMin: 1500,
        particleLifespanMax: 8000,
        particleAmount: 4000,
        gridSides: 3,
        gridSize: 40,
        gridAngle: 60,
        trailOpacity: 0.01,
    },
};

export const EmeraldMatrix: Story = {
    args: {
        bgColors: "#001a00, #001a00",
        particleColorHueStart: 120,
        particleColorHueEnd: 150,
        particleColorSaturationStart: 100,
        particleColorSaturationEnd: 100,
        particleColorLightnessStart: 30,
        particleColorLightnessEnd: 70,
        particleSizeMin: 0.5,
        particleSizeMax: 1.5,
        particleSpeedMin: 3,
        particleSpeedMax: 10,
        particleLifespanMin: 5000,
        particleLifespanMax: 18000,
        particleAmount: 2200,
        gridSides: 4,
        gridSize: 25,
        gridAngle: 0,
        trailOpacity: 0.025,
    },
};

export const SunsetGrid: Story = {
    args: {
        bgColors: "#1a0a00, #1a0a00",
        particleColors: "#ff6600, #ff9900, #ffcc00, #ff3300",
        particleSizeMin: 0.8,
        particleSizeMax: 2.5,
        particleSpeedMin: -5,
        particleSpeedMax: 5,
        particleLifespanMin: 6000,
        particleLifespanMax: 20000,
        particleAmount: 1200,
        gridSides: 6,
        gridSize: 55,
        gridAngle: 90,
        trailOpacity: 0.04,
    },
};
