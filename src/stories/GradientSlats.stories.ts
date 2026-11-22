import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "../components/gradientSlats";

const meta: Meta = {
    title: "Backgrounds/Gradient Slats",
    component: "bb-gradient-slats",
    render: (args) => {
        return html`
            <bb-gradient-slats
                wash-colors=${args.washColors}
                slat-amount=${args.slatAmount}
                slat-angle=${args.slatAngle}
                ?slat-flip=${args.slatFlip}
                slat-shade=${args.slatShade}
                speed=${args.speed}
                style="width: 100%; height: 500px; border-radius: 15px"
            ></bb-gradient-slats>
        `;
    },
    argTypes: {
        washColors: { control: "text" },
        slatAmount: { control: { type: "range", min: 2, max: 120, step: 1 } },
        slatAngle: { control: { type: "range", min: -90, max: 90, step: 1 } },
        slatFlip: { control: "boolean" },
        slatShade: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
        speed: { control: { type: "range", min: 0, max: 10, step: 0.05 } },
    },
    args: {
        washColors: "#c41e3a, #e0218a, #6a2c9e, #3b4fa8, #f5c800",
        slatAmount: 27,
        slatAngle: 0,
        slatFlip: false,
        slatShade: 1,
        speed: 1,
    },
};

export default meta;
type Story = StoryObj;

export const Prism: Story = {};

export const Lagoon: Story = {
    args: {
        washColors: "#00334e, #0f8b8d, #3ec1d3, #f6f7d7",
        slatAmount: 16,
        slatAngle: 12,
    },
};

export const Ember: Story = {
    args: {
        washColors: "#2b0504, #c1121f, #ff7b00",
        slatAmount: 60,
        speed: 2,
    },
};

export const Vaporwave: Story = {
    args: {
        washColors: "#ff71ce, #01cdfe, #05ffa1, #b967ff, #fffb96",
        slatAmount: 36,
        slatAngle: 45,
        speed: 1.5,
    },
};

export const Aurora: Story = {
    args: {
        washColors: "#020b1a, #00ff9c, #00b3ff, #7a00ff, #020b1a",
        slatAmount: 90,
        slatAngle: -8,
        speed: 0.6,
    },
};

export const VenetianSunset: Story = {
    args: {
        washColors: "#2d0b3a, #b5179e, #f72585, #ff9e00, #ffd60a",
        slatAmount: 14,
        slatAngle: 90,
        speed: 0.4,
    },
};

export const Hyperdrive: Story = {
    args: {
        washColors:
            "#ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff",
        slatAmount: 120,
        slatAngle: 30,
        speed: 10,
    },
};

export const BrushedSteel: Story = {
    args: {
        washColors: "#1b1f24, #5c6773, #c9d1d9, #3a424c",
        slatAmount: 70,
        speed: 0.3,
    },
};

export const Mint: Story = {
    args: {
        washColors: "#d8f3dc",
        slatAmount: 8,
        slatAngle: -30,
    },
};

export const Pinstripe: Story = {
    args: {
        slatAmount: 120,
        speed: 0.3,
        washColors: "#1b2a41, #324a5f, #8a99a8, #0c1821",
    },
};

export const FrostedGlass: Story = {
    args: {
        washColors: "#22d3ee, #4f46e5, #c4b5fd, #a5f3fc, #ffffff",
        slatAmount: 5,
        slatAngle: 90,
        slatFlip: true,
        slatShade: 0,
        speed: 2,
    },
};

export const Orchid: Story = {
    args: {
        washColors: "#3b0fd6, #a855f7, #e879f9, #1e1b8a, #ffffff",
        slatAmount: 4,
        slatFlip: true,
        slatShade: 0,
        speed: 2,
    },
};
