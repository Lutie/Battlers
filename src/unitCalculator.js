export default function calculateUnit(unit) {
  // Npcs needs to be calculated
  if (unit.type === "npc") {
    unit.attributes = calcAttributesBasedOnAdversity(unit);
    unit.job.rank = getValuesBasedOnAdversity(unit).rank;
  }
  // Equi is the average from will and constitution
  unit.attributes.eqi = Math.floor(
    (unit.attributes.wil + unit.attributes.con) / 2
  );
  let pf_max = unit.attributes.eqi;
  // Job ranks should improve attributes
  if (unit.type === "npc") {
    unit.attributes[unit.job.attributes[0]] += Math.floor(
      (unit.job.rank + 1) / 4
    );
    unit.attributes[unit.job.attributes[1]] += Math.floor(
      (unit.job.rank - 1) / 4
    );
  }
  // Ressources depends on attributes
  let pv_max =
    unit.attributes.con * 2 +
    unit.job.rank * unit.job.ressources.filter((item) => item === "pv").length +
    getBonus("pv", unit);
  let ps_max =
    unit.attributes.wil * 2 +
    unit.job.rank * unit.job.ressources.filter((item) => item === "ps").length +
    getBonus("ps", unit);
  const attributesRegardingEndurance = [
    unit.attributes.eqi,
    unit.attributes.wil,
    unit.attributes.con,
  ].sort((a, b) => a - b);
  let pe_max =
    attributesRegardingEndurance[0] +
    attributesRegardingEndurance[1] +
    unit.job.rank * unit.job.ressources.filter((item) => item === "pe").length +
    getBonus("pe", unit);
  let pm_max = unit.attributes[unit.job.tradition]
    ? unit.attributes[unit.job.tradition] * 2 +
      unit.job.rank * unit.job.ressources.filter((item) => item === "pm").length
    : 0 + getBonus("pm", unit);
  let pc_max =
    unit.attributes[unit.job.attributes[0]] +
    unit.attributes[unit.job.attributes[1]] +
    unit.job.rank * unit.job.ressources.filter((item) => item === "pc").length +
    getBonus("pc", unit);
  let pk_max =
    unit.attributes.luk * 2 +
    unit.job.rank * unit.job.ressources.filter((item) => item === "pk").length +
    getBonus("pk", unit);
  if (unit.type === "npc") {
    pv_max = Math.floor((pv_max * getRessourcesModifierBasedOnAdversity(unit).main) / 100);
    ps_max = Math.floor((ps_max * getRessourcesModifierBasedOnAdversity(unit).main) / 100);
    pe_max = Math.floor((pe_max * getRessourcesModifierBasedOnAdversity(unit).sub) / 100);
    pm_max = Math.floor((pm_max * getRessourcesModifierBasedOnAdversity(unit).main) / 100);
    pc_max = Math.floor((pc_max * getRessourcesModifierBasedOnAdversity(unit).main) / 100);
    pk_max = Math.floor((pk_max * getRessourcesModifierBasedOnAdversity(unit).luck) / 100);
    unit.threat = getTreatLevels(unit);
    unit.combat = {};
    unit.combat.res = unit.weaponry.defense.cat;
    unit.combat.abs =
      unit.weaponry.defense.cat * 3 + getModifier(unit.attributes.con);
    unit.combat.pro = 10 + unit.weaponry.defense.cat + getModifier(unit.sub_attributes.sta);
    unit.combat.off =
      getModifier(getAttributeSpreadBasedOnAdversity(unit).critical) +
      Math.floor(getValuesBasedOnAdversity(unit).quality / 2);
    if (unit.weaponry.upg) {
      unit.combat.off += getValuesBasedOnAdversity(unit).quality;
      unit.combat.abs += getValuesBasedOnAdversity(unit).quality;
    }
  }
  return Object.assign(
    {
      ressources: {
        pv: {
          now: pv_max,
          max: pv_max,
        },
        ps: {
          now: ps_max,
          max: ps_max,
        },
        pe: {
          now: pe_max,
          max: pe_max,
        },
        pm: {
          now: pm_max,
          max: pm_max,
        },
        pc: {
          now: pc_max,
          max: pc_max,
        },
        pk: {
          now: pk_max,
          max: pk_max,
        },
        pf: {
          now: pf_max,
          max: pf_max,
        },
      },
      defenses: {
        str: getDefense(unit.attributes.str),
        dex: getDefense(unit.attributes.dex),
        agi: getDefense(unit.attributes.agi),
        con: getDefense(unit.attributes.con),
        per: getDefense(unit.attributes.per),
        cha: getDefense(unit.attributes.cha),
        int: getDefense(unit.attributes.int),
        cun: getDefense(unit.attributes.cun),
        wil: getDefense(unit.attributes.wil),
        wis: getDefense(unit.attributes.wis),
      },
      saves: {
        fortitude: getSave(unit, "con", "fortitude"),
        determination: getSave(unit, "wil", "determination"),
        reflexes: getSave(unit, "agi", "reflexes"),
        composure: getSave(unit, "cun", "composure"),
        opposition: getSave(unit, "mag", "opposition"),
      },
    },
    unit
  );
}

// Return modifier for a given attribute value
export function getModifier(value, isDefense = false) {
  return Math.floor((value - 10 + (isDefense ? 0 : 1)) / 2);
}

// Return defense for a given attribute value
export function getDefense(value) {
  return getModifier(value, true) + 15;
}

