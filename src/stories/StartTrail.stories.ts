import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "../components/startTrail";

const meta: Meta = {
    title: "Backgrounds/Star Trail",
    component: "bb-star-trail",
    render: (args) => {
        return html` <bb-star-trail
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
            particle-radius-min=${args.particleRadiusMin}
            particle-radius-max=${args.particleRadiusMax}
            particle-lifespan-min=${args.particleLifespanMin}
            particle-lifespan-max=${args.particleLifespanMax}
            particle-amount=${args.particleAmount}
            particle-force=${args.particleForce}
            trail-opacity=${args.trailOpacity}
            particle-colors=${args.particleColors}
            style="width: 100%; height: 500px; border-radius: 15px"
        ></bb-star-trail>`;
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
            control: { type: "range", min: -5, max: 5, step: 0.01 },
        },
        particleSpeedMax: {
            control: { type: "range", min: -5, max: 5, step: 0.01 },
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
        particleRadiusMin: { control: { type: "range", min: 0, max: 2000 } },
        particleRadiusMax: { control: { type: "range", min: 0, max: 2000 } },
        particleLifespanMin: {
            control: { type: "range", min: 100, max: 20000, step: 100 },
        },
        particleLifespanMax: {
            control: { type: "range", min: 100, max: 20000, step: 100 },
        },
        particleAmount: { control: { type: "range", min: 1, max: 5000 } },
        particleForce: {
            control: { type: "range", min: -50, max: 50, step: 0.1 },
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
        particleAmount: 1000,
        particleColorHueStart: 30,
        particleColorHueEnd: 75,
        particleColorLightnessStart: 50,
        particleColorLightnessEnd: 50,
        particleColorSaturationStart: 100,
        particleColorSaturationEnd: 100,
        particleLifespanMin: 1000,
        particleLifespanMax: 10000,
        particleSizeMin: 0.5,
        particleSizeMax: 1.5,
        particleSpeedMin: 0.1,
        particleSpeedMax: 0.2,
        trailOpacity: 0.1,
        particleColors: "",
    },
};

export default meta;
type Story = StoryObj;

export const GalacticVortex: Story = {
    args: {
        bgColors: "#000, #030",
        bgAngle: 275,
        trailOpacity: 0.328,
    },
};

export const WhirlpoolGalaxy: Story = {
    args: {
        particleColors: "#0b2c55, #1c5d92, #6faee8, #f7da85, #d56297",
        particleAmount: 5000,
        particleSizeMin: 1.1,
        particleSizeMax: 2.5,
        particleForce: 23,
        particleLifespanMin: 5000,
        particleLifespanMax: 20000,
        trailOpacity: 0.071,
    },
};

export const PartyLights: Story = {
    args: {
        particleSpeedMin: -0.01,
        particleSpeedMax: 0.01,
        particleColorLightnessStart: 70,
        particleColorLightnessEnd: 90,
        particleAmount: 1000,
        particleSizeMin: 3.6,
        particleSizeMax: 6.2,
        particleColorHueStart: 0,
        particleColorHueEnd: 360,
        particleLifespanMin: 3100,
        particleLifespanMax: 13900,
    },
};

export const BlueFireFlies: Story = {
    args: {
        bgColors: "#050035, #050035",
        particleAmount: 2000,
        particleColorHueEnd: 275,
        particleColorHueStart: 169,
        particleLifespanMax: 1000,
        particleLifespanMin: 100,
        particleSizeMax: 0.8,
        particleSizeMin: 0.2,
        particleSpeedMax: 0.01,
        particleSpeedMin: -0.01,
    },
};

export const CyanRing: Story = {
    args: {
        bgColors: "#000000, #000000",
        particleAmount: 2000,
        particleColorHueEnd: 200,
        particleColorHueStart: 174,
        particleColorLightnessEnd: 50,
        particleColorLightnessStart: 50,
        particleColorSaturationEnd: 100,
        particleColorSaturationStart: 100,
        particleLifespanMax: 20000,
        particleLifespanMin: 10000,
        particleRadiusMax: 225,
        particleRadiusMin: 153,
        particleSizeMax: 0.8,
        particleSizeMin: 0.2,
        particleSpeedMax: 0.1,
        particleSpeedMin: -0.1,
    },
};

export const GravitationalCollapse: Story = {
    args: {
        bgColors: "#000, #000",
        particleAmount: 2326,
        particleColorHueStart: 0,
        particleColorHueEnd: 360,
        particleColorLightnessStart: 56,
        particleColorLightnessEnd: 100,
        particleColorSaturationStart: 49,
        particleColorSaturationEnd: 100,
        particleLifespanMin: 1000,
        particleLifespanMax: 2600,
        particleSizeMin: 0.5,
        particleSizeMax: 2.5,
        particleSpeedMin: -0.21,
        particleSpeedMax: -0.14,
        trailOpacity: 0.275,
        particleColors: null,
        particleForce: -31.8,
    },
};

export const RGBStars: Story = {
    args: {
        particleColors: "#ff0000, #00ff00, #0000ff",
        particleAmount: 500,
        particleSizeMin: 2,
        particleSizeMax: 4,
    },
};

export const GoldenNebula: Story = {
    args: {
        bgColors: "#1a0f00, #1a0f00",
        particleColorHueStart: 35,
        particleColorHueEnd: 55,
        particleColorLightnessStart: 60,
        particleColorLightnessEnd: 85,
        particleColorSaturationStart: 80,
        particleColorSaturationEnd: 100,
        particleAmount: 3000,
        particleSizeMin: 0.3,
        particleSizeMax: 2.0,
        particleSpeedMin: -0.1,
        particleSpeedMax: 0.1,
        particleForce: 15,
        particleLifespanMin: 8000,
        particleLifespanMax: 15000,
        trailOpacity: 0.31,
    },
};

export const AuroraBorealis: Story = {
    args: {
        bgColors: "#000a1a, #000a1a",
        particleColors: "#00ff88, #00ffcc, #88ff00, #ccff00, #00ccff",
        particleAmount: 4000,
        particleSizeMin: 0.5,
        particleSizeMax: 1.5,
        particleSpeedMin: -0.3,
        particleSpeedMax: 0.3,
        particleForce: 8,
        particleLifespanMin: 10000,
        particleLifespanMax: 18000,
        particleRadiusMin: 50,
        particleRadiusMax: 300,
        trailOpacity: 0.08,
    },
};

export const CosmicDust: Story = {
    args: {
        bgColors: "#0a0a14, #0a0a14",
        particleColorHueStart: 200,
        particleColorHueEnd: 280,
        particleColorLightnessStart: 40,
        particleColorLightnessEnd: 70,
        particleColorSaturationStart: 60,
        particleColorSaturationEnd: 90,
        particleAmount: 6000,
        particleSizeMin: 0.1,
        particleSizeMax: 0.8,
        particleSpeedMin: 0.04,
        particleSpeedMax: 0.03,
        particleForce: -5,
        particleLifespanMin: 3000,
        particleLifespanMax: 12000,
        trailOpacity: 0.126,
    },
};

export const FireflyForest: Story = {
    args: {
        bgColors: "#0f1a0a, #0f1a0a",
        particleColors: "#ffff00, #ffee00, #ffdd00",
        particleAmount: 800,
        particleSizeMin: 1.5,
        particleSizeMax: 3.5,
        particleSpeedMin: -0.2,
        particleSpeedMax: 0.2,
        particleForce: 0,
        particleLifespanMin: 500,
        particleLifespanMax: 2000,
        particleRadiusMin: 20,
        particleRadiusMax: 400,
        trailOpacity: 0.217,
    },
};

export const NeonVortex: Story = {
    args: {
        bgColors: "#000000, #000000",
        particleColors: "#ff00ff, #00ffff, #ff0080, #0080ff",
        particleAmount: 3500,
        particleSizeMin: 0.8,
        particleSizeMax: 2.5,
        particleSpeedMin: 0.1,
        particleSpeedMax: 0.2,
        particleForce: 40,
        particleLifespanMin: 2000,
        particleLifespanMax: 8000,
        particleRadiusMin: 100,
        particleRadiusMax: 350,
        trailOpacity: 0.075,
    },
};

export const StarfieldWarp: Story = {
    args: {
        bgColors: "#000000, #000000",
        particleColorHueStart: 180,
        particleColorHueEnd: 240,
        particleColorLightnessStart: 80,
        particleColorLightnessEnd: 100,
        particleColorSaturationStart: 50,
        particleColorSaturationEnd: 100,
        particleAmount: 2000,
        particleSizeMin: 0.5,
        particleSizeMax: 3.0,
        particleSpeedMin: -0.5,
        particleSpeedMax: -0.25,
        particleForce: -50,
        particleLifespanMin: 500,
        particleLifespanMax: 2000,
        trailOpacity: 0.2,
    },
};

export const TwilightSparkle: Story = {
    args: {
        bgColors: "#1a0f2e, #1a0f2e",
        particleColors: "#ff69b4, #ba55d3, #9370db, #dda0dd",
        particleAmount: 1500,
        particleSizeMin: 1.0,
        particleSizeMax: 3.0,
        particleSpeedMin: -0.01,
        particleSpeedMax: 0.01,
        particleForce: 12,
        particleLifespanMin: 4000,
        particleLifespanMax: 12000,
        particleRadiusMin: 80,
        particleRadiusMax: 280,
        trailOpacity: 0.189,
    },
};

export const RainbowBurst: Story = {
    args: {
        bgColors: "#000000, #000000",
        particleColorHueStart: 0,
        particleColorHueEnd: 360,
        particleColorLightnessStart: 50,
        particleColorLightnessEnd: 70,
        particleColorSaturationStart: 100,
        particleColorSaturationEnd: 100,
        particleAmount: 4500,
        particleSizeMin: 0.5,
        particleSizeMax: 2.0,
        particleSpeedMin: -0.03,
        particleSpeedMax: -0.02,
        particleForce: -25,
        particleLifespanMin: 500,
        particleLifespanMax: 900,
        particleRadiusMin: 1,
        particleRadiusMax: 150,
        trailOpacity: 0.1,
    },
};
