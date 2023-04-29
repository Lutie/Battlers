import React, { useContext } from 'react';
import AppContext from '../AppContext';

function ToolsKit({changesMode, changesValue, loadAllies, loadFoes}) {
  const { game } = useContext(AppContext);
  const defaultValue = 1;

  const plusClass = `nes-btn title--m ${game.config.mode === "Plus" ? "is-disabled" : ""}`;
  const minusClass = `nes-btn title--m ${game.config.mode === "Minus" ? "is-disabled" : ""}`;

  const handleInputChange = (event) => {
    changesValue(event.target.value);
  };

  return (
    <div id="ToolsMenu">
      <div className="val-selector nes-field">
        <input onChange={handleInputChange} defaultValue={defaultValue} type="text" id="name_field" className="nes-input" />
      </div>
      <div onClick={() => changesMode("Plus")} className={plusClass}>+</div>
      <div onClick={() => changesMode("Minus")} className={minusClass}>-</div>
      {game.config.mode ?? 'Select'} Mode
      <div onClick={() => loadAllies()} className="nes-btn title--m">Reload Allies</div>
      <div onClick={() => loadFoes()} className="nes-btn title--m">Reload Foes</div>
    </div>
  );
}

export default ToolsKit;
