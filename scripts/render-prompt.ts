import {mkdirSync, writeFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";
import {promptToSceneSpec} from "../src/planner/prompt-to-scene";
import {previewOutputPath} from "../src/compositions/preview-config";
import {findInstalledBrowser} from "./lib/browser.mjs";

const prompt = process.argv.slice(2).join(" ").trim();

if (!prompt) {
  console.error('Usage: npm run render:prompt -- "your scene prompt"');
  process.exit(1);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, "..");
const scene = promptToSceneSpec(prompt);
const propsDir = path.join(projectRoot, ".tmp");
mkdirSync(propsDir, {recursive: true});
mkdirSync(path.join(projectRoot, "renders"), {recursive: true});

const propsPath = path.join(propsDir, `${scene.id}-preview-props.json`);
writeFileSync(propsPath, JSON.stringify({scene}, null, 2));

console.log("Planned scene:");
console.log(JSON.stringify(scene, null, 2));

const remotionBin =
  process.platform === "win32"
    ? path.join(projectRoot, "node_modules", ".bin", "remotion.cmd")
    : path.join(projectRoot, "node_modules", ".bin", "remotion");

const outputPath = previewOutputPath(scene);
const args = [
  "render",
  "src/index.ts",
  "PromptScene",
  outputPath,
  "--codec=h264",
  `--props=${propsPath}`,
];

const browser = findInstalledBrowser();
if (browser) {
  console.log(`Using installed browser: ${browser}`);
  args.push(`--browser-executable=${browser}`);
}

console.log(`Rendering 30-second preview to ${outputPath}`);
const result = spawnSync(remotionBin, args, {
  cwd: projectRoot,
  stdio: "inherit",
  env: process.env,
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
