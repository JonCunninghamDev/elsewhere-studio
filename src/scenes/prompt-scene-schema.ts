import {z} from "zod";
import {SceneSpecSchema} from "../planner/scene-spec";

export const PromptScenePropsSchema = z.object({
  scene: SceneSpecSchema,
});
