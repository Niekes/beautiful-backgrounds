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
        },
    },
};

export default preview;
