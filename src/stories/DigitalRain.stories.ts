import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { color } from "d3";
import { html } from "lit";
import "./digitalRain";

const meta: Meta = {
    title: "Backgrounds/Digital Rain",
    component: "bb-digital-rain",
    render: (args) => {
        const c = color(args.backgroundColor)?.rgb();
        const bgColor = c ? `${c.r}, ${c.g}, ${c.b}` : "0, 0, 0";

        return html`
            <bb-digital-rain
                speed=${args.speed}
                characters=${args.characters}
                randomness=${args.randomness}
                font-size=${args.fontSize}
                font-color-hue-start=${args.fontColorHueStart}
                font-color-hue-end=${args.fontColorHueEnd}
                font-color-saturation-start=${args.fontColorSaturationStart}
                font-color-saturation-end=${args.fontColorSaturationEnd}
                font-color-lightness-start=${args.fontColorLightnessStart}
                font-color-lightness-end=${args.fontColorLightnessEnd}
                background-color=${bgColor}
                trail-opacity=${args.trailOpacity}
                font-colors=${args.fontColors}
                style="width: 100%; height: 450px; display: flex;"
            ></bb-digital-rain>
        `;
    },
    argTypes: {
        backgroundColor: { control: "color" },
        speed: { control: { type: "range", min: 0, max: 10, step: 0.1 } },
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
        trailOpacity: {
            control: { type: "range", min: 0.001, max: 1, step: 0.001 },
        },
        fontColors: { control: "text" },
    },
    args: {
        characters:
            'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ13579ｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝZ:."¦=*+-<>|ﾘçδ╘',
        randomness: 0.975,
        fontSize: 24,
        fontColorHueStart: 100,
        fontColorHueEnd: 140,
        fontColorSaturationStart: 90,
        fontColorSaturationEnd: 100,
        fontColorLightnessStart: 50,
        fontColorLightnessEnd: 50,
        speed: 10,
        backgroundColor: "#000",
        trailOpacity: 0.1,
        fontColors: "",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    args: {
        characters: "ｱｲｳｴｵｶｷｸｹｺ",
        fontColorHueStart: 120,
        fontColorHueEnd: 140,
        fontColorSaturationStart: 80,
        fontColorSaturationEnd: 100,
        fontColorLightnessStart: 40,
        fontColorLightnessEnd: 60,
        backgroundColor: "#000000",
        speed: 8,
        fontSize: 20,
        randomness: 0.95,
        trailOpacity: 0.08,
    },
};

export const CyberpunkPink: Story = {
    args: {
        characters: "ΨΦΧΩΣΠΛΔΓΒΑ01100110ЯΞ",
        fontColorHueStart: 300,
        fontColorHueEnd: 340,
        backgroundColor: "#570044",
    },
};

export const PurpleRain: Story = {
    args: {
        backgroundColor: "#000000",
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
        backgroundColor: "#001122",
        speed: 6,
        fontSize: 18,
        randomness: 0.9,
        trailOpacity: 0.12,
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
        backgroundColor: "#220000",
        speed: 7,
        fontSize: 22,
        randomness: 0.92,
        trailOpacity: 0.15,
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
        backgroundColor: "#111111",
        speed: 4,
        fontSize: 16,
        randomness: 0.98,
        trailOpacity: 0.05,
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
        backgroundColor: "#000000",
        speed: 9,
        fontSize: 14,
        randomness: 0.99,
        trailOpacity: 0.09,
    },
};

export const MatrixRed: Story = {
    args: {
        fontColors: "#ff0000, #aa0000, #550000",
        backgroundColor: "#110000",
        fontSize: 18,
        speed: 12,
    },
};
