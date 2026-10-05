import type {FC, CSSProperties} from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import type {SceneSpec} from "../planner/scene-spec";
import {cameraMotion, normalizedProgress} from "./motion";

export type PromptSceneProps = {
  scene: SceneSpec;
};

const hasMotion = (scene: SceneSpec, kind: SceneSpec["motion"]["elements"][number]["kind"]) =>
  scene.motion.elements.some((element) => element.kind === kind);

const skyFor = (scene: SceneSpec) => {
  if (scene.visual.timeOfDay === "night") {
    return "linear-gradient(180deg, #07111f 0%, #152238 55%, #263650 100%)";
  }
  if (scene.visual.timeOfDay === "dawn") {
    return "linear-gradient(180deg, #627d98 0%, #d5a47c 58%, #f0d7b5 100%)";
  }
  if (scene.visual.timeOfDay === "sunset") {
    return "linear-gradient(180deg, #52667d 0%, #d78665 55%, #e9b97d 100%)";
  }
  return "linear-gradient(180deg, #8eb9d6 0%, #c8dce8 58%, #e6edf0 100%)";
};

const rainDrops = Array.from({length: 26}, (_, index) => ({
  left: ((index * 37) % 100),
  top: ((index * 61) % 100),
  delay: (index * 0.37) % 1,
}));

const snowFlakes = Array.from({length: 24}, (_, index) => ({
  left: ((index * 43) % 100),
  top: ((index * 29) % 100),
  size: 4 + (index % 4) * 2,
  phase: (index * 0.41) % 1,
}));

