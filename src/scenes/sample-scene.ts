import sampleSceneJson from "./observatory-above-clouds/scene.json";
import {SceneManifestSchema} from "./scene-schema";

export const sampleScene = SceneManifestSchema.parse(sampleSceneJson);
