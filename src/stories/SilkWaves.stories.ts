import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "../components/silkWaves";

const meta: Meta = {
    title: "Backgrounds/Silk Waves",
    component: "bb-silk-waves",
    render: (args) => {
        return html`
            <bb-silk-waves
                silk-color=${args.silkColor}
                swell=${args.swell}
                sheen=${args.sheen}
                reach=${args.reach}
                speed=${args.speed}
                bg-colors=${args.bgColors}
                bg-angle=${args.bgAngle}
                style="width: 100%; height: 500px; border-radius: 15px"
            ></bb-silk-waves>
        `;
    },
    argTypes: {
        silkColor: { control: "text" },
        swell: { control: { type: "range", min: 0, max: 0.6, step: 0.01 } },
        sheen: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
        reach: { control: { type: "range", min: 0.1, max: 3, step: 0.05 } },
        speed: { control: { type: "range", min: 0, max: 3, step: 0.05 } },
        bgColors: { control: "text" },
        bgAngle: { control: { type: "range", min: 0, max: 360, step: 1 } },
    },
    args: {
        silkColor: "#005588",
        swell: 0.2,
        sheen: 0.73,
        reach: 0.65,
        speed: 1,
        bgColors: "#000208, #001020",
        bgAngle: 90,
    },
};

export default meta;
type Story = StoryObj;

export const DeepTide: Story = {};

export const MoltenGold: Story = {
    args: {
        silkColor: "#ff9500",
        bgColors: "#0d0400, #1a0800",
    },
};

export const Mercury: Story = {
    args: {
        silkColor: "#d8dee9",
        sheen: 1,
        swell: 0.3,
        bgColors: "#02040a",
    },
};

export const Drift: Story = {
    args: {
        swell: 0.08,
        sheen: 0.5,
        speed: 0.35,
        reach: 1.2,
        bgColors: "#0a1420, #14302e",
    },
};

export const Horizon: Story = {
    args: {
        reach: 2.5,
        swell: 0.35,
        bgColors: "#001220, #003038",
    },
};
