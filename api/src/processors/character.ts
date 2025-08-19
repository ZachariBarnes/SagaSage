import { OpenAIApi } from "openai";
import { APIResponse } from "../models/APIResponse.js";
import { getChatCompletion, getOpenAIConfiguration } from "../utilities/openAI.js";
import { RoundCost, getStatusCodeByResponse, getSuccessResponse, uriEncode } from "../utilities/utils.js";
import * as defaults from "../utilities/defaults.js";
import { getFormat } from "../utilities/responseFormatter.js";
import { getUserByEmail } from "../database/Users.js";
import { createNewUsage, updateUsageWithCharacter } from "../database/Usage.js";
import dotenv from "dotenv";
import { createNewCharacter, getCharacter, selectCharacterList, updateCharacter } from "../database/Character.js";
import { uploadImageToS3 } from "../utilities/S3Manager.js";
import user from "./user.js";
import { User } from "../models/User.js";

dotenv.config();
const debug = process.env.DEBUG === "true";

export async function createCharacter(body: any, validatedUser: any = false): Promise<APIResponse> {
  const prompt = body?.prompt;
  const ruleset = body?.ruleset || defaults.ruleset;
  const useGold = body?.useGold || false;
  console.log("Request received. Prompt: " + prompt);
  const openai: OpenAIApi = getOpenAIConfiguration();
  try {
    if (validatedUser.email && (!validatedUser.userId || !validatedUser.sessionId)) {
      const dbUser = await getUserByEmail(validatedUser.email);
      validatedUser.userId = dbUser.id;
      validatedUser.username = dbUser.username;
      validatedUser.sessionId = dbUser.session_id;
    }
    if(debug) console.log("Validated User: ", validatedUser);
    let prompts = buildOpenAIPrompt(body);
    const completion = await getChatCompletion(openai, prompts, useGold, ruleset);
    const statusCode = getStatusCodeByResponse(completion.response);
    console.log("Response received. StatusCode: " + statusCode);
    const usage = await createNewUsage(validatedUser, completion.usage);
    completion.usage = usage; //Overwirte OpenAI usage with our own
    const generationId = usage.id;
    completion.response = completion.response?.replace("{", `{"generationId":"${generationId}", "userId":"${validatedUser.userId}", `);
    console.log(`User: ${validatedUser?.username} used ${usage.total_tokens} tokens for the ${usage.model} model resulting in total estimated cost of $${RoundCost(usage.cost)}`)
    const response = new APIResponse(statusCode, completion, null, null);
    console.log("Response:", response);
    return response;
  } catch (error: any) {
    //Something very unexpected happened
    console.log(error);
    return new APIResponse(500, error.message || error, null,  null);
  }
}

const buildOpenAIPrompt = (body: any) => {
  const { job, ruleset, goal, setting, includeSetting, prompt, characterOptions, useGold } = body;
  const initialPrompt = `Your job is to be the best ${job || defaults.job} for the ${ruleset || defaults.ruleset} ruleset tabletop campaign we are building.
                ${includeSetting ? ` The setting is ${setting || defaults.setting}.` : ""}
                It's up to you to ${goal || defaults.goal}`;

  const format = getFormat(characterOptions, ruleset);

  const fullPrompt = `${format}\n${"Generate a character who is: " + prompt}`;
  console.log("Initial Prompt: " + initialPrompt);
  const tokenCount = format.length / 4;
  console.log(`formatPrompt TokenCount :`, tokenCount)
  let messages = [
    {
      role: "system",
      content: initialPrompt,
    },
    { role: "user", content: fullPrompt },
  ];
  return messages;
}

export async function saveCharacter(
  body: any,
  validatedUser: any = false
): Promise<APIResponse> {
  const char = body?.character;
  const ruleset = body?.ruleset || defaults.ruleset;
  const imageResult = body?.imageResult;
  const imageUrl =  body?.imageUrl;
  
  try {
    if (
      validatedUser.email &&
      (!validatedUser.userId || !validatedUser.sessionId)
    ) {
      const dbUser = await getUserByEmail(validatedUser.email);
      validatedUser.userId = dbUser.id;
      validatedUser.username = dbUser.username;
      validatedUser.sessionId = dbUser.session_id;
    }
    if (debug) console.log("Validated User: ", validatedUser);
    console.log("Character String: ", char);
    const character = typeof char === "string" ? JSON.parse(char) : char;

    const imgUri = (imageUrl && !imageResult) ? imageUrl :
      await storeCharacterImage(validatedUser, character, imageResult);

    const existingCharacter = await getCharacter(character.generationId);
    let characterId = existingCharacter?.id;
    if (existingCharacter) {
      character.id = characterId;
      updateCharacter(character, imgUri, ruleset, validatedUser);
    }
    else {
      const saveCharacter = await createNewCharacter(character, imgUri, ruleset, validatedUser);
      characterId = saveCharacter.id;
    }
    const savedCharacterId = characterId;
    const updatedUsage = await updateUsageWithCharacter(
      character.generationId,
      savedCharacterId
    );

    const successMessage = `User: ${validatedUser?.username} saved character ${savedCharacterId} for usage ${updatedUsage.id}`;
    console.log(successMessage);

    const response = getSuccessResponse({ message: successMessage });
    console.log("Response:", response);
    return response;
  } catch (error: any) {
    //Something very unexpected happened
    console.log("Thrown Error:", error);
    return new APIResponse(500, error.message || error, null, null);
  }
}

export async function storeCharacterImage(user:any, character:any, imageResult: any): Promise<string> {
  const key = `characters/${user.userId}/${character.generationId}-${(character.name)}.png`;
  const uriEncodedKey = uriEncode(key);
  console.log("Key: ", key);
  const buf = Buffer.from(imageResult, "base64");
  if (!debug) {
    const s3Response = await uploadImageToS3(buf, key);
    console.log("S3 Response: ", s3Response);
  }
  const imgURL = `https://s3.amazonaws.com/image-generation.sagasage.com/${uriEncodedKey}`;
  return imgURL;
}

export async function getCharacterById(characterId: string): Promise<APIResponse> {
  try {
    const character = await getCharacter('', characterId);
    const response = getSuccessResponse(character);
    console.log("Response:", response);
    return response;
  } catch (error: any) {
    //Something very unexpected happened
    console.log(error);
    return new APIResponse(500, error.message || error, null, null);
  }
}

export const getCharacterList = async (body: any): Promise<APIResponse> => {
  const sortOrder = body?.sort || 'desc'; //should come in as 'asc' or 'desc'
  const sortColumn = body?.sortBy == "likes" ? "likes" : "modified_date";
  const debug = body?.debug || false;
  const userId = body.userID || false;
  try {
    const characters = await selectCharacterList(sortColumn, sortOrder, debug, userId);
    const response = getSuccessResponse(characters);
    console.log("Response:", response);
    return response;
  } catch (error: any) {
    //Something very unexpected happened
    console.log(error);
    return new APIResponse(500, error.message || error, null, null);
  }
}

export const getCharacterOrList = async (body: any, path: string, validatedUser?: User): Promise<APIResponse> => {
  console.log("Path: ", path);
  switch (path) {
    case "/character":
      console.log("Getting character by id: ", body?.characterId);
      return getCharacterById(body?.characterId);
    case "/my-characters":
      console.log("Getting character list for user: ", validatedUser?.username);
      return getCharacterList({ ...body, userID: validatedUser?.userId });
    default:
      console.log("Getting general character list");
      return getCharacterList(body);
  }
}