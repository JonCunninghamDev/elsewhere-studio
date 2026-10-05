import assert from "node:assert/strict";
import {test} from "node:test";
import {
  atmosphereMotion,
  cameraMotion,
  lightVariation,
  normalizedProgress,
} from "../src/compositions/motion";

const EPSILON = 1e-10;

const nearlyEqual = (actual: number, expected: number) => {
  assert.ok(
    Math.abs(actual - expected) < EPSILON,
    `expected ${actual} to be approximately ${expected}`,
  );
};

test("normalized progress maps the first and last frames to loop endpoints", () => {
  assert.equal(normalizedProgress(0, 900), 0);
  assert.equal(normalizedProgress(899, 900), 1);
});

test("camera motion returns to its starting transform at the loop boundary", () => {
  const start = cameraMotion({
    progress: 0,
    width: 1920,
    cameraPush: 0.018,
    horizontalDrift: -0.008,
  });
  const end = cameraMotion({
    progress: 1,
    width: 1920,
    cameraPush: 0.018,
    horizontalDrift: -0.008,
  });

  nearlyEqual(start.scaleOffset, end.scaleOffset);
  nearlyEqual(start.driftX, end.driftX);
});

test("camera motion reaches the configured push near the midpoint", () => {
  const midpoint = cameraMotion({
    progress: 0.5,
    width: 1920,
    cameraPush: 0.018,
    horizontalDrift: -0.008,
  });

  nearlyEqual(midpoint.scaleOffset, 0.018);
  nearlyEqual(midpoint.driftX, 0);
});

test("atmosphere layers and light variation are continuous across the loop", () => {
  const startAtmosphere = atmosphereMotion(0);
  const endAtmosphere = atmosphereMotion(1);

  for (const key of Object.keys(startAtmosphere) as Array<
    keyof typeof startAtmosphere
  >) {
    nearlyEqual(startAtmosphere[key], endAtmosphere[key]);
  }

  nearlyEqual(lightVariation(0), lightVariation(1));
});

test("light variation stays restrained", () => {
  const samples = Array.from({length: 181}, (_, index) =>
    lightVariation(index / 180),
  );

  assert.ok(Math.min(...samples) > 0.3);
  assert.ok(Math.max(...samples) < 0.95);
});
