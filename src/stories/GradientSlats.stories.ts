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
                speed=${args.speed}
                style="width: 100%; height: 500px; border-radius: 15px"
            ></bb-gradient-slats>
        `;
    },
    argTypes: {
        washColors: { control: "text" },
        slatAmount: { control: { type: "range", min: 2, max: 120, step: 1 } },
        slatAngle: { control: { type: "range", min: -90, max: 90, step: 1 } },
        speed: { control: { type: "range", min: 0, max: 5, step: 0.05 } },
    },
    args: {
        washColors: "#c41e3a, #e0218a, #6a2c9e, #3b4fa8, #f5c800",
        slatAmount: 27,
        slatAngle: 0,
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
