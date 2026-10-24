// Writes the README's health and coverage badges into .github/badges.
// Run `npm run coverage` first: the coverage badge reads its summary.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const dir = ".github/badges";
mkdirSync(dir, { recursive: true });

writeFileSync(
    `${dir}/health.svg`,
    execFileSync("fallow", [
        "health",
        "--format",
        "badge",
        "--coverage",
        "coverage/coverage-final.json",
    ]),
);

// A shields.io endpoint badge, read by the README.
const summary = JSON.parse(
    readFileSync("coverage/coverage-summary.json", "utf8"),
);
const pct = summary.total.lines.pct;
const color = pct >= 90 ? "brightgreen" : pct >= 75 ? "yellow" : "red";
writeFileSync(
    `${dir}/coverage.json`,
    `${JSON.stringify({ schemaVersion: 1, label: "coverage", message: `${pct}%`, color })}\n`,
);
