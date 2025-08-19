import { APIResponse } from "./models/APIResponse.js";
import { getErrorResponse, getDataFromEvent, invalidHTTPMethod, getInvalidMethodResponse, validateRequestAndGetUser } from "./utilities/utils.js";
import { createCharacter, getCharacterOrList, saveCharacter } from "./processors/character.js";
import dotenv from 'dotenv';
import { createPortrait } from "./processors/portraits.js";
import { signUpNewUser } from "./processors/user.js";
dotenv.config();
const debug = process.env.DEBUG === "true";

export const character = async (event: any, context: any, callback: any): Promise<APIResponse> => {
 const { body, auth, httpMethod, cookies } = getDataFromEvent(event);

  if (invalidHTTPMethod(httpMethod)) {
    return getInvalidMethodResponse(httpMethod);
  }

  try {
    const {errors, user} = await validateRequestAndGetUser(event, auth, body, true, cookies);

    if (errors.length !== 0) {
      return getErrorResponse({ errors: errors.join("\n") });
    }
    //Actually create the character
    const result = await createCharacter(body, user);
    return result;
  } catch (error: any) {
    console.log(error);
    return getErrorResponse(error.message ? { errors: [error.message] } : { error });
  }
}

export const portrait = async (  event: any,  context: any,  callback: any): Promise<APIResponse> => {
 const { body, auth, httpMethod, cookies } = getDataFromEvent(event);

  if (invalidHTTPMethod(httpMethod)) {
    return getInvalidMethodResponse(httpMethod);
  }

  try {
    const {errors, user} = await validateRequestAndGetUser(event, auth, body, true, cookies);
    if (debug) console.log("User Errors:", errors);
    if (errors.length !== 0) {
      return getErrorResponse({ errors: errors.join("\n") });
    }
      const result = await createPortrait(body, user);
      return result;

  } catch (error: any) {
    console.log(error);
    return getErrorResponse(error.message ? { errors: [error.message] } : { error });
  }
};

export const signUpSignInLetMeBegin = async (  event: any,  context: any,  callback: any): Promise<APIResponse> => {
  const { body, auth, httpMethod } = getDataFromEvent(event);

  if (invalidHTTPMethod(httpMethod)) {
    return getInvalidMethodResponse(httpMethod);
  }

  try {
    const {errors, user} = await validateRequestAndGetUser(event, auth, body, false);

    if (errors.length !== 0) {
      return getErrorResponse({ errors: errors.join("\n") });
    }
    
    const result = await signUpNewUser(user);
    return result;
      
  } catch (error: any) {
    console.log(error);
    return getErrorResponse(error.message ? { errors: [error.message] } : { error });
  }
};


export const saveNewCharacter = async (
  event: any,
  context: any,
  callback: any
): Promise<APIResponse> => {
  const { body, auth, httpMethod, cookies } = getDataFromEvent(event);

  if (invalidHTTPMethod(httpMethod)) {
    return getInvalidMethodResponse(httpMethod);
  }

  try {
    const { errors, user } = await validateRequestAndGetUser(
      event,
      auth,
      body,
      false,
      cookies
    );

    if (errors.length !== 0) {
      return getErrorResponse({ errors: errors.join("\n") });
    }
    //Actually create the character
    const result = await saveCharacter(body, user);
    return result;
  } catch (error: any) {
    console.log(error);
    return getErrorResponse(
      error.message ? { errors: [error.message] } : { error }
    );
  }
};


export const getCharacters = async (
  event: any,
  context: any,
  callback: any
): Promise<APIResponse> => {
  const { body, auth, httpMethod, cookies, path } = getDataFromEvent(event);

  if (invalidHTTPMethod(httpMethod)) {
    return getInvalidMethodResponse(httpMethod);
  }

  try {
    const { errors, user } = await validateRequestAndGetUser(
      event,
      auth,
      body,
      false,
      cookies
    );

    // if (errors.length !== 0) {
    //   return getErrorResponse({ errors: errors.join("\n") });
    // }
    //Actually create the character
    const result = await getCharacterOrList(body, path, user);
    return result;
  } catch (error: any) {
    console.log(error);
    return getErrorResponse(
      error.message ? { errors: [error.message] } : { error }
    );
  }
};