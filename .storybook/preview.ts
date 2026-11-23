import type { Preview } from "@storybook/web-components-vite";

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        docs: {
            codePanel: true,
        },

        actions: { disable: true },
        a11y: { disable: true },

        options: {
            showPanel: true,
            panelPosition: "bottom",
            selectedPanel: "storybook/controls/panel",
            // Backgrounds A to Z after the intro; examples keep their file order.
            storySort: {
                method: "alphabetical",
                order: ["Beautiful Backgrounds", "Backgrounds"],
            },
        },
    },
};

export default preview;