export const PromptScene: FC<PromptSceneProps> = ({scene}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, width} = useVideoConfig();
  const progress = normalizedProgress(frame, durationInFrames);
  const camera = cameraMotion({
    progress,
    width,
    cameraPush: scene.motion.camera.push,
    horizontalDrift: scene.motion.camera.horizontalDrift,
  });
  const phase = progress * Math.PI * 2;
  const scale = 1.025 + camera.scaleOffset;
  const cloudShift = Math.sin(phase) * 48;
  const steamRise = (progress * 180) % 180;
  const glow = 0.56 + Math.sin(phase * 2) * 0.06;

  const isWorkstation = scene.visual.setting === "workstation";
  const isCabin = scene.visual.setting === "cabin";
  const isWaterfall = scene.visual.setting === "forest waterfall";

  const roomStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    transform: `translate3d(${camera.driftX}px,0,0) scale(${scale})`,
    transformOrigin: "50% 50%",
  };

  return (
    <AbsoluteFill style={{background: "#0b1220", overflow: "hidden"}}>
      <div style={roomStyle}>
        <div style={{position: "absolute", inset: 0, background: skyFor(scene)}} />

        {(scene.visual.environment === "mixed" || isWorkstation || isCabin) && (
          <>
            <div
              style={{
                position: "absolute",
                left: "10%",
                top: "8%",
                width: "48%",
                height: "54%",
                border: "18px solid rgba(40,30,24,0.9)",
                boxShadow: "0 0 0 900px rgba(40,29,22,0.36)",
                overflow: "hidden",
              }}
            >
              <div style={{position: "absolute", inset: 0, background: skyFor(scene)}} />
              {hasMotion(scene, "clouds") && (
                <>
                  <div style={{position:"absolute",left:`${10 + cloudShift * 0.08}%`,top:"24%",width:"32%",height:"13%",borderRadius:"50%",background:"rgba(235,240,244,0.62)",filter:"blur(6px)"}} />
                  <div style={{position:"absolute",left:`${52 + cloudShift * 0.05}%`,top:"36%",width:"28%",height:"11%",borderRadius:"50%",background:"rgba(235,240,244,0.5)",filter:"blur(8px)"}} />
                </>
              )}
              {hasMotion(scene, "rain") &&
                rainDrops.map((drop, index) => (
                  <div
                    key={index}
                    style={{
                      position:"absolute",
                      left:`${drop.left}%`,
                      top:`${((drop.top + progress * 1035 + drop.delay * 100) % 115) - 10}%`,
                      width:2,
                      height:26,
                      transform:"rotate(12deg)",
                      background:"rgba(210,228,240,0.58)",
                    }}
                  />
                ))}
              {hasMotion(scene, "snow") &&
                snowFlakes.map((flake, index) => (
                  <div
                    key={index}
                    style={{
                      position:"absolute",
                      left:`${flake.left + Math.sin(phase + flake.phase * 6) * 2}%`,
                      top:`${((flake.top + progress * 72 + flake.phase * 100) % 112) - 6}%`,
                      width:flake.size,
                      height:flake.size,
                      borderRadius:"50%",
                      background:"rgba(250,252,255,0.86)",
                      filter:"blur(0.4px)",
                    }}
                  />
                ))}
            </div>

            <div style={{position:"absolute",left:0,right:0,bottom:0,height:"38%",background:"linear-gradient(180deg,#4b3427,#261b17)"}} />
          </>
        )}

        {isWorkstation && (
          <>
            <div style={{position:"absolute",left:"16%",right:"9%",bottom:"20%",height:"8%",borderRadius:8,background:"linear-gradient(180deg,#80583c,#4b3328)",boxShadow:"0 18px 30px rgba(0,0,0,0.32)"}} />
            <div style={{position:"absolute",left:"39%",bottom:"28%",width:"25%",height:"19%",borderRadius:12,background:"#1a2431",border:"8px solid #2e3744",boxShadow:"0 18px 28px rgba(0,0,0,0.35)"}}>
              <div style={{position:"absolute",inset:"8%",background:"linear-gradient(135deg,#233e57,#182536)"}} />
            </div>
            <div style={{position:"absolute",left:"23%",bottom:"28%",width:96,height:86,borderRadius:"0 0 32px 32px",background:"#d6c2a4",boxShadow:"0 10px 15px rgba(0,0,0,0.25)"}} />
            {hasMotion(scene, "steam") && (
              <>
                {[0,1,2].map((i) => (
                  <div key={i} style={{position:"absolute",left:`${25.3 + i * 0.8}%`,bottom:`${37 + ((steamRise + i * 52) % 150) * 0.12}%`,width:18,height:80,borderLeft:"5px solid rgba(235,239,235,0.4)",borderRadius:"50%",transform:`rotate(${Math.sin(phase + i) * 9}deg)`,filter:"blur(3px)",opacity:0.7 - (((steamRise + i * 52) % 150) / 230)}} />
                ))}
              </>
            )}
            <div style={{position:"absolute",right:"18%",bottom:"28%",width:26,height:190,background:"#423429"}} />
            <div style={{position:"absolute",right:"12%",bottom:"44%",width:150,height:90,borderRadius:"50%",background:`rgba(255,190,102,${hasMotion(scene,"lampGlow") ? glow : 0.56})`,filter:"blur(24px)"}} />
            <div style={{position:"absolute",right:"13%",bottom:"44%",width:130,height:58,borderRadius:"70px 70px 10px 10px",background:"#d6a75e"}} />
          </>
        )}

        {isCabin && (
          <>
            <div style={{position:"absolute",right:"10%",bottom:"12%",width:"28%",height:"38%",background:"#2a211d",border:"14px solid #5a3d2b",borderRadius:8}}>
              {hasMotion(scene,"fireplace") && (
                <div style={{position:"absolute",left:"22%",right:"22%",bottom:"8%",height:"54%",borderRadius:"50% 50% 18% 18%",background:`radial-gradient(ellipse at 50% 80%, rgba(255,222,120,0.95), rgba(242,106,52,${0.72 + Math.sin(phase*3)*0.08}) 46%, rgba(78,27,18,0.2) 72%)`,filter:"blur(1px)"}} />
              )}
            </div>
            <div style={{position:"absolute",left:"8%",right:"42%",bottom:"11%",height:"13%",borderRadius:10,background:"#6a4935"}} />
            {hasMotion(scene,"curtains") && (
              <>
                <div style={{position:"absolute",left:"7%",top:"5%",width:"10%",height:"62%",background:"rgba(121,59,42,0.88)",transform:`skewX(${Math.sin(phase)*1.8}deg)`,transformOrigin:"top"}} />
                <div style={{position:"absolute",left:"52%",top:"5%",width:"9%",height:"62%",background:"rgba(121,59,42,0.88)",transform:`skewX(${-Math.sin(phase)*1.8}deg)`,transformOrigin:"top"}} />
              </>
            )}
          </>
        )}

        {isWaterfall && (
          <>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(36,75,68,0.32),rgba(22,52,46,0.64))"}} />
            <div style={{position:"absolute",left:"7%",right:"7%",bottom:"8%",height:"32%",borderRadius:"50% 50% 0 0",background:"linear-gradient(180deg,#315e44,#183c30)"}} />
            <div style={{position:"absolute",left:"38%",top:"20%",width:"22%",height:"65%",borderRadius:"42% 42% 48% 48%",background:`linear-gradient(180deg,rgba(225,239,238,0.88),rgba(161,210,205,${0.74 + Math.sin(phase*2)*0.04}))`,filter:"blur(2px)",transform:`translateY(${hasMotion(scene,"waterfall") ? Math.sin(phase)*3 : 0}px)`}} />
            {hasMotion(scene,"foliage") && (
              <>
                <div style={{position:"absolute",left:"3%",top:"8%",width:"34%",height:"62%",borderRadius:"50%",background:"rgba(32,91,57,0.82)",transform:`rotate(${Math.sin(phase)*1.2}deg)`,transformOrigin:"bottom left"}} />
                <div style={{position:"absolute",right:"2%",top:"4%",width:"35%",height:"64%",borderRadius:"50%",background:"rgba(29,81,54,0.84)",transform:`rotate(${-Math.sin(phase)*1.1}deg)`,transformOrigin:"bottom right"}} />
              </>
            )}
            {hasMotion(scene,"clouds") && (
              <div style={{position:"absolute",left:`${28 + cloudShift * 0.06}%`,top:"13%",width:"30%",height:"9%",borderRadius:"50%",background:"rgba(240,239,227,0.46)",filter:"blur(7px)"}} />
            )}
          </>
        )}
      </div>

      <AbsoluteFill style={{background:"radial-gradient(ellipse at center,transparent 48%,rgba(3,7,18,0.16) 76%,rgba(3,7,18,0.42) 100%)"}} />
    </AbsoluteFill>
  );
};
