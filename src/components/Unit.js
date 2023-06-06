import React, { useState } from 'react';
import {getModifier, getDefense} from '../unitCalculator';

function Unit({ index, status, type, changesBattler }) {
  const [modalOpen, setModalOpen] = useState(false);

  const className = `unit-status nes-container is-dark with-title ${type}`;

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const displayAttribute = (att) => {
    return `${att.toUpperCase()} ${status.attributes[att]} (+${getModifier(status.attributes[att])} D${getDefense(status.attributes[att])}) `;
  };

  const modalLines = [[], [], []];
  ['str', 'dex', 'agi', 'con', 'per'].forEach((attribute, index) => {
    modalLines[0].push(<span key={index}>{displayAttribute(attribute)}</span>);
  });
  ['cha', 'int', 'cun', 'wil', 'wis'].forEach((attribute, index) => {
    modalLines[1].push(<span key={index}>{displayAttribute(attribute)}</span>);
  });
  ['luk', 'eqi', 'mag'].forEach((attribute, index) => {
    modalLines[2].push(<span key={index}>{displayAttribute(attribute)}</span>);
  });

  return (
    <div className={className}>
      <p className="title">{status.name}</p>
      <span className="infos" onClick={openModal}> (?)</span>
      <span className="rank">{status.job.title} ({status.job.rank})</span>
      <p>
        <span className="ressource">{status.ressources.pe.now}</span>
        <progress
          onClick={() => changesBattler(type, index, "pe")}
          title="Endurance (PE)"
          className="nes-progress is-endurance unit-bar"
          value={status.ressources.pe.now}
          max={status.ressources.pe.max}
        ></progress>
        {status.ressources.pv.now}
        <progress
          onClick={() => changesBattler(type, index, "pv")}
          title="Vitality (PV)"
          className="nes-progress is-vitality unit-bar"
          value={status.ressources.pv.now}
          max={status.ressources.pv.max}
        ></progress>
        {status.ressources.ps.now}
        <progress
          onClick={() => changesBattler(type, index, "ps")}
          title="Sanity (PS)"
          className="nes-progress is-mental unit-bar"
          value={status.ressources.ps.now}
          max={status.ressources.ps.max}
        ></progress>
      </p>
      <p>
        {status.ressources.pc.now}
        <progress
          onClick={() => changesBattler(type, index, "pc")}
          title="Chi (PC)"
          className="nes-progress is-chi unit-bar"
          value={status.ressources.pc.now}
          max={status.ressources.pc.max}
        ></progress>
        {status.ressources.pm.now}
        <progress
          onClick={() => changesBattler(type, index, "pm")}
          title="Mana (PM)"
          className="nes-progress is-mana unit-bar"
          value={status.ressources.pm.now}
          max={status.ressources.pm.max}
        ></progress>
        {status.ressources.pk.now}
        <progress
          onClick={() => changesBattler(type, index, "pk")}
          title="Karma (PK)"
          className="nes-progress is-fortune unit-bar"
          value={status.ressources.pk.now}
          max={status.ressources.pk.max}
        ></progress>
      </p>
      {status.pf_max && (
        <p>
          {status.ressources.pf.now}
          <progress
            onClick={() => changesBattler(type, index, "pf")}
            title="Exhaustion (PF)"
            className="nes-progress is-exhaustion unit-bar"
            value={status.ressources.pf.now}
            max={status.ressources.pf.max}
          ></progress>
        </p>
      )}
      {type === "foe" && <span className="level">Level {status.threat.critical}</span>}
      {modalOpen && (
          <div className="modal" onClick={closeModal}>
            <div className="nes-container is-rounded is-dark with-title is-centered">
              <p className="title">{status.name}</p>
              <div className="modal-content">
                <p>~ Bio ~</p>
                <p>Origins {status.race} ({status.ethnic})</p>
                <br></br>
                <p>~ Attributes ~</p>
                <p>{modalLines[0]}</p>
                <p>{modalLines[1]}</p>
                <p>{modalLines[2]}</p>
                <br></br>
                {
                  type === "foe" && <>
                    <p>~ Skills check ~</p>
                    <p>Primary skills : +{status.threat.critical}, Secundary skills : +{status.threat.high}, Tertiary skills : +{status.threat.mid}</p>
                    <p>Initiative : +{status.saves.initiative}</p>
                    <br></br>
                    <p>~ Saves ~</p>
                    <p>Fortitude +{status.saves.fortitude}, Determination +{status.saves.determination}, Reflexes +{status.saves.reflexes}, Composure +{status.saves.composure}, Opposition +{status.saves.opposition}</p>
                    <br></br>
                    <p>~ Combat ~</p>
                    <p>[{status.weaponry.primary.name.charAt(0).toUpperCase() + status.weaponry.primary.name.slice(1)} (C{status.weaponry.primary.cat})] : Offensive {status.combat.off}+{2+status.weaponry.primary.cat}D6</p>
                    <p>[{status.weaponry.defense.name.charAt(0).toUpperCase() + status.weaponry.defense.name.slice(1)} (C{status.weaponry.defense.cat})] : Resistance {status.combat.res}, Absorption {status.combat.abs}, Protection {status.combat.pro}</p>
                    <p>[Distances] : Speed {status.combat.speed}, Treat (range) {status.combat.treat}, Control (range) {status.combat.control}</p>
                    <br></br>
                    <p>~ Strategy ~</p>
                    <p>Job's PC usage : {status.job.mastery}</p>
                    {
                      status.strategy.maneuvers && status.strategy.maneuvers.map((maneuver) => {
                        return <p>(maneuver) {maneuver}</p>
                      })
                    }
                    {
                      status.strategy.actions && status.strategy.actions.map((action) => {
                        return <p>(action) {action}</p>
                      })
                    }
                    {
                      status.strategy.style && <p>(style) {status.strategy.style}</p>
                    }
                    {
                      status.strategy.passives && status.strategy.passives.map((passive) => {
                        return <p>(passive) {passive}</p>
                      })
                    }
                  </>
                }
                <br></br>
                <br></br>
                <br></br>
                <p>(click anywhere on this box to close)</p>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}

export default Unit;
