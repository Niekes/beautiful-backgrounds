import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { color } from "d3";
import { html } from "lit";
import "./startTrail";

const meta: Meta = {
    title: "Backgrounds/Star Trail",
    component: "bb-star-trail",
    render: (args) => {
        const c = color(args.backgroundColor)?.rgb();
        const bgColor = c ? `${c.r}, ${c.g}, ${c.b}` : "0, 0, 0";
        return html` <bb-star-trail
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
            trail-opacity=${args.trailOpacity}
            .particleColors=${args.particleColors}
            style="width: 100%; height: 450px; display: flex;"
        ></bb-star-trail>`;
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
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const RGBStars: Story = {
    args: {
        particleColors: ["#ff0000", "#00ff00", "#0000ff"],
        particleAmount: 500,
        particleSizeMin: 2,
        particleSizeMax: 4,
    },
};

export const PartyLights: Story = {
    args: {
        particleSpeedMin: -0.1,
        particleSpeedMax: 0.1,
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
        backgroundColor: "#050035",
        particleAmount: 2000,
        particleColorHueEnd: 275,
        particleColorHueStart: 169,
        particleLifespanMax: 1000,
        particleLifespanMin: 100,
        particleSizeMax: 0.8,
        particleSizeMin: 0.2,
        particleSpeedMax: 0.1,
        particleSpeedMin: -0.1,
    },
};

export const CyanRing: Story = {
    args: {
        backgroundColor: "#000000",
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
        particleSpeedMax: 1,
        particleSpeedMin: -1,
    },
};
