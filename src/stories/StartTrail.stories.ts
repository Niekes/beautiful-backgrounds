import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { color } from "d3";
import { html } from "lit";
import "./startTrail";

const meta: Meta = {
    title: "Backgrounds/StarTrail",
    component: "bb-star-trail",
    render: (args) => {
        const c = color(args.backgroundColor)?.rgb();
        const bgColor = c ? `${c.r}, ${c.g}, ${c.b}` : "0, 0, 0";
        return html` <bb-star-trail
            data-background-color=${bgColor}
            data-star-size-min=${args.starSizeMin}
            data-star-size-max=${args.starSizeMax}
            data-star-speed-min=${args.starSpeedMin}
            data-star-speed-max=${args.starSpeedMax}
            data-star-color-hue-start=${args.starColorHueStart}
            data-star-color-hue-end=${args.starColorHueEnd}
            data-star-color-saturation-start=${args.starColorSaturationStart}
            data-star-color-saturation-end=${args.starColorSaturationEnd}
            data-star-color-lightness-start=${args.starColorLightnessStart}
            data-star-color-lightness-end=${args.starColorLightnessEnd}
            data-star-radius-min=${args.starRadiusMin}
            data-star-radius-max=${args.starRadiusMax}
            data-star-lifespan-min=${args.starLifespanMin}
            data-star-lifespan-max=${args.starLifespanMax}
            data-num-stars=${args.numStars}
            style="width: 100%; height: 450px; display: flex;"
        ></bb-star-trail>`;
    },
    argTypes: {
        backgroundColor: { control: "color" },
        starSizeMin: {
            control: { type: "range", min: 0.1, max: 10, step: 0.1 },
        },
        starSizeMax: {
            control: { type: "range", min: 0.1, max: 10, step: 0.1 },
        },
        starSpeedMin: {
            control: { type: "range", min: -10, max: 10, step: 0.1 },
        },
        starSpeedMax: {
            control: { type: "range", min: -10, max: 10, step: 0.1 },
        },
        starColorHueStart: { control: { type: "range", min: 0, max: 360 } },
        starColorHueEnd: { control: { type: "range", min: 0, max: 360 } },
        starColorSaturationStart: {
            control: { type: "range", min: 0, max: 100 },
        },
        starColorSaturationEnd: {
            control: { type: "range", min: 0, max: 100 },
        },
        starColorLightnessStart: {
            control: { type: "range", min: 0, max: 100 },
        },
        starColorLightnessEnd: { control: { type: "range", min: 0, max: 100 } },
        starRadiusMin: { control: { type: "range", min: 0, max: 2000 } },
        starRadiusMax: { control: { type: "range", min: 0, max: 2000 } },
        starLifespanMin: {
            control: { type: "range", min: 100, max: 20000, step: 100 },
        },
        starLifespanMax: {
            control: { type: "range", min: 100, max: 20000, step: 100 },
        },
        numStars: { control: { type: "range", min: 1, max: 5000 } },
    },
    args: {
        backgroundColor: "#000",
        numStars: 1000,
        starSizeMin: 0.5,
        starSizeMax: 1.5,
        starSpeedMin: -0.5,
        starSpeedMax: 0.5,
        starColorHueStart: 30,
        starColorHueEnd: 75,
        starColorSaturationStart: 100,
        starColorSaturationEnd: 100,
        starColorLightnessStart: 50,
        starColorLightnessEnd: 50,
        starLifespanMin: 1000,
        starLifespanMax: 10000,
    },
};

export default meta;
type Story = StoryObj;

export const SmoothSky: Story = {};

export const PartyLights: Story = {
    args: {
        starSpeedMin: -0.1,
        starSpeedMax: 0.1,
        starColorLightnessStart: 70,
        starColorLightnessEnd: 90,
        numStars: 1000,
        starSizeMin: 3.6,
        starSizeMax: 6.2,
        starColorHueStart: 0,
        starColorHueEnd: 360,
        starLifespanMin: 15000,
        starLifespanMax: 20000,
    },
};

export const BlueFireFlies: Story = {
    args: {
        starSpeedMin: -0.1,
        starSpeedMax: 0.1,
        starColorHueStart: 200,
        starColorHueEnd: 240,
        starSizeMin: 0.2,
        starSizeMax: 0.8,
        numStars: 2000,
        starLifespanMin: 100,
        starLifespanMax: 1000,
        backgroundColor: "#050035",
    },
};

export const CyanRing: Story = {
    args: {
        backgroundColor: "#000000",
        numStars: 2000,
        starSizeMin: 0.2,
        starSizeMax: 0.8,
        starSpeedMin: -1,
        starSpeedMax: 1,
        starColorHueStart: 174,
        starColorHueEnd: 200,
        starColorSaturationStart: 100,
        starColorSaturationEnd: 100,
        starColorLightnessStart: 50,
        starColorLightnessEnd: 50,
        starRadiusMin: 153,
        starRadiusMax: 225,
        starLifespanMin: 10000,
        starLifespanMax: 20000,
    },
};
