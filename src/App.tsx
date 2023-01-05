import { useEffect } from "react";

import Button from "./components/Button";
import Content from "./components/Content";
import Game from "./components/game/Game";
import Header from "./components/Header";
import Intro from "./components/Intro";
import Outro from "./components/Outro";
import useGame, { GameState } from "./hooks/useGame";
import usePosition from "./hooks/usePosition";
import useStages from "./hooks/useStages";

function App() {
  const position = usePosition();
  const stages = useStages();
  const game = useGame(stages, position);

  useEffect(() => {
    console.log(stages.list);
  }, [stages.list]);

  function getContent() {
    if (position.coordinates === null || position.heading === null) {
      return (
        <>
          {position.coordinates && <p>Location services are needed</p>}
          {position.heading && <p>Device orientation services are needed</p>}
        </>
      );
    }

    if (game.state === GameState.Intro) {
      return <Intro></Intro>;
    } else if (game.state === GameState.Outro) {
      return <Outro {...stages}></Outro>;
    } else {
      return <Game game={game} position={position} stages={stages}></Game>;
    }
  }

  return (
    <div className="h-full flex flex-col items-center justify-between pb-4">
      <Header></Header>
      <Content>{getContent()}</Content>
      <Button {...game}></Button>
    </div>
  );
}

export default App;
