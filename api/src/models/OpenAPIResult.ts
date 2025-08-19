import { Usage } from "./Usage.js";

export interface OpenAPIResult {
  model: string; //deprecated - Now in Usage
  response: string | undefined;
  usage: Usage;
  success: boolean;
  ruleset?: string;
}