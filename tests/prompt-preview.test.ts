import assert from "node:assert/strict";
import {test} from "node:test";
import {promptToSceneSpec} from "../src/planner/prompt-to-scene";
import {
  PREVIEW_SECONDS,
  previewDurationInFrames,
  previewOutputPath,
} from "../src/compositions/preview-config";

test("prompt scenes render a fixed 30-second preview", () => {
  const scene = promptToSceneSpec(
    "Cozy workstation at night with rain, steam and a warm lamp. 2-hour focus video.",
  );

  assert.equal(PREVIEW_SECONDS, 30);
  assert.equal(previewDurationInFrames(scene), 900);
  assert.equal(previewOutputPath(scene), `renders/${scene.id}-preview.mp4`);
});

test("long-form duration does not inflate preview render length", () => {
  const scene = promptToSceneSpec(
    "Quiet cabin at night with snow and fireplace. 3-hour sleep video.",
  );

  assert.equal(scene.duration.seconds, 10800);
  assert.equal(previewDurationInFrames(scene), 900);
});
