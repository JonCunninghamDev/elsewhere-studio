import type {FC} from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type {MicroSceneProps} from "../scenes/scene-schema";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const MicroScene: FC<MicroSceneProps> = ({scene}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, width} = useVideoConfig();

  const progress = interpolate(
    frame,
    [0, Math.max(durationInFrames - 1, 1)],
    [0, 1],
    clamp,
  );

  // Start slightly oversized so the drift never exposes an edge.
  const baseScale = 1.045;
  const scale = baseScale + scene.motion.cameraPush * progress;
  const driftX = width * scene.motion.horizontalDrift * progress;

  // Deterministic layered sine waves produce organic-looking light variation
  // without random values that could make renders non-reproducible.
  const flickerWave =
    0.55 +
    Math.sin(frame * 0.17) * 0.25 +
    Math.sin(frame * 0.047 + 1.7) * 0.2;
  const glowOpacity = scene.motion.lightFlicker * flickerWave;

  const cloudDrift = interpolate(progress, [0, 1], [-6, 8], clamp);

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
          transform: `translate3d(${driftX}px, 0, 0) scale(${scale})`,
          transformOrigin: "50% 52%",
        }}
      />

      <AbsoluteFill
        style={{
          opacity: scene.motion.atmosphere,
          transform: `translate3d(${cloudDrift}%, 0, 0)`,
          background:
            "radial-gradient(ellipse at 22% 65%, rgba(226,232,240,0.30) 0%, rgba(226,232,240,0.08) 30%, transparent 55%), radial-gradient(ellipse at 76% 72%, rgba(203,213,225,0.22) 0%, rgba(203,213,225,0.06) 32%, transparent 58%)",
          filter: "blur(18px)",
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
