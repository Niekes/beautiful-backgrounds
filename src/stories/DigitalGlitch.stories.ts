import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "../components/digitalGlitch";

const meta: Meta = {
    title: "Backgrounds/Digital Glitch",
    component: "bb-digital-glitch",
    render: (args) => {
        return html`
            <bb-digital-glitch
                speed=${args.speed}
                characters=${args.characters}
                icons=${args.icons}
                randomness=${args.randomness}
                font-size=${args.fontSize}
                font-color-hue-start=${args.fontColorHueStart}
                font-color-hue-end=${args.fontColorHueEnd}
                font-color-saturation-start=${args.fontColorSaturationStart}
                font-color-saturation-end=${args.fontColorSaturationEnd}
                font-color-lightness-start=${args.fontColorLightnessStart}
                font-color-lightness-end=${args.fontColorLightnessEnd}
                bg-colors=${args.bgColors}
                bg-angle=${args.bgAngle}
                clean-trail=${args.cleanTrail}
                font-colors=${args.fontColors}
                style="width: 100%; height: 500px; border-radius: 15px"
            ></bb-digital-glitch>
        `;
    },
    argTypes: {
        speed: { control: { type: "range", min: 1, max: 30, step: 1 } },
        randomness: { control: { type: "range", min: 0, max: 1, step: 0.005 } },
        fontSize: { control: { type: "range", min: 8, max: 72 } },
        fontColorHueStart: { control: { type: "range", min: 0, max: 360 } },
        fontColorHueEnd: { control: { type: "range", min: 0, max: 360 } },
        fontColorSaturationStart: {
            control: { type: "range", min: 0, max: 100 },
        },
        fontColorSaturationEnd: {
            control: { type: "range", min: 0, max: 100 },
        },
        fontColorLightnessStart: {
            control: { type: "range", min: 0, max: 100 },
        },
        fontColorLightnessEnd: { control: { type: "range", min: 0, max: 100 } },
        cleanTrail: { control: "boolean" },
        fontColors: { control: "text" },
        bgColors: { control: "text" },
        bgAngle: { control: { type: "range", min: 0, max: 360, step: 1 } },
        icons: { control: "text" },
    },
    args: {
        bgColors: "#000, #000",
        bgAngle: 0,
        characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        icons: "",
        randomness: 0.98,
        fontSize: 16,
        fontColorHueStart: 60,
        fontColorHueEnd: 150,
        fontColorSaturationStart: 90,
        fontColorSaturationEnd: 100,
        fontColorLightnessStart: 50,
        fontColorLightnessEnd: 50,
        speed: 10,
        cleanTrail: true,
        fontColors: "",
    },
};

export default meta;
type Story = StoryObj;

export const ClassicGlitch: Story = {};

export const WithIcons: Story = {
    args: {
        icons: "star, heart, zap, code",
        characters: "01",
        fontColorHueStart: 180,
        fontColorHueEnd: 220,
    },
};

export const CyberpunkPink: Story = {
    args: {
        characters: "ΨΦΧΩΣΠΛΔΓΒΑ01100110ЯΞ",
        fontColorHueStart: 300,
        fontColorHueEnd: 340,
        bgColors: "#570044, #570099",
    },
};

export const PurpleRain: Story = {
    args: {
        bgColors: "#000000, #000000",
        characters: "|",
        randomness: 0.98,
        fontSize: 12,
        fontColorHueStart: 261,
        fontColorHueEnd: 289,
        fontColorSaturationStart: 87,
        speed: 5.4,
        fontColorLightnessStart: 43,
        fontColorLightnessEnd: 55,
    },
};

export const NeonBlue: Story = {
    args: {
        characters: "ABCDEF0123456789",
        fontColorHueStart: 180,
        fontColorHueEnd: 210,
        fontColorSaturationStart: 90,
        fontColorSaturationEnd: 100,
        fontColorLightnessStart: 60,
        fontColorLightnessEnd: 70,
        bgColors: "#001122, #001122",
        speed: 6,
        fontSize: 18,
        randomness: 0.9,
    },
};

export const OrangeFire: Story = {
    args: {
        characters: "▲◆●★",
        fontColorHueStart: 30,
        fontColorHueEnd: 45,
        fontColorSaturationStart: 80,
        fontColorSaturationEnd: 100,
        fontColorLightnessStart: 50,
        fontColorLightnessEnd: 60,
        bgColors: "#220000, #220000",
        speed: 7,
        fontSize: 22,
        randomness: 0.92,
    },
};

export const GhostWhite: Story = {
    args: {
        characters: "░▒▓■□▲▼",
        fontColorHueStart: 0,
        fontColorHueEnd: 0,
        fontColorSaturationStart: 0,
        fontColorSaturationEnd: 0,
        fontColorLightnessStart: 80,
        fontColorLightnessEnd: 100,
        bgColors: "#111111, #111111",
        speed: 4,
        fontSize: 16,
        randomness: 0.98,
    },
};

export const RainbowChaos: Story = {
    args: {
        characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        fontColorHueStart: 0,
        fontColorHueEnd: 360,
        fontColorSaturationStart: 70,
        fontColorSaturationEnd: 100,
        fontColorLightnessStart: 50,
        fontColorLightnessEnd: 50,
        bgColors: "#000000, #000000",
        speed: 9,
        fontSize: 14,
        randomness: 0.99,
    },
};

export const MatrixRed: Story = {
    args: {
        fontColors: "#ff0000, #aa0000, #550000",
        bgColors: "#110000, #110000",
        fontSize: 18,
        speed: 12,
    },
};

export const IconStorm: Story = {
    args: {
        icons: "star, zap, flame, skull, ghost",
        characters: "01",
        fontColorHueStart: 0,
        fontColorHueEnd: 60,
        bgColors: "#0a0a0a, #0a0a0a",
        speed: 14,
        fontSize: 20,
        randomness: 0.96,
    },
};

export const MixedGlyphs: Story = {
    args: {
        icons: "heart, code, terminal, cpu",
        characters: "01アイウ",
        fontColorHueStart: 120,
        fontColorHueEnd: 200,
        bgColors: "#001a00, #001a00",
        speed: 8,
        fontSize: 18,
        randomness: 0.97,
    },
};
