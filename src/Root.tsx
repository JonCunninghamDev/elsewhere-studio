import {Composition} from "remotion";
import {MicroScene} from "./compositions/MicroScene";
import {PromptScene} from "./compositions/PromptScene";
import {previewDurationInFrames} from "./compositions/preview-config";
import {MicroScenePropsSchema} from "./scenes/scene-schema";
import {sampleScene} from "./scenes/sample-scene";
import {PromptScenePropsSchema} from "./scenes/prompt-scene-schema";
import {promptToSceneSpec} from "./planner/prompt-to-scene";

const defaultPromptScene = promptToSceneSpec(
  "Cozy home workstation at night. Coffee steaming. Rain outside the window. Warm lamp. Calm focus atmosphere. 2-hour video.",
);

export const Root = () => {
  return (
    <>
    <Composition
      id="MicroScene"
      component={MicroScene}
      durationInFrames={Math.round(
        sampleScene.durationSeconds * sampleScene.fps,
      )}
      fps={sampleScene.fps}
      width={sampleScene.width}
      height={sampleScene.height}
      schema={MicroScenePropsSchema}
      defaultProps={{
        scene: {
          schemaVersion: 1,
          id: "observatory-above-clouds",
          title: "The Observatory Above the Clouds",
          durationSeconds: 30,
          fps: 30,
          width: 1920,
          height: 1080,
          source: "scenes/observatory-above-clouds.svg",
          motion: {
            cameraPush: 0.018,
            horizontalDrift: -0.008,
            atmosphere: 0.28,
            lightFlicker: 0.035,
          },
        },
      }}
    />
    <Composition
      id="PromptScene"
      component={PromptScene}
      durationInFrames={previewDurationInFrames(defaultPromptScene)}
      fps={defaultPromptScene.output.fps}
      width={defaultPromptScene.output.width}
      height={defaultPromptScene.output.height}
      schema={PromptScenePropsSchema}
      defaultProps={{scene: defaultPromptScene}}
      calculateMetadata={({props}) => ({
        durationInFrames: previewDurationInFrames(props.scene),
        fps: props.scene.output.fps,
        width: props.scene.output.width,
        height: props.scene.output.height,
      })}
    />
    </>
  );
};
