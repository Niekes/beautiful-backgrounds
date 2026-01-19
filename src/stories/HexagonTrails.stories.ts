import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { color } from "d3";
import { html } from "lit";
import "./hexagonTrails";

const meta: Meta = {
    title: "Backgrounds/HexagonTrails",
    component: "bb-hexagon-trails",
    render: (args) => {
        const c = color(args.backgroundColor)?.rgb();
        const bgColor = c ? `${c.r}, ${c.g}, ${c.b}` : "0, 0, 0";

        return html`
            <bb-hexagon-trails
                background-color=${bgColor}
                style="width: 100%; height: 450px; display: flex;"
            ></bb-hexagon-trails>
        `;
    },
    argTypes: {
        backgroundColor: { control: "color" },
    },
    args: {
        backgroundColor: "#000",
    },
};

export default meta;
type Story = StoryObj;

export const Matrix: Story = {
    args: {
        backgroundColor: "#000",
    },
};
