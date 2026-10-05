import type {FC} from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  atmosphereMotion,
  cameraMotion,
  lightVariation,
  normalizedProgress,
} from "./motion";
import type {MicroSceneProps} from "../scenes/scene-schema";

export const MicroScene: FC<MicroSceneProps> = ({scene}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, width} = useVideoConfig();

  const progress = normalizedProgress(frame, durationInFrames);
  const camera = cameraMotion({
    progress,
    width,
    cameraPush: scene.motion.cameraPush,
    horizontalDrift: scene.motion.horizontalDrift,
  });
  const atmosphere = atmosphereMotion(progress);
  const glowOpacity =
    scene.motion.lightFlicker * Math.max(0, lightVariation(progress));

  // Start slightly oversized so the subtle cyclic drift never exposes an edge.
  const baseScale = 1.045;
  const scale = baseScale + camera.scaleOffset;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#111827",
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile(scene.source)}
        style={{
          position: "absolute",
          inset: "-3%",
          width: "106%",
          height: "106%",
          objectFit: "cover",
          transform: `translate3d(${camera.driftX}px, 0, 0) scale(${scale})`,
          transformOrigin: "50% 52%",
        }}
      />

      <AbsoluteFill
        style={{
          opacity: scene.motion.atmosphere * 0.7,
          transform: `translate3d(${atmosphere.farX}%, ${atmosphere.farY}%, 0)`,
          background:
            "radial-gradient(ellipse at 70% 68%, rgba(203,213,225,0.20) 0%, rgba(203,213,225,0.05) 34%, transparent 62%)",
          filter: "blur(28px)",
          mixBlendMode: "screen",
        }}
      />

      <AbsoluteFill
        style={{
          opacity: scene.motion.atmosphere,
          transform: `translate3d(${atmosphere.nearX}%, ${atmosphere.nearY}%, 0)`,
          background:
            "radial-gradient(ellipse at 20% 66%, rgba(226,232,240,0.28) 0%, rgba(226,232,240,0.08) 30%, transparent 58%), radial-gradient(ellipse at 78% 73%, rgba(226,232,240,0.18) 0%, rgba(226,232,240,0.04) 34%, transparent 62%)",
          filter: "blur(20px)",
          mixBlendMode: "screen",
        }}
      />

      <AbsoluteFill
        style={{
          opacity: glowOpacity,
          background:
            "radial-gradient(circle at 47% 58%, rgba(255,210,145,0.75) 0%, rgba(255,184,92,0.28) 22%, transparent 48%)",
          mixBlendMode: "screen",
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(3,7,18,0.18) 72%, rgba(3,7,18,0.5) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
