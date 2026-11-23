import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "../components/driftingOrbs";

const meta: Meta = {
    title: "Backgrounds/Drifting Orbs",
    component: "bb-drifting-orbs",
    render: (args) => {
        return html`
            <bb-drifting-orbs
                orb-colors=${args.orbColors}
                orb-amount=${args.orbAmount}
                orb-size=${args.orbSize}
                orb-blur=${args.orbBlur}
                speed=${args.speed}
                bg-colors=${args.bgColors}
                bg-angle=${args.bgAngle}
                trail-opacity=${args.trailOpacity}
                style="width: 100%; height: 500px; border-radius: 15px"
            ></bb-drifting-orbs>
        `;
    },
    argTypes: {
        orbColors: { control: "text" },
        orbAmount: { control: { type: "range", min: 0, max: 500, step: 5 } },
        orbSize: { control: { type: "range", min: 10, max: 800, step: 10 } },
        orbBlur: { control: { type: "range", min: 0, max: 120, step: 1 } },
        speed: { control: { type: "range", min: 0, max: 5, step: 0.05 } },
        bgColors: { control: "text" },
        bgAngle: { control: { type: "range", min: 0, max: 360, step: 1 } },
        trailOpacity: {
            control: { type: "range", min: 0, max: 1, step: 0.01 },
        },
    },
    args: {
        orbColors: "#1f3d7a, #5c1f7a, #7a1f3d, #7a5c1f, #3d7a1f, #1f7a5c",
        orbAmount: 150,
        orbSize: 300,
        orbBlur: 50,
        speed: 1,
        bgColors: "#0d0d0d",
        bgAngle: 90,
        trailOpacity: 1,
    },
};

export default meta;
type Story = StoryObj;

export const PastelDream: Story = {
    args: {
        orbColors: "#ffc8dd, #bde0fe, #cdb4db, #caffbf",
        orbBlur: 60,
        bgColors: "#fdf6ff",
    },
};

export const ChromaMist: Story = {};

export const OldFilm: Story = {
    args: {
        orbColors: "#3b2a1a, #8a6a44, #d9c3a0",
        orbAmount: 200,
        orbSize: 200,
        orbBlur: 40,
        speed: 0.3,
        bgColors: "#120c07",
    },
};

export const DeepOcean: Story = {
    args: {
        orbColors: "#0b1d51, #0f4c75, #138a8a, #1bb3c4",
        orbBlur: 70,
        speed: 0.4,
        bgColors: "#020a14",
    },
};

export const Aurora: Story = {
    args: {
        orbColors: "#0f7a4f, #22c37a, #5b2bb5, #8a4fff",
        orbAmount: 250,
        orbSize: 180,
        bgColors: "#030806",
    },
};

export const LavaLamp: Story = {
    args: {
        orbColors: "#ff2d75, #ff7a1a",
        orbAmount: 25,
        orbSize: 500,
        orbBlur: 30,
        speed: 0.6,
        bgColors: "#1a0410",
    },
};

export const Ember: Story = {
    args: {
        orbColors: "#5a0a0a, #a3200f, #e0700f",
        orbAmount: 300,
        orbSize: 150,
        speed: 1.8,
        bgColors: "#050101",
    },
};

export const MintBreeze: Story = {
    args: {
        orbColors: "#3ddc97, #8ff0c8, #2bb3a3, #e8fff6",
        speed: 0.6,
        bgColors: "#0a1f1a",
        orbAmount: 10,
    },
};

export const MonochromeFog: Story = {
    args: {
        orbColors: "#2a2a2a, #6b6b6b, #b0b0b0",
        orbBlur: 80,
        speed: 0.3,
        bgColors: "#0d0d0d",
    },
};

export const NeonBokeh: Story = {
    args: {
        orbColors: "#ff00e5, #00f0ff, #faff00, #39ff14",
        orbSize: 120,
        orbBlur: 8,
        bgColors: "#000",
    },
};
