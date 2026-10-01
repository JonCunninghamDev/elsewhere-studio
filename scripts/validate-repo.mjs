import fs from "node:fs";

const requiredFiles = [
  "README.md",
  "AGENTS.md",
  "engineering-policy.json",
  "docs/branching.md",
  ".github/workflows/ci.yml",
  "package.json",
  "tsconfig.json",
  "src/index.ts",
  "src/Root.tsx",
  "src/scenes/scene-schema.ts",
  "src/scenes/observatory-above-clouds/scene.json",
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    throw new Error(`Required repository file is missing: ${file}`);
  }
}

const policy = JSON.parse(fs.readFileSync("engineering-policy.json", "utf8"));

const expected = {
  repository: "JonCunninghamDev/engineering-platform",
  version: "v1.0.0",
  commit: "b107c9306161b395cbcaffebb55e47850b999560",
};

for (const [key, value] of Object.entries(expected)) {
  if (policy.platform?.[key] !== value) {
    throw new Error(`Unexpected platform ${key}: ${policy.platform?.[key]}`);
  }
}

if (policy.branches?.release !== "main") {
  throw new Error("Release branch must be main.");
}
if (policy.branches?.integration !== "develop") {
  throw new Error("Integration branch must be develop.");
}

const prefixes = policy.branches?.temporary_prefixes ?? [];
for (const prefix of ["feature/", "fix/", "agent/"]) {
  if (!prefixes.includes(prefix)) {
    throw new Error(`Missing temporary branch prefix: ${prefix}`);
  }
}

if (policy.delivery?.direct_release_writes !== false) {
  throw new Error("Direct release writes must remain disabled.");
}
if (policy.delivery?.release_route !== "integration_to_release") {
  throw new Error("Release route must remain integration_to_release.");
}
if (policy.delivery?.hotfix_route !== "integration_first") {
  throw new Error("Hotfix route must remain integration_first.");
}

const eventName = process.env.GITHUB_EVENT_NAME;
const base = process.env.GITHUB_BASE_REF;
const head = process.env.GITHUB_HEAD_REF;

if (eventName === "pull_request") {
  if (base === "develop") {
    if (!head || !prefixes.some((prefix) => head.startsWith(prefix))) {
      throw new Error(
        `PRs to develop must come from an allowed temporary branch; received ${head || "<empty>"}.`,
      );
    }
  } else if (base === "main") {
    if (head !== "develop") {
      throw new Error(
        `Only develop may be promoted to main; received ${head || "<empty>"}.`,
      );
    }
  } else {
    throw new Error(`Unsupported pull-request base branch: ${base || "<empty>"}.`);
  }
}

console.log("Elsewhere Studio repository policy validation passed.");
