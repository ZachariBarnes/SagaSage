import * as OpenAI from "openai";
import dotenv from 'dotenv';
import { OpenAPIResult } from "../models/OpenAPIResult.js";
import { ErrorMessages, getCost } from "./utils.js";
import { GptModels } from "../models/GptModels.js";
import { Rulesets } from "../models/Rulesets.js";
import { Usage } from "../models/Usage.js";

dotenv.config();

const Models = new GptModels();

export function getOpenAIConfiguration(): OpenAI.OpenAIApi {
    const configuration = new OpenAI.Configuration({
        organization: process.env.OPENAI_API_ORG,
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAI.OpenAIApi(configuration);
    return openai;
}

export const GetResultFromCompletion = (completion: OpenAI.CreateChatCompletionResponse): OpenAPIResult => {
    const choices: OpenAI.CreateChatCompletionResponseChoicesInner[] = completion.choices;
    const model: string = completion.model;
    const usage = completion.usage || getNullUsage(model);
    const generatedText: string | undefined = choices[0]?.message?.content //Only one message expected from Chat Completion API
    const result: OpenAPIResult = {
        model,
        response: generatedText,
        usage,
        success: generatedText ? true : false
    }

    return result;
}

const getNullUsage = (model:string): Usage => {
    return {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
        model,
        cost: 0
    }
}

export async function getChatCompletion(openai: OpenAI.OpenAIApi, messages: any[], useGold: boolean = false, ruleset:Rulesets): Promise<OpenAPIResult> {
    let usage = {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
    };
    const estimateResponseTokens = 1500; //should be more than enough for a response 99.9% of the time
    const tokenCount = (messages.reduce((acc, message) => acc + message.content.length, 0) / 3);
    const totalTokenEstimate = tokenCount + estimateResponseTokens;
    const model = Models.findModel(totalTokenEstimate, useGold);
    console.log(`Total Token Estimate: ${totalTokenEstimate}, Selecting model: ${model.tag}`);
    if (tokenCount > model.maxTokens) {
        const error = { message: ErrorMessages.TokenError };
        return completionError(error, model.tag, usage);
    }
    const modelToUse = model.name;

    try {
        console.log("Sending request to OpenAI API");
        usage.prompt_tokens = tokenCount;
        usage.total_tokens = tokenCount;
        const completion = await openai.createChatCompletion({
            model: modelToUse,
            messages,
        });
        console.log("Request sent to OpenAI API");

        const result: OpenAPIResult = GetResultFromCompletion(completion.data);
        if(result.usage){
            result.usage.cost = getCost(result?.usage?.total_tokens, model.cost);
            result.usage.model = model.tag;
        }
        else { //estimate Usage if not provided
            result.usage = {
              ...usage,
              completion_tokens: estimateResponseTokens,
              total_tokens: totalTokenEstimate,
              cost: getCost(totalTokenEstimate, model.cost),
              model: model.tag,
            };
        }
        result.model = model.tag;
        result.ruleset = ruleset;
        return result;
    } catch (error: any) {
        return completionError(error, model.tag, usage);
    }
}

const completionError = (error: any, model: string, usage:any = undefined) => {
    console.log(error.message);
    const failedResult: OpenAPIResult = {
        success: false,
        model,
        response:
            error.message === ErrorMessages.AuthenticationFailure
                ? ErrorMessages.InvalidAPIKey
                : error.message,
        usage,
    };
    return failedResult;
}