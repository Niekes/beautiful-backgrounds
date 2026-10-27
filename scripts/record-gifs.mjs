// Records a short looping GIF of every background for the README, from the
// built Storybook. Run `npm run gifs`, which builds Storybook first.
import {
    createReadStream,
    existsSync,
    mkdirSync,
    writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import gifenc from "gifenc";
import { chromium } from "playwright";

// gifenc ships CommonJS only.
const { GIFEncoder, applyPalette, quantize } = gifenc;

const WIDTH = 400;
const HEIGHT = 225;
const FPS = 12;
const SECONDS = 3;
// Lets the trails build up before the first frame.
const WARM_UP_MS = 2000;

const STORIES = {
    "ambient-ribbon": [
        "bb-ambient-ribbon",
        "backgrounds-ambient-ribbon--signature-flow",
    ],
    "contour-flow": [
        "bb-contour-flow",
        "backgrounds-contour-flow--topographic-moss",
    ],
    "digital-rain": [
        "bb-digital-rain",
        "backgrounds-digital-rain--classic-matrix-rain",
    ],
    "hexagon-wave": [
        "bb-hexagon-wave",
        "backgrounds-hexagon-wave--honeycomb-pulsar",
    ],
    "light-shafts": ["bb-light-shafts", "backgrounds-light-shafts--crystal"],
    "liquid-lines": [
        "bb-liquid-lines",
        "backgrounds-liquid-lines--serpentine-flow",
    ],
    "neon-rails": [
        "bb-neon-rails",
        "backgrounds-neon-rails--cyber-grid-network",
    ],
    "smoke-ring": ["bb-smoke-ring", "backgrounds-smoke-ring--nebula"],
    "star-trail": ["bb-star-trail", "backgrounds-star-trail--galactic-vortex"],
};

const ROOT = "storybook-static";
const OUT = "assets/examples";
const TYPES = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".json": "application/json",
    ".css": "text/css",
};

function serve() {
    const server = createServer((req, res) => {
        const path = normalize(
            decodeURIComponent(new URL(req.url, "http://x").pathname),
        );
        const file = join(ROOT, path === "/" ? "index.html" : path);
        if (!file.startsWith(ROOT) || !existsSync(file)) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, {
            "content-type": TYPES[extname(file)] ?? "application/octet-stream",
        });
        createReadStream(file).pipe(res);
    });
    return new Promise((resolve) => server.listen(0, () => resolve(server)));
}

/** Reads the background's canvas as RGBA bytes. */
async function grab(page, tag) {
    const base64 = await page.evaluate((tag) => {
        const el = document.querySelector(tag);
        const { width, height } = el.canvas;
        const data = el.ctx.getImageData(0, 0, width, height).data;
        let binary = "";
        for (let i = 0; i < data.length; i += 0x8000) {
            binary += String.fromCharCode(...data.subarray(i, i + 0x8000));
        }
        return btoa(binary);
    }, tag);
    return new Uint8Array(Buffer.from(base64, "base64"));
}

async function record(page, port, name, [tag, id]) {
    await page.goto(
        `http://localhost:${port}/iframe.html?id=${id}&viewMode=story`,
    );
    const el = page.locator(tag);
    await el.waitFor();
    // The stories render at 100% x 500px with rounded corners; the GIF is a
    // plain rectangle of a fixed size.
    await el.evaluate(
        (node, [w, h]) => {
            node.style.width = `${w}px`;
            node.style.height = `${h}px`;
            node.style.borderRadius = "0";
            window.dispatchEvent(new Event("resize"));
        },
        [WIDTH, HEIGHT],
    );
    await page.waitForTimeout(WARM_UP_MS);

    const gif = GIFEncoder();
    for (let i = 0; i < FPS * SECONDS; i++) {
        const rgba = await grab(page, tag);
        const palette = quantize(rgba, 256);
        gif.writeFrame(applyPalette(rgba, palette), WIDTH, HEIGHT, {
            palette,
            delay: 1000 / FPS,
        });
        await page.waitForTimeout(1000 / FPS);
    }
    gif.finish();

    const file = `${OUT}/${name}.gif`;
    writeFileSync(file, gif.bytes());
    console.log(`${file}  ${(gif.bytes().length / 1024).toFixed(0)} kB`);
}

const server = await serve();
const browser = await chromium.launch();
const page = await browser.newPage({
    viewport: { width: 800, height: 600 },
    deviceScaleFactor: 1,
});
mkdirSync(OUT, { recursive: true });

try {
    for (const [name, story] of Object.entries(STORIES)) {
        await record(page, server.address().port, name, story);
    }
} finally {
    await browser.close();
    server.close();
}
