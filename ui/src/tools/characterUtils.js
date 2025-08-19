import { Rulesets } from "../models/Rulesets.ts";
import { toPascalCase } from "./utils.js";

export function getLootList(loot, personalItems) {
  const l3wt = loot?.length && (typeof loot == 'object') ? loot?.join(",\n") : loot;
  const it3ms = personalItems?.length && (typeof personalItems == 'object') ? personalItems.join(",\n") : personalItems;
  return `${l3wt ? `${l3wt},\n` : ""}${it3ms ? `${it3ms}` : ""}`;
}

export function getAttributes(statBlock, ruleset) {
  const stats = typeof statBlock === "string" ? JSON.parse(statBlock) : statBlock;

  let statLine = "";
  switch (ruleset) {
    case Rulesets.SWADE:
      for (let e of stats.attributes) {
        statLine += `${toPascalCase(e.name)}: ${e.value}\n`;
      }
      break;
    case Rulesets.DnD5E:
    default:
      for (let e in stats.attributes) {
        statLine += `${e}: ${stats.attributes[e]}\n`;
      }
      break;
  }

  return statLine;
}

export function getSkills(statBlock) {
  const stats = typeof statBlock === "string" ? JSON.parse(statBlock) : statBlock;
  if (stats?.skills) {
    return stats?.skills
      .map((s) => {
        let skillLine = `${s.name}: ${s.bonus || s.value}`;
        return skillLine;
      })
      ?.join("\n");
  }
}

export function getSaves(statBlock) {
  const stats = typeof statBlock === "string" ? JSON.parse(statBlock) : statBlock;

  if (stats?.saves) {
    return stats?.saves
      .map((s) => {
        let saveLine = `${s.name}: ${s.bonus}`;
        return saveLine;
      })
      .join("\n");
  }
}

export function getShopInventory(shop) {
  const inventory = shop?.inventory?.length
    ? shop.inventory
        .map((i) => {
          let itemLine = "";
          for (let e in i) {
            itemLine += `${toPascalCase(e)}: ${i[e]}\n`;
          }
          return itemLine;
        })
        .join("\n")
    : "";
  return inventory;
}

export const hasAttacks = (statBlock) => {
  const hasStuff =
    Object.keys(statBlock).length === 0 ||
    statBlock.weapons?.length ||
    statBlock.attacks?.length ||
    false;
  return hasStuff;
};

export function getAttacks(statBlock, ruleset) {
  const stats =  typeof statBlock === 'string' ? JSON.parse(statBlock) : statBlock;
  switch (ruleset) {
    case Rulesets.SWADE:
      return stats.weapons.map((w) => {
        let weaponLine = `-${w.name}-\n`;
        weaponLine += (w.profiles.length ? `Skill: ${w.profiles[0].skillName} - [${w.profiles[0].skillValue}]\n` : '');
        weaponLine += `Range: ${w.range} | ROF: ${w.rof} | Shots: ${w.shots}\n`;
        weaponLine += `Damage: ${w.damage} | AP: ${w.ap}\n`;
        return weaponLine;
      }).join("\n");
    case Rulesets.DnD5E:
    default:
      return stats.attacks
        .map((a) => {
          let attackLine =
            `${a.name}:\nRange: ${a.range}` +
            `${isValidStat(a.bonus) ? `\nAttack Bonus: ${a.bonus}\n` : ""}` +
            `${isValidStat(a.damage) ? `${a.damage}` : ""}` +
            `${isValidStat(a.damageType) ? `${a.damageType} damage.` : ""}`;
          attackLine +=
            a.effect && a.effect?.toLowerCase() !== "none"
              ? `\nEffect: ${a.effect}\n`
              : "\n";
          return attackLine;
        })
        .join("\n");
  }
}

export function getSpells(statBlock, ruleset) {
  const stats = typeof statBlock === "string" ? JSON.parse(statBlock) : statBlock;
  switch (ruleset) {
    case Rulesets.SWADE:
      let powerTypeLine = stats.abilities.map((abs) => `${abs.name}\n${abs.description}\n`).join(",");
      powerTypeLine += stats.abs?.map((abs) => {
        let power = `\nPowerPoints: ${abs.powerPointsMax}\nPowers:\n`;
        power += abs.powers?.map((p) => {
          let powerLine = `\n-${p.name}-\n`;
          powerLine += `Arcane Skill: ${p.arcaneSkillName || abs.arcaneSkill} [${p.arcaneSkillRoll || stats.skills.find(s=> s.name === abs.arcaneSkill)?.value}]\n`;
          powerLine += `Cost: ${p.powerPoints} | Range: ${p.range} | Duration: ${p.duration}\n`;
          powerLine += (p.damage && p.damage !== "None" ? `Damage: ${p.damage}\n` : "")
          powerLine += `Effect: ${p.summary}\n`; //Should we display description here?
          powerLine += p.powerModifiers?.length ? `\nOptional Modifiers:\n ${p.powerModifiers.join("\n")}` : ''; //Can we accordion this?
          return powerLine;
        }).join("\n");
        return power;
      }).join("\n");
        return powerTypeLine;
    case Rulesets.DnD5E:
    default:
      return stats.spells
        .map((a) => {
          let spellLine =
            `\n${a.name}:\n` +
            (isValidStat(a.spellLevel)
              ? `Spell Level: ${a.spellLevel}, `
              : "") +
            (isValidStat(a.range)
              ? `Range: ${a.range}${
                  isValidStat(a.duration) ? `, Duration: ${a.duration}` : ""
                }\n`
              : "") +
            (isValidStat(a.description)
              ? `Description: ${a.description}\n`
              : "") +
            `Effect: ${a.effect}`;
          spellLine += a.saveDC ? `\nSave DC: ${a.saveDC}` : "";
          spellLine += a.damage ? `\nDamage: ${a.damage}` : "";
          return spellLine;
        })
        .join("\n");
  }
}

