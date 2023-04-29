import React, { useContext } from 'react';
import ToolsKit from './ToolsKit';
import Unit from './Unit';
import AppContext from '../AppContext';

function Screen({changesMode, changesValue, changesBattler, loadAllies, loadFoes}) {
  const { game } = useContext(AppContext);
  const allies = [];
  const foes = [];

  game.allies.forEach((unit, index) => {
    allies.push(<Unit key={index} index={index} status={unit} type='ally' changesBattler={changesBattler}/>);
  });

  game.foes.forEach((unit, index) => {
    foes.push(<Unit key={index} index={index} status={unit} type='foe' changesBattler={changesBattler}/>);
  });

  return (
    <div id="Screen">
      <div id="Title">BATTLERS</div>
      <ToolsKit changesMode={changesMode} changesValue={changesValue} loadAllies={loadAllies} loadFoes={loadFoes}/>
      <div id="Battlers">
        <div id="Allies">
          {allies}
        </div>
        <div id="Foes">
          {foes}
        </div>
      </div>
    </div>
  );
}

export default Screen;
