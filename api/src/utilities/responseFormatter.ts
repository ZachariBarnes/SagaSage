import { CheckboxOptions } from "../models/CheckBoxOptions.js";
import { Rulesets } from "../models/Rulesets.js";

const baseFormat = {
    name: "string",
    appearance: "string",
    portraitPrompt: "string",
};

const SavageWorldsStatsInterface = `{
  wealthFormatted: "string",
  playerName: "string",
  raceGenderAndProfession: "string",
  abilities: [
    {
      name: "string", //Ex: "Miracles",
      description: "string" //Ex: "Power Points: 15; Powers: Bolt"
    }
  ],
  abs: [
    {
      hasMegaPowerOptions: "boolean",
      name: "string", //Ex: "Bolt"
      powersTotal: "number",
      powerPointsMax: "number", //Ex: 15
      arcaneSkill: "string", //Ex: "Faith" (required)
      powers: [
        {
          name: "string",
          powerPoints: "string", //Ex: 1
          range: "string", //Ex: "Smarts x2" (required)
          damage: "string", //Ex: "2d6"
          duration: "string",
          summary: "string",
          description: "string",
          arcaneSkillName: "string", //Ex: "Faith" (required)
          arcaneSkillRoll: "string", //Ex: "d8" (required)
          powerModifiers: "string[]", //Ex: ["DAMAGE (+2): The bolt causes 3d6 damage (4d6 with a raise)."] or [] (required)
          megaPowerOptions: "string[]" //Ex: ["GREATER BOLT (+4): The bolt causes 4d6 Mega Damage (5d6 with a raise)."]
        }
      ]
    }
  ],
  advances: [
    {
      name: "string", //Ex: "Raise Attribute: Strength"
      number: "number",
      description: "string"
    }
  ],
  advancesCount: "number",
  age: "string",
  armor: [
    {
      name: "string", //Ex: "(Unarmored)"
      weight: "number",
      quantity: "number",
      armor: "number",
      notes: "string",
      isShield: "boolean",
      equipped: "boolean",
      cost: "number",
      costBuy: "number",
      minStr: "string",
      equippedToughness: "string",
      equippedStrength: "string",
      heavyArmor: "boolean"
    }
  ],
  armorValue: "number",
  attributes: [
    {
      name: "string",
      label: "string",
      value: "string",
      mod: "number",
      dieValue: "number"
    }
  ],
  bennies: "number",
  benniesMax: "number",
  cyberware: "any[]",
  edges: [
    {
      name: "string", //Ex: "Arcane Background (Miracles)"
      description: "string", //Ex: "Allows Access to Faith based powers"
      note: "string" //Ex: "Selected" (Must be 'Selected' or 'Advance')
    }
  ],
  fatigue: "number",
  fatigueMax: "number",
  gear: "any[]",
  gender: "string",
  heavyArmor: "boolean",
  hindrances: "any[]",
  image: "string",
  imageToken: "string",
  languages: "any[]",
  name: "string",
  paceBase: "number",
  paceMod: "number",
  paceTotal: "number",
  parryBase: "number",
  parryMod: "number",
  parryTotal: "number",
  race: "string",
  rank: "number",
  rankName: "string",
  runningDie: "string",
  shields: "any[]",
  size: "number",
  sizeLabel: "string",
  skills: [
    {
      name: "string", //Ex: "Shooting"
      attribute: "string", //Ex: "Agility"
      value: "string", //Ex: "d8"
      dieValue: "number",
      mod: "number",
      isCore: "boolean"
    }
  ],
  toughnessBase: "number", //Ex: 6
  toughnessMod: "number",
  toughnessTotal: "number",
  wealth: "number",
  weapons: [
    {
      name: "string",
      weight: "number",
      range: "string", //Ex: "12/24/48"
      damage: "string", //Ex: "2d6"
      rof: "number",
      shots: "number",
      ap: "number",
      notes: "string",
      quantity: "number",
      reach: "number",
      damageDiceBase: "string", //Ex: "2d6"
      damageDiceBasePlus: "number", //Ex: "2d6+1"
      equipped: "boolean",
      cost: "number",
      minStr: "string", //Ex: d4
      profiles: [ // At least one profile is Required for each weapon
        {
          damage: "string", //(required)
          damageWithBrackets: "string",
          notes: "string",
          damageDiceBasePlus: "number",
          damageDiceBase: "string",
          add_strength_to_damage: "boolean",
          skillName: "string", //Ex: "Shooting" or "Fighting" (required)
          skillValue: "string" //Ex: "d8" (required)
        }
      ]
    }
  ],
  wildcard: "boolean",
  wounds: "number",
  woundsBase: "number",
  woundsMax: "number",
  otherAttacks: "any[]"
} //(This stats object MUST contain attributes objects for the Core Attributes of Agility, Smarts, Spirit, Strength, and Vigor, as well as at least 1 skill and at least 1 weapon (offensive spells like bolt can be a weapon, but it must also be listed under 'weapons'))`;


