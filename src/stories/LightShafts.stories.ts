import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "../components/lightShafts";

const meta: Meta = {
    title: "Backgrounds/Light Shafts",
    component: "bb-light-shafts",
    render: (args) => {
        return html`
            <bb-light-shafts
                shaft-colors=${args.shaftColors}
                shaft-amount=${args.shaftAmount}
                speed=${args.speed}
                bg-colors=${args.bgColors}
                bg-angle=${args.bgAngle}
                trail-opacity=${args.trailOpacity}
                style="width: 100%; height: 500px; border-radius: 15px"
            ></bb-light-shafts>
        `;
    },
    argTypes: {
        shaftColors: { control: "text" },
        shaftAmount: {
            control: { type: "range", min: 0, max: 400, step: 1 },
        },
        speed: { control: { type: "range", min: 0, max: 10, step: 0.1 } },
        bgColors: { control: "text" },
        bgAngle: { control: { type: "range", min: 0, max: 360, step: 1 } },
        trailOpacity: {
            control: { type: "range", min: 0, max: 1, step: 0.01 },
        },
    },
    args: {
        shaftColors: "#47d1d1, #475ed1, #a347d1",
        shaftAmount: 100,
        speed: 1,
        bgColors: "#000, #141a3a, #000",
        bgAngle: 90,
        trailOpacity: 1,
    },
};

export default meta;
type Story = StoryObj;

export const Crystal: Story = {};

export const Borealis: Story = {
    args: {
        shaftColors: "#22e39b, #19c2c2, #8a5cff",
        bgColors: "#000, #04201c, #000",
    },
};

export const Sunset: Story = {
    args: {
        shaftColors: "#ff7a1a, #ff3d7f",
        bgColors: "#000, #2a0c14, #000",
    },
};

export const Ghost: Story = {
    args: {
        shaftColors: "#ffffff, #a9c4ff",
        shaftAmount: 60,
        speed: 0.4,
        bgColors: "#000",
    },
};

export const Smear: Story = {
    args: {
        shaftAmount: 40,
        speed: 10,
        trailOpacity: 0.2,
    },
};
