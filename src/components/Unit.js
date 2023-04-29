import React from 'react';

function Unit({index, status, type, changesBattler}) {
  const className = `unit-status nes-container is-dark with-title ${type}`;

  return (
    <div className={className}>
      <p className="title">{status.name}</p>
      <p>
        {status.pe}<progress onClick={() => changesBattler(type, index, 'pe')} title="Endurance (PE)" className="nes-progress is-endurance unit-bar" value={status.pe} max={status.pe_max}></progress>
        {status.pv}<progress onClick={() => changesBattler(type, index, 'pv')} title="Vitality (PV)" className="nes-progress is-vitality unit-bar" value={status.pv} max={status.pv_max}></progress>
        {status.ps}<progress onClick={() => changesBattler(type, index, 'ps')} title="Sanity (PS)" className="nes-progress is-mental unit-bar" value={status.ps} max={status.ps_max}></progress>
      </p>
      <p>
        {status.pc}<progress onClick={() => changesBattler(type, index, 'pc')} title="Chi (PC)" className="nes-progress is-chi unit-bar" value={status.pc} max={status.pc_max}></progress>
        {status.pm}<progress onClick={() => changesBattler(type, index, 'pm')} title="Mana (PM)" className="nes-progress is-mana unit-bar" value={status.pm} max={status.pm_max}></progress>
        {status.pk}<progress onClick={() => changesBattler(type, index, 'pk')} title="Karma (PK)" className="nes-progress is-fortune unit-bar" value={status.pk} max={status.pk_max}></progress>
      </p>
      {status.pf_max &&
        <p>
          {status.pf}<progress onClick={() => changesBattler(type, index, 'pf')} title="Exhaustion (PF)" className="nes-progress is-exhaustion unit-bar" value={status.pf} max={status.pf_max}></progress>
        </p>
      }
    </div>
  );
}

export default Unit;