export function getClasses(statBlock, ruleset) {
  const stats = typeof statBlock === "string" ? JSON.parse(statBlock) : statBlock;
  switch (ruleset) {
    case Rulesets.SWADE:
      return `Rank: ${stats?.rankName}, Advances: ${stats?.advancesCount}`;

    case Rulesets.DnD5E:
    default:
      return stats?.classes && typeof stats?.classes == "object"
        ? stats?.classes
            .map((a) => {
              let classLine = `${a.name} - Level ${a.level}`;
              return classLine;
            })
            .join("\n")
        : stats?.classes;
  }
}

export const getPirmaryStats = (statBlock, ruleset, styles) => {
  const stats = typeof statBlock === "string" ? JSON.parse(statBlock) : statBlock;
  switch (ruleset) {
    case Rulesets.SWADE:
      return (
        <div className={styles}>
          <b> MaxWounds: {stats["woundsMax"]}</b>
          <b> Toughness: {stats["toughnessTotal"]}</b>
          <b> Parry: {stats["parryTotal"]}</b>
        </div>
      );
    case Rulesets.DND5E:
    default:
      return (
        <div className={styles}>
          <b> HP: {stats["hp"]}</b>
          <b> AC: {stats["ac"]}</b>
        </div>
      );
  }
};


export const hasSpells = (statBlock, ruleset) => {
  const stats = typeof statBlock === "string" ? JSON.parse(statBlock) : statBlock;
  switch (ruleset) {
    case Rulesets.SWADE:
      return stats.abilities?.length > 0;
    case Rulesets.DND5E:
    default:
      return stats.spells?.length > 0;
  }
};

export const hasFeats = (statBlock, ruleset) => {
  const stats = typeof statBlock === "string" ? JSON.parse(statBlock) : statBlock;
  switch (ruleset) {
    case Rulesets.SWADE:
      return stats.edges?.length > 0 || stats.advancesCount > 0;
    case Rulesets.DND5E:
    default:
      return stats.feats?.length > 0 || stats.abilities?.length > 0;
  }
};

export const hasAbilities = (statBlock) => {
  const hasStuff =
    Object.keys(statBlock).length === 0 ||
    statBlock.abilities?.length ||
    statBlock.advances?.length ||
    statBlock.edges?.length ||
    false;
  return hasStuff;
}

export function getFeats(statBlock, ruleset) {
  const stats = typeof statBlock === "string" ? JSON.parse(statBlock) : statBlock;

  switch (ruleset) {
    case Rulesets.SWADE:
      let edges = stats.edges.map((e) => { return `${e.name}:\n${e.description}\nFrom: ${e.note}\n` }).join("\n");
      if (stats.advances.length) {
        edges += `\n-Advances-\n`;
        edges += stats.advances
          .map((a) => {
            return `\n${a.name}\n${a.description}\n`;
          })
          .join("\n");
      }
      return edges;
    case Rulesets.DnD5E:
    default:
      let allAbilities = '';
      if (stats.abilities?.length) {
        const abilities = /*`\n-Abilities-\n` + */ stats?.abilities
          .map((a) => {
            let abilities = `${a.name}`;
            abilities += `${isValidStat(a.damage) ? '\nDamage:' + a.damage : ''} `;
            abilities += `${isValidStat(a.range) ? "Range:" + a.range : ""}  `;
            abilities += `${isValidStat(a.duration) ? "Duration:" + a.duration : ''}`;
            abilities += `${isValidStat(a.description) ? `\n${a.description}` : ''}`;
            abilities += `${isValidStat(a.effect) ? `\n${a.effect}` : ""}`;
            return abilities;
          }).join("\n");
        allAbilities += abilities;
      }
      if (!stats?.abilities?.feats?.length) return allAbilities;
      const feats = `\n` + stats?.feats.map((f) => {
        let feat = `${f.name}`;
          feat += `${f.description ? `\n${f.description}` : ""}`
          feat += `${f.effect ? `\n${f.effect}` : ""}`;
        return feat;
      }).join("\n");
      allAbilities += `\n${feats}`;
      return allAbilities;;
  }
}

function isNotBlank(prop) {
  return !!prop && prop !== 'null' && prop !== 'undefined' && prop !== "None";
}

function isValidStat(stat) {
  if (typeof stat === 'string') {
    return (
      isNotBlank(stat) &&
      stat.toLowerCase() !== "n/a" &&
      stat.toLowerCase() !== "none"
    );
  } else if (typeof stat == 'number') {
    return true
  }
  return false;
    
}