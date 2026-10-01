import {spawnSync} from "node:child_process";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";
import {findInstalledBrowser} from "./lib/browser.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, "..");
const remotionBin =
  process.platform === "win32"
    ? path.join(projectRoot, "node_modules", ".bin", "remotion.cmd")
    : path.join(projectRoot, "node_modules", ".bin", "remotion");

const browser = findInstalledBrowser();
const args = [
  "render",
  "src/index.ts",
  "MicroScene",
  "renders/observatory-above-clouds.mp4",
  "--codec=h264",
];

if (browser) {
  console.log(`Using installed browser: ${browser}`);
  args.push(`--browser-executable=${browser}`);
} else {
  console.log(
    "No installed Chrome/Chromium detected; using Remotion's managed browser.",
  );
}

const result = spawnSync(remotionBin, args, {
  cwd: projectRoot,
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
