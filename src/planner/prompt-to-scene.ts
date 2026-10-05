import {
  type MotionElementKind,
  type MotionIntensity,
  SceneSpecSchema,
  type SceneSpec,
} from "./scene-spec";

const includesAny = (text: string, terms: string[]) =>
  terms.some((term) => text.includes(term));

const toId = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "ambient-scene";

const detectDurationSeconds = (text: string) => {
  const hourMatch = text.match(/(\d+(?:\.\d+)?)\s*[- ]?hours?/i);
  if (hourMatch) return Math.round(Number(hourMatch[1]) * 3600);

  const minuteMatch = text.match(/(\d+(?:\.\d+)?)\s*[- ]?minutes?/i);
  if (minuteMatch) return Math.round(Number(minuteMatch[1]) * 60);

  return 3600;
};

const titleCase = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");

const motionDefaults: Record<
  MotionIntensity,
  {push: number; horizontalDrift: number}
> = {
  minimal: {push: 0.006, horizontalDrift: 0.003},
  subtle: {push: 0.014, horizontalDrift: 0.007},
  moderate: {push: 0.022, horizontalDrift: 0.012},
};

const uniqueMotionElements = (
  entries: Array<{
    kind: MotionElementKind;
    priority: number;
    subtlety: MotionIntensity;
  }>,
) => {
  const seen = new Set<MotionElementKind>();

  return entries.filter((entry) => {
    if (seen.has(entry.kind)) return false;
    seen.add(entry.kind);
    return true;
  });
};