const DnD5EStatsFormat = `{
  hp: "number",
  ac: "number",
  classes: [{ name: "string", level: "number" }],
  baseAttackBonus: "number",
  attributes: {
    STR: "number",
    DEX: "number",
    CON: "number",
    INT: "number",
    WIS: "number",
    CHA: "number"
  },
  skills: [
    {
      name: "string",
      bonus: "string"
    }
  ],
  attacks: [
    {
      name: "string",
      bonus: "string",
      damage: "string",
      damageType: "string",
      range: "string",
      effect: "string || undefined"
    }
  ],
  abilities: [
    {
      name: "string",
      effect: "string || undefined",
      damage: "string || undefined",
      damageType: "string || undefined",
      duration: "string || undefined",
      range: "string || undefined"
    }
  ],
  feats: [
    {
      name: "string",
      description: "string",
      effect: "string || undefined"
    }
  ],
  spells: [
    {
      name: "string",
      spellLevel: "number",
      effect: "string",
      range: "string",
      duration: "string",
      description: "string",
      saveDC: "number || undefined",
      damage: "string || undefined",
      damageType: "string || undefined"
    }
  ],
  saves: [
    {
      name: "string",
      bonus: "string",
    }
  ]
}`;

const DnD5EShopFormat = {
    inventory: [
        {
            name: "string",
            description: "string",
            effect: "string",
            rarity: "string",
            price: "string",
        },
    ] || [],
    name: "string || undefined",
};



export const getFormat = (checkboxState: CheckboxOptions, ruleset: Rulesets) => {
    let formatPrompt =
        "Return your response in a *VALID* JSON format with the following shape:\n";

    const format: any = baseFormat;
    if (checkboxState?.includeDescription) {
      format.description = "string";
      format.quirks = "[string]";
      format.goals = "[string]";
    }
    if (checkboxState?.includeBackground) {
        format.background = "string";
    }
    if (checkboxState?.includeStats) {
        format.stats = getStatsByRuleset(ruleset);
    }
    if (checkboxState?.includeLoot) {
        format.loot = `["string"] || []`;
        format.personalItems = `["string"] || []`;
    }
    if (checkboxState?.shopkeeper) {
        format.shop = DnD5EShopFormat;
    }
    
    console.log("formatPrompt:", JSON.stringify(formatPrompt, null, 2));
    formatPrompt += JSON.stringify(format);
    formatPrompt +=
        "\nMake sure to include a detailed portraitPrompt for generating a picture of the character and make sure to include the character's gender in the portraitPrompt.";
    return formatPrompt;
};

const getStatsByRuleset = (ruleset: Rulesets) => {

  if (!ruleset) return DnD5EStatsFormat;
  switch (ruleset) {
    case Rulesets.SWADE:
      return SavageWorldsStatsInterface;
      //return SavageWorldsStatsFormat;
    case Rulesets.DnD5E:
      return DnD5EStatsFormat;
    default:
      return DnD5EStatsFormat;
  }
}