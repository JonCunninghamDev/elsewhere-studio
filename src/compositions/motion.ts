const TAU = Math.PI * 2;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const normalizedProgress = (
  frame: number,
  durationInFrames: number,
): number => {
  const lastFrame = Math.max(durationInFrames - 1, 1);
  return clamp01(frame / lastFrame);
};

export const loopPhase = (progress: number): number =>
  clamp01(progress) * TAU;

export const cameraMotion = ({
  progress,
  width,
  cameraPush,
  horizontalDrift,
}: {
  progress: number;
  width: number;
  cameraPush: number;
  horizontalDrift: number;
}) => {
  const phase = loopPhase(progress);

  // A cosine envelope starts and ends at rest while still reaching the
  // configured push at the midpoint of the scene.
  const pushEnvelope = (1 - Math.cos(phase)) / 2;

  return {
    scaleOffset: cameraPush * pushEnvelope,
    driftX: width * horizontalDrift * Math.sin(phase),
  };
};

export const atmosphereMotion = (progress: number) => {
  const phase = loopPhase(progress);

  return {
    nearX: Math.sin(phase) * 3.2,
    nearY: Math.sin(phase * 2 + 0.65) * 0.8,
    farX: Math.sin(phase + Math.PI) * 1.8,
    farY: Math.sin(phase * 2 + 2.1) * 0.5,
  };
};

export const lightVariation = (progress: number) => {
  const phase = loopPhase(progress);

  // Integer harmonics keep the endpoints identical while the different
  // frequencies avoid a mechanical single-wave pulse.
  const slowBreath = Math.sin(phase * 2 - 0.35) * 0.18;
  const softFlutter = Math.sin(phase * 5 + 1.4) * 0.08;
  const fineVariation = Math.sin(phase * 9 + 2.2) * 0.035;

  return 0.62 + slowBreath + softFlutter + fineVariation;
};
