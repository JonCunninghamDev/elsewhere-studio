import {promptToSceneSpec} from "../src/planner/prompt-to-scene";

const prompt = process.argv.slice(2).join(" ").trim();

if (!prompt) {
  console.error('Usage: npm run plan-scene -- "your scene prompt"');
  process.exit(1);
}

console.log(JSON.stringify(promptToSceneSpec(prompt), null, 2));
