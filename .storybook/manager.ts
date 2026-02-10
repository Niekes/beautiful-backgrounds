import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

addons.setConfig({
    theme: create({
        base: "light",
        brandTitle: "Beautiful Backgrounds",
        brandUrl: "https://github.com/niekes/beautiful-backgrounds",
        brandTarget: "_self",
    }),
});
