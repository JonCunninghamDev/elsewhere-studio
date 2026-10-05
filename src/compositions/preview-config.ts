import type {SceneSpec} from "../planner/scene-spec";

export const PREVIEW_SECONDS = 30;

export const previewDurationInFrames = (scene: SceneSpec) =>
  PREVIEW_SECONDS * scene.output.fps;

export const previewOutputPath = (scene: SceneSpec) =>
  `renders/${scene.id}-preview.mp4`;
