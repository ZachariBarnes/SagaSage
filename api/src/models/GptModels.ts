
export class GptModels {
  copper = {
    tag: "copper",
    name: "gpt-3.5-turbo",
    maxTokens: 4096,
    cost: 0.003,
  };
  silver = {
    tag: "silver",
    name: "gpt-3.5-turbo-16k",
    maxTokens: 16384,
    cost: 0.005,
  };
  electrum = {
    tag: "gold",
    name: "gpt-4-1106-preview",
    maxTokens: 128000,
    cost: 0.05,
  };
  gold = {
    tag: "gold",
    name: "gpt-4",
    maxTokens: 8192,
    cost: 0.06,
  };
  platinum = {
    tag: "platinum",
    name: "gpt-4",
    maxTokens: 32768,
    cost: 0.12,
  };

  findModel(tokenEstimate: number, useGpt4: boolean) {
    tokenEstimate;
    let targetModel = this.copper;
    if (useGpt4) {
      targetModel = this.electrum;
    }
    if (tokenEstimate < targetModel.maxTokens) {
      return targetModel;
    } else {
      return this.getNextModel(useGpt4);
    }
  }

  getNextModel(useGpt4: boolean) {
    if (!useGpt4) {
      return this.silver;
    }

    //As of 11/06/2023 Gpt4-Turbo is the most cost effective and powerful model availble
    return this.electrum;
  }
}


export interface GptModel {
    name: string,
    maxTokens: number,
    cost: number
}
