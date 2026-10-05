import assert from "node:assert/strict";
import {test} from "node:test";
import {promptToSceneSpec} from "../src/planner/prompt-to-scene";

const workstationPrompt =
  "Cozy home workstation at night. Coffee steaming. Rain outside the window. Warm lamp. Calm focus atmosphere. 2-hour video.";

test("workstation prompt produces the expected structured scene plan", () => {
  const spec = promptToSceneSpec(workstationPrompt);

  assert.equal(spec.visual.setting, "home workstation");
  assert.equal(spec.visual.environment, "mixed");
  assert.equal(spec.visual.timeOfDay, "night");
  assert.equal(spec.visual.weather, "rain");
  assert.deepEqual(spec.visual.mood, ["cozy", "calm", "focus"]);
  assert.equal(spec.duration.seconds, 7200);
  assert.equal(spec.duration.loopablePreviewSeconds, 30);
  assert.equal(spec.output.platform, "youtube");
  assert.equal(spec.output.width, 1920);
  assert.equal(spec.output.height, 1080);
  assert.equal(spec.output.fps, 30);
  assert.equal(spec.motion.intensity, "subtle");
  assert.equal(spec.motion.camera.push, 0.014);
  assert.equal(spec.motion.camera.horizontalDrift, 0.007);
  assert.deepEqual(
    spec.motion.elements.map((element) => element.kind),
    ["steam", "rain", "lampGlow"],
  );
  assert.deepEqual(spec.audio.ambience, ["light rain", "room tone"]);
  assert.equal(spec.audio.music, "none");
});

test("planner caps micro-animation targets at four", () => {
  const spec = promptToSceneSpec(
    "Cozy desk with coffee steam, rain, clouds, lamp, fireplace, curtains, trees and waterfall.",
  );

  assert.equal(spec.motion.elements.length, 4);
});

test("planner uses safe defaults for an underspecified prompt", () => {
  const spec = promptToSceneSpec("Quiet reading corner.");

  assert.equal(spec.duration.seconds, 3600);
  assert.equal(spec.duration.loopablePreviewSeconds, 30);
  assert.equal(spec.motion.intensity, "subtle");
  assert.ok(spec.motion.camera.push <= 0.05);
  assert.ok(spec.motion.camera.horizontalDrift <= 0.03);
  assert.deepEqual(spec.visual.mood, ["calm"]);
});

test("planner parses minute durations", () => {
  const spec = promptToSceneSpec("Calm rainy cafe for 90 minutes.");
  assert.equal(spec.duration.seconds, 5400);
});
