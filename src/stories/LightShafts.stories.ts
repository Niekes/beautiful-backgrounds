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
                shaft-angle=${args.shaftAngle}
                speed=${args.speed}
                bg-colors=${args.bgColors}
                bg-angle=${args.bgAngle}
                trail-opacity=${args.trailOpacity}
                clean-trail=${args.cleanTrail}
                style="width: 100%; height: 500px; border-radius: 15px"
            ></bb-light-shafts>
        `;
    },
    argTypes: {
        shaftColors: { control: "text" },
        shaftAmount: {
            control: { type: "range", min: 0, max: 400, step: 1 },
        },
        shaftAngle: { control: { type: "range", min: -90, max: 90, step: 1 } },
        speed: { control: { type: "range", min: -10, max: 10, step: 0.1 } },
        bgColors: { control: "text" },
        bgAngle: { control: { type: "range", min: 0, max: 360, step: 1 } },
        trailOpacity: {
            control: { type: "range", min: 0, max: 1, step: 0.01 },
        },
        cleanTrail: { control: "boolean" },
    },
    args: {
        shaftColors: "#47d1d1, #475ed1, #a347d1",
        shaftAmount: 100,
        shaftAngle: 0,
        speed: 1,
        bgColors: "#000, #141a3a, #000",
        bgAngle: 90,
        trailOpacity: 1,
        cleanTrail: false,
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

export const MeteorShower: Story = {
    args: {
        shaftColors: "#ffd36b, #ff6a3d, #ff2f6d",
        shaftAmount: 40,
        shaftAngle: 30,
        speed: -8,
        trailOpacity: 0.2,
        bgColors: "#05010a, #14041c",
    },
};

export const Cathedral: Story = {
    args: {
        shaftColors: "#ff3b3b, #ffd23f, #3b8bff",
        shaftAmount: 12,
        speed: 0.2,
        bgColors: "#000, #1a1208, #000",
        shaftAngle: -26,
    },
};

export const Reef: Story = {
    args: {
        shaftColors: "#3fe0d0, #1a8fb0",
        shaftAmount: 220,
        speed: 0.5,
        bgColors: "#00141a, #002a33",
        bgAngle: 180,
    },
};

export const Downpour: Story = {
    args: {
        shaftColors: "#1c2836, #34465a",
        shaftAmount: 150,
        speed: 6,
        bgColors: "#05080c",
    },
};

export const StageLights: Story = {
    args: {
        shaftColors: "#ff2fb3, #2fe8ff, #ffb02f",
        shaftAmount: 8,
        speed: 2,
        bgColors: "#000",
    },
};

export const Lanterns: Story = {
    args: {
        shaftColors: "#ff9a3c, #ff5e3a, #ffd36b",
        shaftAmount: 30,
        speed: 0.3,
        bgColors: "#0a0300, #1c0a02, #0a0300",
    },
};
