import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { color } from "d3";
import { html } from "lit";
import "./digitalRain";

const meta: Meta = {
    title: "Backgrounds/DigitalRain",
    component: "bb-digital-rain",
    render: (args) => {
        const c = color(args.backgroundColor)?.rgb();
        const bgColor = c ? `${c.r}, ${c.g}, ${c.b}` : "0, 0, 0";

        return html`
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
                data-background-color=${bgColor}
                style="width: 100%; height: 450px; display: flex;"
            ></bb-digital-rain>
        `;
    },
    argTypes: {
        backgroundColor: { control: "color" },
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
        fps: 30,
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

export const CyberpunkPink: Story = {
    args: {
        characters:
            "ΨΦΧΩΣΠΛΔΓΒΑ01100110ЯΞΨΦΧΩΞΠΛΔΓβγδεζηθικλμνξοπρστυφχψωАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ∀∃∄∈∉∋∌∐∑",
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
        fontColorHueStart: 267,
        fontColorHueEnd: 278,
        fontColorSaturationStart: 100,
    },
};
