import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "../components/smokeRing";

const meta: Meta = {
    title: "Backgrounds/Smoke Ring",
    component: "bb-smoke-ring",
    render: (args) => {
        return html`
            <bb-smoke-ring
                ring-colors=${args.ringColors}
                ring-size=${args.ringSize}
                ring-wobble=${args.ringWobble}
                speed=${args.speed}
                bg-colors=${args.bgColors}
                bg-angle=${args.bgAngle}
                trail-opacity=${args.trailOpacity}
                style="width: 100%; height: 500px; border-radius: 15px"
            ></bb-smoke-ring>
        `;
    },
    argTypes: {
        ringColors: { control: "text" },
        ringSize: {
            control: { type: "range", min: 0.05, max: 0.6, step: 0.01 },
        },
        ringWobble: {
            control: { type: "range", min: 0, max: 0.3, step: 0.005 },
        },
        speed: { control: { type: "range", min: 0, max: 3, step: 0.05 } },
        bgColors: { control: "text" },
        bgAngle: { control: { type: "range", min: 0, max: 360, step: 1 } },
        trailOpacity: {
            control: { type: "range", min: 0, max: 0.1, step: 0.001 },
        },
    },
    args: {
        ringColors:
            "#b24c8b, #9f972d, #68c44f, #15caa8, #00abea, #156aff, #6810ff, #9f00d7",
        ringSize: 0.2,
        ringWobble: 0.03,
        speed: 1,
        bgColors: "#131a43",
        bgAngle: 0,
        trailOpacity: 0.005,
    },
};

export default meta;
type Story = StoryObj;

export const Nebula: Story = {};

export const Ember: Story = {
    args: {
        ringColors: "#ff6a00, #ffd000",
        bgColors: "#120500, #200a00",
        bgAngle: 90,
    },
};

export const Aurora: Story = {
    args: {
        ringColors: "#00ffa3, #00c2ff, #7a5cff",
        ringWobble: 0.06,
        bgColors: "#020617, #0f172a",
        bgAngle: 90,
    },
};

export const Moonlight: Story = {
    args: {
        ringColors: "#ffffff, #9fb4ff",
        ringSize: 0.15,
        speed: 0.5,
        bgColors: "#000000",
    },
};

export const Bloom: Story = {
    args: {
        ringSize: 0.35,
        ringWobble: 0.1,
        trailOpacity: 0.01,
        bgColors: "#1a0f2e",
    },
};
