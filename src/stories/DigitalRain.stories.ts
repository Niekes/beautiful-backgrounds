import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./digitalRain";

const meta: Meta = {
    title: "Backgrounds/DigitalRain",
    component: "bb-digital-rain",
    tags: ["autodocs"],
    render: (args) => html`
        <bb-digital-rain
            data-fps=${args.fps}
            data-characters=${args.characters}
            data-randomness=${args.randomness}
            data-font-size=${args.fontSize}
            data-font-color-hue-start=${args.fontColorHueStart}
            data-font-color-hue-end=${args.fontColorHueEnd}
            data-font-color-saturation-start=${args.fontColorSaturationStart}
            data-font-color-saturation-end=${args.fontColorSaturationEnd}
            data-font-color-lightness-start=${args.fontColorLightnessStart}
            data-font-color-lightness-end=${args.fontColorLightnessEnd}
            data-background-color=${args.backgroundColor}
            style="width: 100%; height: 600px; display: block;"
        ></bb-digital-rain>
    `,
    argTypes: {
        backgroundColor: { control: "text" },
        fps: { control: { type: "range", min: 0, max: 120 } },
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
    },
    args: {
        fps: 30,
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
        backgroundColor: "0, 0, 0",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const CyberpunkPink: Story = {
    args: {
        characters:
            "ΨΦΧΩΣΠΛΔΓΒΑ01100110ЯΞΨΦΧΩΞΠΛΔΓβγδεζηθικλμνξοπρστυφχψωАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ∀∃∄∈∉∋∌∐∑",
        fontColorHueStart: 300,
        fontColorHueEnd: 340,
        backgroundColor: "20, 0, 20",
    },
};
