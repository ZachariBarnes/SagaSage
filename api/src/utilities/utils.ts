import { APIResponse } from "../models/APIResponse.ts";
import jwtDecode, { JwtPayload } from "jwt-decode";
import dotenv from "dotenv";
import { OAuth2Client } from 'google-auth-library';
import { requestHandler } from "../utilities/requestHandler.ts";
import { App, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { get } from "http";
import { parse } from "path";

dotenv.config();
const firebaseConfig = process.env.FIREBASE_CONFIG ? JSON.parse(process.env.FIREBASE_CONFIG!) : {};
const app: App = initializeApp(firebaseConfig);
const AUTH_OVERRIDE = process.env.AUTH_OVERRIDE || "AUTH_OVERRIDE_TOKEN";
const OVERRIDE_USER = process.env.OVERRIDE_USER || JSON.stringify({ email: 'Frieza@Dbz.com', name: 'Lord Frieza Emperor of the Universe' });

console.log("Debug mode:", process.env.DEBUG);
const debug = process.env.DEBUG === "true";
console.log("Debug mode:", debug);
const mockUser = {
  email: "FakeUser@faker.com",
  name: "Fake User",
}


const SD_DEFAULT_IMAGE_COST = 0.01;


async function verifyUser(token: string) {
  try {
    if (await verifyGoogleUser(token)) {
      return true;
    };
    return await verifyFirebaseUser(token);
  }
  catch (error) {
    console.debug(error);
    return false;
  }
}

async function verifyGoogleUser(token: string) {
    try {
      const client = new OAuth2Client();
      const CLIENT_ID = process.env.UI_GOOGLE_CLIENT_ID;
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const userid = payload?.["sub"];
      // If request specified a G Suite domain:
      // const domain = payload['hd'];
      console.log("Google User Verified: ", payload?.email);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
}

async function verifyFirebaseUser(token: string) {
  try {
    console.log("Verifying Firebase User");
    let auth = getAuth(app);
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;
    console.log("Firebase User Verified: ", decodedToken?.email);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function DecodeJWT(credential: any) {
  if (debug && credential === AUTH_OVERRIDE) {
    console.warn("Using Mock User - This should only happen in testing!");
    const user = JSON.parse(OVERRIDE_USER);
    return { errors: [], user };
  }
  if (!credential) return {errors:["No Credenitals Found"], user: null};
  const token: string = credential;
  try {
    const decoded:any = jwtDecode.default<JwtPayload>(token);
    decoded.username = getNickname(decoded.name);
    return { errors: [], user: decoded };
  } catch (error) {
    console.warn("Unable to decode User. Are you Testing?");
    console.debug(error);
    return { errors:[error], user: mockUser };
  }
}

export function DecodeCookies(cookies: string) {
  const errors: string[] = [];
  let user = null;
  try {
    if (cookies.indexOf("sagasage") === -1) {
      const missingCookieError = "Missing or Invalid Cookies Provided"
      console.debug(missingCookieError);
      errors.push(missingCookieError);
      return { errors, user };
    }
    const cookie = cookies.split("=")[1];
    console.log("Decoding Cookie String: ", debug ? cookie : "<Hidden Due to Log level>");
    const decoded = JSON.parse(Buffer.from(cookie, "base64").toString());
    if (debug) {
      console.log("Decoded Cookie: ", decoded);
    }
    if (decoded?.expiry < new Date()) {
      const expiryError = "Session Expired, please login again";
      console.debug(expiryError);
      errors.push(expiryError);
      return { errors, user };
    }
    user = decoded;
    return {errors, user};

  } catch (error: any) {
    console.debug(error);
    errors.push("Unexpected Error Decoding Cookie: " + error?.message || error);
    return {errors, user};
  }
}

export async function validateRequest(event: any, auth:string, body: any, promptRequired=true, cookies = ''): Promise<string[]> {
    const errors = [];
    if (body?.auth !== process.env.AUTH_KEY) {
        errors.push("Invalid Authorization");
    }
    if (!auth && !cookies.length) {
      errors.push("No Authorization Header Provided");
    }
    if (auth && auth !== process.env.AUTH_OVERRIDE) {
      console.log("Validating User JWT");
        const validUser = await verifyUser(auth);
        if (!validUser) {
            errors.push("Failed to Authenticate Google User");
        }
  }
  if (promptRequired) {
    const prompt = body?.prompt;
    if (!prompt) {
      errors.push("No prompt provided");
    }
  }
  if (errors.length > 0) {
    console.log("Validation Errors: ", errors);
  }
  return errors;
}

export async function validateRequestAndGetUser(event: any, auth: string, body: any, promptRequired=true, cookies=''): Promise<any> {
  const validationErrors = await validateRequest(event, auth, body, promptRequired, cookies);
  if (validationErrors.length === 0) {
    const { errors, user } = cookies.length
      ? DecodeCookies(cookies)
      : DecodeJWT(auth);
    return { errors, user };
  }
  return {validationErrors, user:null};
}

export function getSuccessResponse(data: Object): APIResponse {
  return new APIResponse(200, data, null, null);
}

export function getErrorResponse(message: Object): APIResponse {
  return new APIResponse(400, message, null, null);
}

export function healthCheck(): APIResponse {
  //Test path to make sure the function is working
  let message = "OK";
  const response = getSuccessResponse({ message });
  return response;
}

export function getDataFromEvent(event: any) {
  if (debug) { console.log("Incomming Event: ", event); }
  const body = typeof event.body === 'object' ? event.body : JSON.parse(event.body); //Accept input as string or JSON

  const auth = event.headers.Authorization || event.headers.authorization;
  const httpMethod = event.httpMethod || event.requestContext?.http?.method;
  const cookies = event.headers.cookies || '';
  const path = event.rawPath;
  console.log("path", path)
  console.log("Cookies recieved: ", cookies)
  return { body, auth, httpMethod, cookies, path };
}

export function getStatusCodeByResponse(response: string | undefined) {
  let statusCode = ErrorStatuses.get(response ?? "") || 200;
  return statusCode;
}

export enum ErrorMessages {
  NoPrompt = "No prompt provided",
  InvalidHTTPMethod = "Invalid HTTP Method",
  AuthenticationFailure = "Request failed with status code 401",
  InvalidAPIKey = "Failed to Authenticate with OpenAI API",
  AuthorizationFailue = "Invalid Authorization",
  TokenError = "Token count exceeds max tokens for model, Try again with a shorter prompt or use a bigger Model.",
}

const ErrorStatuses: Map<string, number> = new Map([
  ["", 500],
  [ErrorMessages.NoPrompt, 400],
  [ErrorMessages.InvalidHTTPMethod, 400],
  [ErrorMessages.AuthenticationFailure, 401],
  [ErrorMessages.AuthorizationFailue, 401],
]);


export function getCost(
  totalTokens: number = 0,
  // imageCount: number = 0,
  modelCost: number
) {
    let tokenCount = Math.ceil(totalTokens / 1000);
    if (tokenCount < 1) tokenCount = 1;
    let totalCost = 0;
    let tokenCost = 0;
    
    if (totalTokens > 0) {
    tokenCost = tokenCount * modelCost;
    }

    //Calculate total cost
    totalCost += tokenCost;

    return totalCost;
}

export function RoundCost(cost: number) {
  if (typeof cost !== "number") {
    try {
      cost = parseFloat(cost);
    }
    catch (error) {
      console.log(error);
      return cost;
    }
  }
  return cost.toFixed(2) >= "0.01" ? cost.toFixed(2) : cost.toFixed(3)
}

export function getImageCost(imageCount = 1, imageCost = SD_DEFAULT_IMAGE_COST) {
    //variables
    let totalCost = 0;

    if (imageCount > 0) {
    totalCost = imageCount * imageCost;
    }

    return RoundCost(totalCost);
}

export function wait(time:number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function getBase64Image(url:string) {
  return requestHandler
    .get(url, {
      responseType: "arraybuffer",
    })
    .then((response) =>
      Buffer.from(response.data, "binary").toString("base64")
    );
}

export function invalidHTTPMethod(httpMethod: string) {
  return !["GET", "POST"].includes(httpMethod);
}

export function getInvalidMethodResponse(httpMethod: string) {
  if (httpMethod === "GET") {
    return healthCheck();
  }
  return getErrorResponse({ errors: ["Invalid HTTP Method"] });
}

export function getNickname(name: string) {
  if (!name) return null;
  let nickname;
  if(name.indexOf("(")!==-1) {
    nickname = name.substring(name.indexOf("(")+1, name.indexOf(")"));
  }
  else {nickname = name.split(" ")[0]};
  return nickname;
}

export const uriEncode = (string: string) => {
  return encodeURIComponent(string);
}