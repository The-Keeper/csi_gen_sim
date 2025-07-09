import { defineConfig, presetUno, presetIcons } from "unocss";
import extractorSvelte from "@unocss/extractor-svelte";
import { FileSystemIconLoader } from "@iconify/utils/lib/loader/node-loaders";

export default defineConfig({
    extractors: [extractorSvelte()],
    shortcuts: [
        {
            btn: "font-medium py-2 px-4 rounded text-black",
            main: "text-gray-8 bg-gray-2 dark:text-gray-2 dark:bg-gray-8",
        },
    ],
    presets: [
        presetUno({
            dark: {
                dark: '[data-theme="dark"]',
                light: '[data-theme="light"]',
            },
        }),
        presetIcons({
            collections: {
                custom: {
                    // do not remove LF: testing trimCustomSvg on universal icon loader
                    circle: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<circle cx="60" cy="60" r="50"/>
</svg>
`,
                },
                customfsl: FileSystemIconLoader("./icons", (svg) =>
                    svg.replace("<svg ", '<svg fill="currentColor" '),
                ),
            },
            extraProperties: {
                display: "inline-block",
                "vertical-align": "middle",
            },
        }),
    ],
});
