import {z} from "zod";

export const MotionSchema = z.object({
  cameraPush: z.number().min(0).max(0.05),
  horizontalDrift: z.number().min(-0.03).max(0.03),
  atmosphere: z.number().min(0).max(1),
  lightFlicker: z.number().min(0).max(0.2),
});

export const SceneManifestSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  durationSeconds: z.number().positive().max(600),
  fps: z.number().int().min(1).max(60),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  source: z.string().min(1),
  motion: MotionSchema,
});

export const MicroScenePropsSchema = z.object({
  scene: SceneManifestSchema,
});

export type SceneManifest = z.infer<typeof SceneManifestSchema>;
export type MicroSceneProps = z.infer<typeof MicroScenePropsSchema>;
