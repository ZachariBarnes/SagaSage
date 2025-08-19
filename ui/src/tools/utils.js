import mockImageResult from "../mockData/mockImageResult.js";
import promptModifiers from "./PromptModifiers.js";
import {
  getSkills,
  getLootList,
  getSaves,
  getShopInventory,
  getAttributes,
  getAttacks,
  getSpells,
  getClasses,
  getPirmaryStats,
  getFeats,
  hasSpells,
  hasFeats,
  hasAbilities,
  hasAttacks
} from "./characterUtils.js";
import { Rulesets } from "../models/Rulesets.ts";
import { postToAPI } from "./requestHandler.js";

export async function generatePortrait(prompt = "", character, mockData, credentials, experimental=false) {
    if (mockData) {
      return mockImageResult;
    } else {
      let requestBody = {
        prompt: prompt || character.portraitPrompt || character.appearance,
        auth: process.env.REACT_APP_AUTH_KEY,
        useExperimental: experimental,
      };
      const url = `${process.env.REACT_APP_SD_API_URL}/portrait`;
      const response = await postToAPI(url, requestBody, credentials);
      return response.images[0];
    }
}

export async function saveCharacter(character, imageResult, ruleSet) {
  try {
    let requestBody = {
      character: character,
      auth: process.env.REACT_APP_AUTH_KEY,
      imageResult: imageResult,
      imageUrl: character.imageUrl,
      ruleset: ruleSet,
    };
    const url = `${process.env.REACT_APP_SAVE_CHARACTER_API_URL}/save`;
    const response = await postToAPI(url, requestBody);
    return response;
  } catch (error) {
    console.log("saveCharacter error:", error);
    return { error: error, message: "Error saving character." };
  }
}

export const getImgSrc = (imageBytes) => {
  return "data:image/png;base64," + imageBytes;
};

export const buildPromptModifier = (checkboxState) => {
  let rawModifiers = [];
  for (const key in checkboxState) {
    if (Object.hasOwnProperty.call(checkboxState, key)) {
      if (checkboxState[key]) {
        rawModifiers.push(promptModifiers[key]);
      }
    }
  }

  let promptModifier = "";
  if (checkboxState.shopkeeper) {
    promptModifier += promptModifiers.shopkeeper;
    rawModifiers.splice(rawModifiers.indexOf(promptModifiers.shopkeeper), 1);
  }

  if (checkboxState.shopkeeper && rawModifiers.length > 0) {
    promptModifier += " Additionally, include ";
    promptModifier += joinRawModifiers(rawModifiers);
  } else if (rawModifiers.length > 0) {
    promptModifier += "Include ";
    promptModifier += joinRawModifiers(rawModifiers);
  }
  return promptModifier;
};

const joinRawModifiers = (rawModifiers) => {
  if (rawModifiers.length === 1) return rawModifiers[0] + ".";
  rawModifiers[rawModifiers.length - 1] =
    "and " + rawModifiers[rawModifiers.length - 1];
  return rawModifiers.join(", ") + ".";
};

export const isJSON = (json) => {
  if (typeof json !== "string") {

    return false;
  }
  try {
    JSON.parse(json);
    return true;
  } catch (error) {
    console.log("isJSON error:", error);
    return false;
  }
};

export function sanitize(maybeJson) {
  if (isJSON(maybeJson)) {
    return maybeJson; //def Json
  } else {
    if (maybeJson.indexOf("```json") !== -1) {
      console.log("gpt4-preview response found");
      maybeJson = maybeJson.replace("json", "");
      maybeJson = maybeJson.replaceAll("```", "");
    }
    //try fix Json
    //remove all linebreaks
    maybeJson = maybeJson.replace(/(\r\n|\n|\r)/gm, "");
    //remove all comments
    maybeJson = maybeJson.replace(/(\/\*[\w\W]*?\*\/)|(\/\/.*$)/gm, "");
    //remove any extra escape characters
    maybeJson = maybeJson.replace(/\\/g, "");
    //remove trailing commas
    maybeJson = maybeJson.replace(/,(\s*})/g, "$1");
    maybeJson = maybeJson.replace(/,(\s*])/g, "$1");
    //make sure all keys are quoted
    maybeJson = maybeJson.replace(
      /([{,]\s*)([A-Za-z0-9_]+)(\s*:)/g,
      '$1"$2"$3'
    );
    //make sure all values are quoted
    maybeJson = maybeJson.replace(
      /(:\s*)([A-Za-z0-9_]+)(\s*[},])/g,
      '$1"$2"$3'
    );

    return maybeJson;
  }
}

export const getSpellLabel = (ruleset) => {
  switch (ruleset) {
    case Rulesets.SWADE:
      return "Powers";
    case Rulesets.DnD5E:
    default:
      return "Spells";
  }
}

export const getFeatLabel = (ruleset) => {
  switch (ruleset) {
    case Rulesets.SWADE:
      return "Edges";
    case Rulesets.DnD5E:
    default:
      return "Feats";
  }
};

export function toPascalCase(s) {
  return `${s.charAt(0).toUpperCase() + s.slice(1)}`;
}

export {
  getAttributes,
  getSkills,
  getSaves,
  getLootList,
  getShopInventory,
  getAttacks,
  getSpells,
  getClasses,
  getPirmaryStats,
  getFeats,
  hasSpells,
  hasFeats,
  hasAttacks,
  hasAbilities
};
