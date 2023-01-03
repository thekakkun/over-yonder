import { useEffect } from "react";
import Button from "./components/Button";
import Content from "./components/Content";
import Game from "./components/Game";
import Header from "./components/Header";
import Intro from "./components/Intro";
import Outro from "./components/Outro";
import usePosition from "./hooks/usePosition";
import useStages from "./hooks/useStages";

function App() {
  const position = usePosition();
  const stageState = useStages();

  useEffect(() => {
    console.log(stageState.stages);
  }, [stageState.stages]);

  function getContent() {
    if (position.coordinates === null || position.heading === null) {
      return (
        <>
          {position.coordinates && <p>Location services are needed</p>}
          {position.heading && <p>Device orientation services are needed</p>}
        </>
      );
    }

    if (!stageState.isStarted()) {
      return <Intro></Intro>;
    } else if (stageState.isCompleted()) {
      return <Outro {...stageState}></Outro>;
    } else {
      return <Game position={position} stageState={stageState}></Game>;
    }
  }

  return (
    <div className="h-full flex flex-col items-center justify-between pb-4">
      <Header></Header>
      <Content>{getContent()}</Content>
      {position.coordinates && position.heading && (
        <Button position={position} stageState={stageState}></Button>
      )}
    </div>
  );
}

export default App;
