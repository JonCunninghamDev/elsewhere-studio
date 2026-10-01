import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {test} from "node:test";
import {SceneManifestSchema} from "../src/scenes/scene-schema";

const samplePath = "src/scenes/observatory-above-clouds/scene.json";

const readSample = () =>
  JSON.parse(readFileSync(samplePath, "utf8")) as unknown;

test("sample scene manifest is valid and renders 30 seconds at 30fps", () => {
  const scene = SceneManifestSchema.parse(readSample());

  assert.equal(scene.schemaVersion, 1);
  assert.equal(scene.id, "observatory-above-clouds");
  assert.equal(scene.durationSeconds * scene.fps, 900);
  assert.equal(scene.width, 1920);
  assert.equal(scene.height, 1080);
});

test("Studio authoring defaults stay aligned with the sample manifest", () => {
  const scene = SceneManifestSchema.parse(readSample());
  const rootSource = readFileSync("src/Root.tsx", "utf8");

  const expectedFragments = [
    `schemaVersion: ${scene.schemaVersion}`,
    `id: "${scene.id}"`,
    `title: "${scene.title}"`,
    `durationSeconds: ${scene.durationSeconds}`,
    `fps: ${scene.fps}`,
    `width: ${scene.width}`,
    `height: ${scene.height}`,
    `source: "${scene.source}"`,
    `cameraPush: ${scene.motion.cameraPush}`,
    `horizontalDrift: ${scene.motion.horizontalDrift}`,
    `atmosphere: ${scene.motion.atmosphere}`,
    `lightFlicker: ${scene.motion.lightFlicker}`,
  ];

  for (const fragment of expectedFragments) {
    assert.ok(
      rootSource.includes(fragment),
      `Studio default props are out of sync with scene.json: missing ${fragment}`,
    );
  }
});

test("motion limits reject animation that is too aggressive for micro-motion", () => {
  const raw = readSample();
  assert.equal(typeof raw, "object");
  assert.ok(raw !== null);

  const invalid = structuredClone(raw) as {
    motion: {cameraPush: number};
  };
  invalid.motion.cameraPush = 0.5;

  assert.throws(() => SceneManifestSchema.parse(invalid));
});
