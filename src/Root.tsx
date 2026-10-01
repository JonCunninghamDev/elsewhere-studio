import {Composition} from "remotion";
import {MicroScene} from "./compositions/MicroScene";
import {MicroScenePropsSchema} from "./scenes/scene-schema";
import {sampleScene} from "./scenes/sample-scene";

export const Root = () => {
  return (
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
  );
};
