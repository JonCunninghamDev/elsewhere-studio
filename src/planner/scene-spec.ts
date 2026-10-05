import {z} from "zod";

export const MotionIntensitySchema = z.enum(["minimal", "subtle", "moderate"]);

export const MotionElementKindSchema = z.enum([
  "steam",
  "clouds",
  "rain",
  "snow",
  "lampGlow",
  "fireplace",
  "waterfall",
  "curtains",
  "foliage",
]);

export const SceneSpecSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  prompt: z.string().min(1),
  visual: z.object({
    setting: z.string().min(1),
    environment: z.enum(["indoor", "outdoor", "mixed"]),
    timeOfDay: z.enum(["day", "sunset", "night", "dawn", "unspecified"]),
    weather: z.enum(["clear", "cloudy", "rain", "snow", "storm", "unspecified"]),
    mood: z.array(z.string().min(1)).min(1),
    style: z.enum(["ambient", "cinematic", "illustrated", "photoreal"]),
  }),
  duration: z.object({
    seconds: z.number().int().positive(),
    loopablePreviewSeconds: z.number().int().positive().max(120),
  }),
  output: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    fps: z.number().int().min(1).max(60),
    platform: z.literal("youtube"),
  }),
  motion: z.object({
    intensity: MotionIntensitySchema,
    camera: z.object({
      enabled: z.boolean(),
      push: z.number().min(0).max(0.05),
      horizontalDrift: z.number().min(0).max(0.03),
    }),
    elements: z
      .array(
        z.object({
          kind: MotionElementKindSchema,
          priority: z.number().int().min(1).max(3),
          subtlety: MotionIntensitySchema,
        }),
      )
      .max(4),
  }),
  audio: z.object({
    ambience: z.array(z.string().min(1)),
    music: z.enum(["none", "soft"]),
  }),
  publishing: z.object({
    suggestedTitle: z.string().min(1),
    suggestedDescriptionSeed: z.string().min(1),
    thumbnailPrompt: z.string().min(1),
  }),
});

export type SceneSpec = z.infer<typeof SceneSpecSchema>;
export type MotionIntensity = z.infer<typeof MotionIntensitySchema>;
export type MotionElementKind = z.infer<typeof MotionElementKindSchema>;
