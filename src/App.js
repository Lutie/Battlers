import React, { useState, useEffect } from "react";
import Screen from "./components/Screen";
import Commands from "./components/Commands";
import AppContext from "./AppContext";
import allies from "./data/allies.json";
import foes from "./data/foes.json";
import { Cookies } from "react-cookie";
import calculateUnit from "./unitCalculator";

function App() {
  // Hydrate cookies
  const cookies = new Cookies();
  // Uncomment those 3 lines to reset cookies
  // cookies.remove("config");
  // cookies.remove("allies");
  // cookies.remove("foes");
  if (cookies.get("config") === undefined) {
    cookies.set("config", {
      config: {
        mode: "Minus",
        value: 1,
      },
    });
  }
  if (cookies.get("allies") === undefined) {
    cookies.set("allies", { allies: [] });
  }
  if (cookies.get("foes") === undefined) {
    cookies.set("foes", { foes: [] });
  }
  // Hydrate save
  const savedGame = Object.assign(
    {},
    cookies.get("config"),
    cookies.get("allies"),
    cookies.get("foes")
  );
  const [game, setGame] = useState(savedGame);
  const [commands, setCommands] = useState([]);
  console.log(savedGame);

  // Handle battler changes
  const changesBattler = (type, who, about) => {
    // const newGame = { ...game };
    // const rType = type === "ally" ? "allies" : "foes";
    // newGame[rType][who][about] +=
    //   game.config.mode === "Minus" ? -game.config.value : +game.config.value;
    // if (newGame[rType][who][about] > newGame[rType][who][`${about}_max`]) {
    //   newGame[rType][who][about] = newGame[rType][who][`${about}_max`];
    // }
    // setGame(newGame);
    // cookies.set("foes", newGame.foes);
    // cookies.set("allies", newGame.allies);
    // cookies.set("config", newGame.config);
  };

  // Handle config changes
  const changesMode = (newMode) => {
    const newGame = { ...game };
    newGame.config.mode = newMode;
    setGame(newGame);
  };

  const changesValue = (newValue) => {
    // const newGame = { ...game };
    // newGame.config.value = newValue;
    // setGame(newGame);
    // cookies.set("foes", newGame.foes);
    // cookies.set("allies", newGame.allies);
    // cookies.set("config", newGame.config);
  };

  // Load allies battlers
  const loadAllies = () => {
    const newGame = { ...game };
    newGame.allies = loadUnit(allies.allies);
    setGame(newGame);
    cookies.set("allies", { allies: newGame.allies });
  };

  // Load foes battlers
  const loadFoes = () => {
    const newGame = { ...game };
    newGame.foes = loadUnit(foes.foes);
    setGame(newGame);
    cookies.set("foes", { foes: newGame.foes });
  };

  function loadUnit(units) {
    const newUnits = [];
    units.forEach((unit) => {
      const newUnit = calculateUnit(unit);
      newUnits.push(newUnit);
    });
    return newUnits;
  }

  // Handle keyboard instructions
  const commandHandler = (event) => {
    if (event.key === "Enter") {
      if (commands.length <= 0) {
        // Starts a command prompt
        setCommands(["init"]);
      } else {
        // Execute a command prompt
        setCommands([]);
      }
    } else if (event.key === "+") {
      changesMode("Plus");
    } else if (event.key === "-") {
      changesMode("Minus");
    } else if (commands.length > 0) {
      switch (event.key) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          const newCommands = commands;
          newCommands.push(event.key);
          setCommands(newCommands);
          break;
        default:
          break;
      }
    }
  };
  
  useEffect(() => {
    window.addEventListener("keydown", commandHandler);

    return () => {
      window.removeEventListener("keydown", commandHandler);
    };
  });

  return (
    <AppContext.Provider value={{ game }}>
      <div className="App">
        <Screen
          changesMode={changesMode}
          changesValue={changesValue}
          changesBattler={changesBattler}
          loadAllies={loadAllies}
          loadFoes={loadFoes}
        />
        {commands.length > 0 && <Commands inputs={commands} />}
      </div>
    </AppContext.Provider>
  );
}

export default App;
