import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "../components/fluidMorph";

const meta: Meta = {
    title: "Backgrounds/Fluid Morph",
    component: "bb-fluid-morph",
    render: (args) => {
        return html`
            <bb-fluid-morph
                duration=${args.duration}
                colors=${args.colors}
                bg-colors=${args.bgColors}
                style="width: 100%; height: 500px; border-radius: 15px"
            ></bb-fluid-morph>
        `;
    },
    argTypes: {
        duration: { control: { type: "range", min: 0.5, max: 12, step: 0.5 } },
        colors: { control: "text" },
        bgColors: { control: "text" },
    },
    args: {
        duration: 4,
        colors: "#0d9488,#14b8a6,#2dd4bf,#5eead4,#99f6e4,#0f766e,#115e59",
        bgColors: "#042f2e",
    },
};

export default meta;
type Story = StoryObj;

export const TealLagoon: Story = {
    args: {
        colors: "#0d9488,#14b8a6,#2dd4bf,#5eead4,#99f6e4,#0f766e,#115e59",
        bgColors: "#042f2e",
        duration: 4,
    },
};

export const ClassicBlue: Story = {
    args: {
        colors: "#4f4fea,#0c27cf,#13269c,#242468,#2648e6,#2c31b0,#262689",
        bgColors: "#282886",
        duration: 4,
    },
};

export const Sunset: Story = {
    args: {
        colors: "#ff6b35,#f7c59f,#efefd0,#ff9f1c,#ffbf69,#cb997e,#a68a64",
        bgColors: "#1a0a00",
        duration: 5,
    },
};

export const Aurora: Story = {
    args: {
        colors: "#3a86ff,#8338ec,#ff006e,#fb5607,#ffbe0b,#06d6a0,#118ab2",
        bgColors: "#050a14",
        duration: 6,
    },
};

export const Midnight: Story = {
    args: {
        colors: "#0f2027,#203a43,#2c5364,#1a1a2e,#16213e,#0f3460,#533483",
        bgColors: "#020408",
        duration: 5,
    },
};

export const CoralReef: Story = {
    args: {
        colors: "#ff6f61,#ff9a8b,#ffcaa6,#ffd3b6,#a8e6cf,#56c596,#379683",
        bgColors: "#001a1a",
        duration: 4.5,
    },
};

export const NorthernLights: Story = {
    args: {
        colors: "#00c9ff,#92fe9d,#00b09b,#00d2ff,#3a7bd5,#00d2ff,#928dab",
        bgColors: "#020a14",
        duration: 7,
    },
};

export const Desert: Story = {
    args: {
        colors: "#c79081,#dfa579,#f7d9aa,#e8c39e,#d4a373,#b08968,#7f5539",
        bgColors: "#1a0f05",
        duration: 5.5,
    },
};

export const Monochrome: Story = {
    args: {
        colors: "#ffffff,#e0e0e0,#c0c0c0,#a0a0a0,#808080,#606060,#404040",
        bgColors: "#0a0a0a",
        duration: 4,
    },
};

export const Neon: Story = {
    args: {
        colors: "#ff00ff,#00ffff,#ffff00,#ff0080,#00ff80,#8000ff,#0080ff",
        bgColors: "#05000a",
        duration: 3,
    },
};

export const Pastel: Story = {
    args: {
        colors: "#ffd1dc,#ffb3c6,#ffc8dd,#ffafcc,#bde0fe,#a2d2ff,#cdb4db",
        bgColors: "#1a1420",
        duration: 6,
    },
};
