import { Composition } from "remotion";
import { LogoIntro } from "./compositions/LogoIntro";
import { RichmondMap } from "./compositions/RichmondMap";
import { WhatIsMurmur } from "./compositions/WhatIsMurmur";
import { Murmuration } from "./compositions/Murmuration";
import { ForkScenario } from "./compositions/ForkScenario";

const LOGO_FRAMES = 150;
const MAP_FRAMES = 150;
const WHAT_FRAMES = 390;
const MURMURATION_FRAMES = 360;
const FORK_FRAMES = 150;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LogoIntro"
        component={LogoIntro}
        durationInFrames={LOGO_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RichmondMap"
        component={RichmondMap}
        durationInFrames={MAP_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WhatIsMurmur"
        component={WhatIsMurmur}
        durationInFrames={WHAT_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Murmuration"
        component={Murmuration}
        durationInFrames={MURMURATION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ForkScenario"
        component={ForkScenario}
        durationInFrames={FORK_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
