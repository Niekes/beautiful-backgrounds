import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./startTrail";

const meta: Meta = {
    title: "Backgrounds/StarTrail",
    component: "bb-star-trail",
    render: (args) => html`
        <bb-star-trail
            data-fps=${args.fps}
            data-background-color=${args.backgroundColor}
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
            style="width: 100%; height: 600px; display: block;"
        ></bb-star-trail>
    `,
    argTypes: {
        backgroundColor: { control: "text" },
        fps: { control: { type: "range", min: 0, max: 120 } },
        starSizeMin: {
            control: { type: "range", min: 0.1, max: 10, step: 0.1 },
        },
        starSizeMax: {
            control: { type: "range", min: 0.1, max: 10, step: 0.1 },
        },
        starSpeedMin: {
            control: { type: "range", min: 0.001, max: 0.2, step: 0.001 },
        },
        starSpeedMax: {
            control: { type: "range", min: 0.001, max: 0.2, step: 0.001 },
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
        starRadiusMin: { control: { type: "range", min: 0, max: 500 } },
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
        fps: 60,
        backgroundColor: "0, 0, 0",
        starSizeMin: 0.5,
        starSizeMax: 1.5,
        starSpeedMin: 0.025,
        starSpeedMax: 0.05,
        starColorHueStart: 30,
        starColorHueEnd: 75,
        starColorSaturationStart: 100,
        starColorSaturationEnd: 100,
        starColorLightnessStart: 50,
        starColorLightnessEnd: 50,
        starRadiusMin: 1,
        starRadiusMax: 100,
        starLifespanMin: 1000,
        starLifespanMax: 10000,
        numStars: 1000,
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const FastAndBright: Story = {
    args: {
        starSpeedMin: 0.08,
        starSpeedMax: 0.15,
        starColorLightnessStart: 70,
        starColorLightnessEnd: 90,
        numStars: 1500,
    },
};

export const DeepSpace: Story = {
    args: {
        starColorHueStart: 200,
        starColorHueEnd: 240,
        starSizeMin: 0.2,
        starSizeMax: 0.8,
        numStars: 2000,
        backgroundColor: "5, 5, 15",
    },
};
