import { Composition } from "remotion";
import { LogoVideo } from "./LogoVideo";

export const RemotionRoot = () => (
  <Composition
    id="main"
    component={LogoVideo}
    durationInFrames={210}
    fps={30}
    width={1080}
    height={1080}
  />
);