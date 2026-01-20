import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { color } from "d3";
import { html } from "lit";
import "./whirlpoolGalaxy";

const meta: Meta = {
    title: "Backgrounds/Whirlpool Galaxy",
    component: "bb-whirlpool-galaxy",
    render: (args) => {
        const c = color(args.backgroundColor)?.rgb();
        const bgColor = c ? `${c.r}, ${c.g}, ${c.b}` : "0, 0, 0";
        return html` <bb-whirlpool-galaxy
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
            particle-radius-min=${args.particleRadiusMin}
            particle-radius-max=${args.particleRadiusMax}
            particle-lifespan-min=${args.particleLifespanMin}
            particle-lifespan-max=${args.particleLifespanMax}
            particle-amount=${args.particleAmount}
            particle-force=${args.particleForce}
            trail-opacity=${args.trailOpacity}
            .particleColors=${args.particleColors}
            style="width: 100%; height: 450px; display: flex;"
        ></bb-whirlpool-galaxy>`;
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
        trailOpacity: {
            control: { type: "range", min: 0.001, max: 1, step: 0.001 },
        },
        particleColors: { control: "object" },
    },
    args: {
        backgroundColor: "#000",
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
        particleSpeedMin: 0.5,
        particleSpeedMax: 2.0,
        trailOpacity: 0.1,
        particleColors: [],
        particleForce: 20,
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    args: {
        particleColors: ["#0b2c55", "#1c5d92", "#6faee8", "#f7da85", "#d56297"],
        particleAmount: 5000,
        particleSizeMin: 1.1,
        particleSizeMax: 2.5,
        particleForce: 23,
        particleLifespanMin: 5000,
        particleLifespanMax: 20000,
        trailOpacity: 0.03
    },
};

export const GravitationalCollapse: Story = {
    args: {
        backgroundColor: "#000",
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
        particleSpeedMin: -2,
        particleSpeedMax: -0.7,
        trailOpacity: 0.275,
        particleColors: null,
        particleForce: -31.8
    }
};