export const promptToSceneSpec = (prompt: string): SceneSpec => {
  const normalized = prompt.trim().toLowerCase();

  const setting =
    includesAny(normalized, ["forest"]) &&
    includesAny(normalized, ["waterfall", "flowing water"])
      ? "forest waterfall"
      : includesAny(normalized, [
          "workstation",
          "desk",
          "office",
          "computer",
          "laptop",
        ])
        ? "workstation"
        : includesAny(normalized, ["cabin", "wood stove"])
      ? "cabin"
      : includesAny(normalized, ["cafe", "coffee shop"])
        ? "cafe"
        : includesAny(normalized, ["bedroom", "bed"])
          ? "bedroom"
          : includesAny(normalized, ["observatory", "telescope"])
            ? "observatory"
            : "ambient room";

  const environment =
    includesAny(normalized, ["outside", "forest", "mountain", "lake", "beach"]) &&
    !includesAny(normalized, ["window", "room", "desk", "office", "bedroom"])
      ? "outdoor"
      : includesAny(normalized, ["window", "outside the window"])
        ? "mixed"
        : "indoor";

  const timeOfDay = includesAny(normalized, ["night", "late night", "evening"])
    ? "night"
    : includesAny(normalized, ["sunset", "dusk", "golden hour"])
      ? "sunset"
      : includesAny(normalized, ["dawn", "sunrise", "morning"])
        ? "dawn"
        : includesAny(normalized, ["day", "daylight", "afternoon"])
          ? "day"
          : "unspecified";

  const weather = includesAny(normalized, ["thunderstorm", "lightning", "storm"])
    ? "storm"
    : includesAny(normalized, ["rain", "rainy", "raindrop"])
      ? "rain"
      : includesAny(normalized, ["snow", "snowfall", "snowy"])
        ? "snow"
        : includesAny(normalized, ["cloud", "overcast"])
          ? "cloudy"
          : includesAny(normalized, ["clear sky", "sunny"])
            ? "clear"
            : "unspecified";

  const mood = [
    includesAny(normalized, ["cozy", "warm", "comfort"]) ? "cozy" : null,
    includesAny(normalized, ["sleep", "bedtime"]) ? "sleep" : null,
    includesAny(normalized, ["meditation", "meditative"]) ? "meditation" : null,
    includesAny(normalized, ["calm", "peaceful", "serene", "ambient"])
      ? "calm"
      : null,
    includesAny(normalized, ["focus", "study", "deep work", "productive"])
      ? "focus"
      : null,
    includesAny(normalized, ["dreamy", "ethereal", "magical"])
      ? "dreamy"
      : null,
  ].filter((value): value is string => value !== null);

  if (mood.length === 0) mood.push("calm");

  const motionElements = uniqueMotionElements([
    ...(includesAny(normalized, ["steam", "steaming", "coffee mug", "tea cup"])
      ? [{kind: "steam" as const, priority: 1, subtlety: "subtle" as const}]
      : []),
    ...(includesAny(normalized, ["rain", "rainy", "raindrop"])
      ? [{kind: "rain" as const, priority: 1, subtlety: "subtle" as const}]
      : []),
    ...(includesAny(normalized, ["cloud", "clouds"])
      ? [{kind: "clouds" as const, priority: 1, subtlety: "subtle" as const}]
      : []),
    ...(includesAny(normalized, ["snow", "snowfall", "snowy"])
      ? [{kind: "snow" as const, priority: 1, subtlety: "subtle" as const}]
      : []),
    ...(includesAny(normalized, ["lamp", "lantern", "warm light"])
      ? [{kind: "lampGlow" as const, priority: 2, subtlety: "minimal" as const}]
      : []),
    ...(includesAny(normalized, ["fireplace", "wood stove", "fire"])
      ? [{kind: "fireplace" as const, priority: 1, subtlety: "subtle" as const}]
      : []),
    ...(includesAny(normalized, ["waterfall", "flowing water"])
      ? [{kind: "waterfall" as const, priority: 1, subtlety: "subtle" as const}]
      : []),
    ...(includesAny(normalized, ["curtain", "curtains"])
      ? [{kind: "curtains" as const, priority: 3, subtlety: "minimal" as const}]
      : []),
    ...(includesAny(normalized, ["tree", "trees", "foliage", "leaves"])
      ? [{kind: "foliage" as const, priority: 3, subtlety: "minimal" as const}]
      : []),
  ])
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 4);

  const intensity: MotionIntensity = includesAny(normalized, [
    "very subtle",
    "minimal movement",
    "almost still",
  ])
    ? "minimal"
    : includesAny(normalized, ["moderate motion", "more movement"])
      ? "moderate"
      : "subtle";

  const camera = motionDefaults[intensity];
  const durationSeconds = detectDurationSeconds(normalized);

  const ambience = [
    weather === "rain" || weather === "storm" ? "light rain" : null,
    setting === "workstation" || environment !== "outdoor"
      ? "room tone"
      : null,
    weather === "snow" ? "soft winter ambience" : null,
    environment === "outdoor" ? "natural ambience" : null,
  ].filter((value): value is string => value !== null);

  const titleBase =
    setting === "workstation"
      ? `${mood.includes("cozy") ? "Cozy " : ""}Workstation`
      : titleCase(setting);

  const timeSuffix =
    timeOfDay === "night"
      ? " at Night"
      : timeOfDay === "sunset"
        ? " at Sunset"
        : "";

  const weatherPhrase =
    weather === "rain"
      ? "Rainy Night"
      : weather === "snow"
        ? "Snowy"
        : weather === "storm"
          ? "Stormy"
          : "";

  const suggestedTitle = [
    weatherPhrase,
    titleBase,
    mood.includes("focus")
      ? "Ambience for Focus"
      : mood.includes("sleep")
        ? "Ambience for Sleep"
        : mood.includes("meditation")
          ? "Ambience for Meditation"
          : "Ambient Scene",
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const spec: SceneSpec = {
    schemaVersion: 1,
    id: toId(
      [
        mood[0],
        setting,
        timeOfDay !== "unspecified" ? timeOfDay : "",
        weather !== "unspecified" ? weather : "",
      ]
        .filter(Boolean)
        .join(" "),
    ),
    title: `${titleBase}${timeSuffix}`,
    prompt: prompt.trim(),
    visual: {
      setting,
      environment,
      timeOfDay,
      weather,
      mood,
      style: "ambient",
    },
    duration: {
      seconds: durationSeconds,
      loopablePreviewSeconds: 30,
    },
    output: {
      width: 1920,
      height: 1080,
      fps: 30,
      platform: "youtube",
    },
    motion: {
      intensity,
      camera: {
        enabled: true,
        push: camera.push,
        horizontalDrift: camera.horizontalDrift,
      },
      elements: motionElements,
    },
    audio: {
      ambience,
      music: "none",
    },
    publishing: {
      suggestedTitle,
      suggestedDescriptionSeed: `A ${[
        mood.includes("cozy") ? "cozy" : null,
        mood.includes("calm") ? "calm" : null,
        mood.includes("dreamy") ? "dreamy" : null,
      ]
        .filter((value): value is string => value !== null)
        .join(", ") || "peaceful"} ${setting} ambience for ${mood.includes("sleep") ? "sleep and relaxation" : mood.includes("meditation") ? "meditation and relaxation" : mood.includes("focus") ? "focus and relaxation" : "relaxation"}.`,
      thumbnailPrompt: `${titleBase}${timeSuffix}, ${weather === "unspecified" ? "soft ambient atmosphere" : weather}, warm cinematic composition`,
    },
  };

  return SceneSpecSchema.parse(spec);
};
