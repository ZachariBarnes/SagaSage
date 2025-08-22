import { OpenAIApi } from "openai";
import { APIResponse } from "../models/APIResponse.ts";
import { getOpenAIConfiguration } from "../utilities/openAI.ts";
import { getBase64Image, getImageCost, wait } from "../utilities/utils.ts";
import * as defaults from "../utilities/defaults.ts";
import { StableDiffImageRequest } from "../models/Templates/StableDiffImageRequest.ts";
import { requestHandler } from "../utilities/requestHandler.ts";
import dotenv from "dotenv";
import getWorkflow from "../utilities/ComfyUiWorkflow.ts";

dotenv.config();
const debug = process.env.DEBUG === "true";

export async function createPortrait(
  body: any,
  validatedUser: any = false
): Promise<APIResponse> {
  const prompt = body?.prompt;
  const useComfy = body?.useExperimental || false;
  console.log("Request received. Prompt: " + prompt);
  const useOpenAIImageGen = body?.useOpenAIImageGen || false; //Not implemented yet
  const openai: OpenAIApi = getOpenAIConfiguration();
  let openAiResult: any = "";
  let response: any = "";
  try {
    // let prompts = buildOpenAIPrompt(body);
    // completion = await getChatCompletion(openai, prompts);
    //const statusCode = getStatusCodeByResponse(completion.response);
    let response: any;
    if (useComfy) {
      console.log("Using experimental image generation");
      response = await GenerateComfyUIImage(prompt);
    } else {
      response = await GenerateTBFMImage(prompt);
    }

    console.log(
      `User: ${validatedUser?.email} used ${
        useOpenAIImageGen ? "OpenAI" : "SD_TBFM"
      } 
                Image Generation, resulting in total cost of $${
                  /*useOpenAIImageGen ? */ getImageCost() /*: getTBFMCost()*/
                }`
    );

    const result = useOpenAIImageGen ? openAiResult : response;
    return new APIResponse(200, result, null, null);
  } catch (error: any) {
    //Something very unexpected happened
    console.log(error);
    return new APIResponse(500, error.message || error, null, null);
  }
}

const buildOpenAIImagePrompt = (body: any) => {
  const { job, ruleset, goal, setting, includeSetting, prompt } = body;

  const initialPrompt = `Your job is to be the best ${
    job || defaults.job
  } for the ${
    ruleset || defaults.ruleset
  } ruleset tabletop campaign we are building.
                ${
                  includeSetting
                    ? ` The setting is ${setting || defaults.setting}.`
                    : ""
                }
                It's up to you to ${goal || defaults.goal}`;

  console.log("Initial Prompt: " + initialPrompt);
  let messages = [
    {
      role: "system",
      content: initialPrompt,
    },
    { role: "user", content: prompt },
  ];
  return messages;
};

const GenerateTBFMImage = async (prompt: string = "") => {
  try {
    let response: any = "";
    let requestBody = {
      ...StableDiffImageRequest,
      prompt: prompt,
      negative_prompt:
        "bad-hands-5, easynegative, bad_prompt_version2, BadNegAnatomyV1, bad face, melting face, nsfw, naked, nudity, penis, topless"
    };

    try {
      const Auth = process.env.TBFM_AUTH || "";
      const requestOptions = {
        rejectUnauthorized: false,
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: Auth,
          Accept: "*/*",
        },
      };
      const url = process.env.TBFM_URL || "";
      const { data } = await requestHandler.post(
        url,
        requestBody,
        requestOptions
      );
      response = data;
    } catch (error) {
      console.log(error);
      return "";
    }
    return response;
  } catch (error) {
    console.log("error:", error);
    return "Error Generating Images";
  }
};

const GenerateComfyUIImage = async (prompt: string = "") => {
  try {
    //console.log(`g0eneratePortrait: { Prompt: ${prompt}\n, Character:${character}, Mock? ${mockData}`);
    let response: any = "";
    let requestBody = getWorkflow(prompt);
    //console.log(`Image Request: ${JSON.stringify(requestBody)}`);
    // Simple POST request with a JSON body using fetch
    try {
      if (debug) console.log("Attempting HTTP Call to ComfyUI");
      const Auth = process.env.TBFM_AUTH || "";
      const requestOptions = {
        rejectUnauthorized: false,
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: Auth,
          Accept: "*/*",
        },
      };
      const url = `${process.env.COMFY_UI_URL}/prompt` || "";
      //Queue up the request
      const promptData = await requestHandler.post(
        url,
        requestBody,
        requestOptions
      );
      console.log("");
      console.log(`Prompt Data: ${promptData}`);
      const promptId = promptData.data.prompt_id;
      console.log("");
      console.log(`Prompt ID: ${promptId}`);
      console.log("");
      // Now Get the Prompt History Information to find the FileName
      let filename: string = "";
      let error = false;
      const startTime = new Date().getTime();
      const promptHistoryUrl = `${process.env.COMFY_UI_URL}/history/${promptId}`;
      while (!filename && !error) {
        try {
          const promptHistory = await requestHandler.get(
            promptHistoryUrl,
            requestOptions
          );
          //console.log(`Prompt History: ${JSON.stringify(promptHistory.data)}`);
          if (promptHistory.data[promptId]) {
            console.log(
              `Prompt ouput: ${JSON.stringify(
                promptHistory.data[promptId].outputs[9],
                null,
                2
              )}`
            );
            filename =
              promptHistory.data[promptId].outputs[9].images[0].filename;
            console.log(`Filename: ${filename}`);
          } else {
            if (debug) {
              console.log(
                `Polling Server for results...\nNo Response yet, Elapsed time is: ${
                  (new Date().getTime() - startTime) / 1000
                } Seconds.\nWaiting 1 second...`
              );
            }
            await wait(1000); // wait one second before polling again
          }
        } catch (er) {
          console.log(`Error getting prompt history: ${er}`);
          error = true;
          response = "Error Generating Images";
        }
      }
      if (!error) {
        //Get Image
        const imageUrl = `${process.env.COMFY_UI_URL}/view?filename=${filename}`;
        try {
          const base64Image = await getBase64Image(imageUrl);
          if (base64Image) {
            response = { images: [base64Image] };
          } else {
            response = "Error Generating Images";
          }
        } catch (er) {
          console.log(`Error getting image data: ${er}`);
          error = true;
          response = "Error Generating Images";
        }
      }
      return response;
    } catch (error: any) {
      console.log("Error Keys:", Object.keys(error))
      if (error.response) {
        const { response } = error;
        console.log("Error Response Keys:", Object.keys(response));
        if(response.data)
          console.log("Error Response Data:", JSON.stringify(response.data));
        else
          console.log("Error Response:", response)
      }
      if (error.message)
        console.log("Error:", error.message);
      else
        console.log("Error:", error)
      return "";
    }
    return response;
  } catch (error) {
    console.log("error:", error);
    return "Error Generating Images";
  }
};
