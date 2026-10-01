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
      defaultProps={{scene: sampleScene}}
    />
  );
};
