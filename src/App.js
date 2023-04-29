import React, { useState } from "react";
import Screen from "./components/Screen";
import Commands from "./components/Commands";
import AppContext from "./AppContext";
import allies from "./data/allies.json";
import foes from "./data/foes.json";
import config from "./config.json";
import { Cookies } from "react-cookie";

function App() {
  // Now handle states properly
  const cookies = new Cookies();
  // cookies.remove("config");
  // cookies.remove("allies");
  // cookies.remove("foes");
  const savedGame = Object.assign(
    {},
    {config: cookies.get("config") } || config,
    {allies: cookies.get("allies")} || {allies: []},
    {foes: cookies.get("foes")} || {foes: []},
  );
  console.log(savedGame)
  const [game, setGame] = useState(savedGame);
  const [commands, setCommands] = useState([]);

  // Handle battler changes
  const changesBattler = (type, who, about) => {
    const newGame = { ...game };
    const rType = type === "ally" ? "allies" : "foes";
    newGame[rType][who][about] +=
      game.config.mode === "Minus" ? -game.config.value : +game.config.value;
    if (newGame[rType][who][about] > newGame[rType][who][`${about}_max`]) {
      newGame[rType][who][about] = newGame[rType][who][`${about}_max`];
    }
    setGame(newGame);
    cookies.set("foes", newGame.foes);
    cookies.set("allies", newGame.allies);
    cookies.set("config", newGame.config);
  };

  // Handle config changes
  const changesMode = (newMode) => {
    const newGame = { ...game };
    newGame.config.mode = newMode;
    setGame(newGame);
    cookies.set("foes", newGame.foes);
    cookies.set("allies", newGame.allies);
    cookies.set("config", newGame.config);
  };
  const changesValue = (newValue) => {
    const newGame = { ...game };
    newGame.config.value = newValue;
    setGame(newGame);
    cookies.set("foes", newGame.foes);
    cookies.set("allies", newGame.allies);
    cookies.set("config", newGame.config);
  };

  // Handle config changes
  const loadAllies = () => {
    const newGame = { ...game };
    newGame.allies = allies.allies;
    setGame(newGame);
    cookies.set("foes", newGame.foes);
    cookies.set("allies", newGame.allies);
    cookies.set("config", newGame.config);
  };
  const loadFoes = () => {
    const newGame = { ...game };
    newGame.foes = foes.foes;
    setGame(newGame);
    cookies.set("foes", newGame.foes);
    cookies.set("allies", newGame.allies);
    cookies.set("config", newGame.config);
  };

  // Handle keyboard instructions
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      if (commands === []) {
        // Starts a command prompt
        setCommands(["init"]);
      } else {
        // Execute a command prompt
        setCommands([]);
      }
    }
  }

  return (
    <AppContext.Provider value={{ game }}>
      <div className="App">
        <Screen
          changesMode={changesMode}
          changesValue={changesValue}
          changesBattler={changesBattler}
          loadAllies={loadAllies}
          loadFoes={loadFoes}
          onKeyDown={handleKeyDown}
        />
        {/* {commands !== [] && <Commands/>} */}
      </div>
    </AppContext.Provider>
  );
}

export default App;