// Return a specific save value for a given unit
function getSave(unit, attributeName, skillName) {
  let skillBonus;
  if (unit.type === "npc") {
    skillBonus = getSkillBasedOnAdversity(unit, "critical");
  } else {
    skillBonus = unit.skills[skillName];
  }
  return getModifier(unit.attributes[attributeName]) + skillBonus;
}

// Calculate attributes (npc)
function calcAttributesBasedOnAdversity(unit) {
  let levels = getAttributeSpreadBasedOnAdversity(unit);
  return {
    str: getAttributeValue("str", unit, levels),
    dex: getAttributeValue("dex", unit, levels),
    agi: getAttributeValue("agi", unit, levels),
    con: getAttributeValue("con", unit, levels),
    per: getAttributeValue("per", unit, levels),
    cha: getAttributeValue("cha", unit, levels),
    int: getAttributeValue("int", unit, levels),
    cun: getAttributeValue("cun", unit, levels),
    wil: getAttributeValue("wil", unit, levels),
    wis: getAttributeValue("wis", unit, levels),
    luk: getAttributeValue("luk", unit, levels),
    mag: getAttributeValue("mag", unit, levels),
  };
}

// Return an attribute value based on a unit adversity and attribute spread
function getAttributeValue(attribute, unit, levels) {
  for (const key in levels) {
    if (
      unit.affinity.hasOwnProperty(key) &&
      unit.affinity[key].includes(attribute)
    ) {
      return levels[key];
    }
  }
  // A very low magic attribute is 0
  if (attribute === "mag") {
    return 0;
  }
  return levels["vlow"];
}

function getTreatLevels(unit) {
  const levels = {
    critical: 4,
    high: 3,
    mid: 2,
    low: 1,
    vlow: 0,
  };
  for (const key in levels) {
    const bonus = unit.adversity.bonus - 4 + levels[key];
    const skill = getSkillBasedOnAdversity(unit, key);
    const quality = getValuesBasedOnAdversity(unit).quality - 4 + levels[key];
    const attribute = getModifier(
      getAttributeSpreadBasedOnAdversity(unit)[key]
    );
    const other = getValuesBasedOnAdversity(unit).other - 4 + levels[key];
    levels[key] =
      skill +
      (bonus > 0 ? bonus : 0) +
      Math.floor((quality > 0 ? quality : 0) / 2) +
      attribute +
      (other > 0 ? other : 0);
  }
  return levels;
}

function getSkillBasedOnAdversity(unit, quality) {
  let levels = {};
  switch (unit.adversity.type) {
    default:
      levels = { vlow: 0, low: 0, mid: 0, high: 1, critical: 2 };
      break;
    case "sbire":
      levels = { vlow: 0, low: 1, mid: 1, high: 2, critical: 3 };
      break;
    case "enemy":
      levels = { vlow: 0, low: 1, mid: 2, high: 4, critical: 5 };
      break;
    case "adversary":
      levels = { vlow: 1, low: 2, mid: 3, high: 4, critical: 6 };
      break;
    case "nemesis":
      levels = { vlow: 1, low: 2, mid: 4, high: 5, critical: 7 };
      break;
    case "legend":
      levels = { vlow: 2, low: 3, mid: 5, high: 6, critical: 8 };
      break;
  }
  return levels[quality];
}

function getAttributeSpreadBasedOnAdversity(unit) {
  switch (unit.adversity.type) {
    default:
      return { vlow: 6, low: 8, mid: 10, high: 12, critical: 14 };
    case "sbire":
      return { vlow: 8, low: 10, mid: 12, high: 14, critical: 16 };
    case "enemy":
      return { vlow: 10, low: 12, mid: 14, high: 16, critical: 18 };
    case "adversary":
      return { vlow: 12, low: 14, mid: 16, high: 18, critical: 22 };
    case "nemesis":
      return { vlow: 14, low: 16, mid: 18, high: 20, critical: 24 };
    case "legend":
      return { vlow: 16, low: 18, mid: 20, high: 24, critical: 28 };
  }
}

function getRessourcesModifierBasedOnAdversity(unit) {
  let levels = {};
  switch (unit.adversity.type) {
    default:
      levels = { luck: 0, sub: 50, main: 100 };
      break;
    case "sbire":
      levels = { luck: 0, sub: 50, main: 100 };
      break;
    case "enemy":
      levels = { luck: 50, sub: 100, main: 100 };
      break;
    case "adversary":
      levels = { luck: 100, sub: 150, main: 150 };
      break;
    case "nemesis":
      levels = { luck: 200, sub: 200, main: 200 };
      break;
    case "legend":
      levels = { luck: 300, sub: 300, main: 300 };
      break;
  }
  return levels;
}

function getValuesBasedOnAdversity(unit) {
  switch (unit.adversity.type) {
    default:
      return { other: 0, quality: 0, rank: 2 };
    case "sbire":
      return { other: 0, quality: 1, rank: 4 };
    case "enemy":
      return { other: 1, quality: 2, rank: 6 };
    case "adversary":
      return { other: 2, quality: 4, rank: 8 };
    case "nemesis":
      return { other: 3, quality: 5, rank: 10 };
    case "legend":
      return { other: 4, quality: 6, rank: 12 };
  }
}

function getBonus(label, unit) {
  return unit.bonus ? (unit.bonus[label] ? unit.bonus[label] : 0) : 0;
}
