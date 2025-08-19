
const MAX_SEED = 18446744073709551616;
const workflow = {
  prompt: {
    "3": {
      inputs: {
        seed: 80721497939498,
        steps: 40,
        cfg: 8,
        sampler_name: "dpmpp_2m",
        scheduler: "karras",
        denoise: 1,
        model: ["10", 0],
        positive: ["6", 0],
        negative: ["7", 0],
        latent_image: ["5", 0]
      },
      class_type: "KSampler"
    },
    "4": {
      inputs: {
        ckpt_name: "XL/crystalClearXL_ccxl.safetensors"
      },
      class_type: "CheckpointLoaderSimple"
    },
    "5": {
      inputs: {
        width: 1024,
        height: 1024,
        batch_size: 1
      },
      class_type: "EmptyLatentImage"
    },
    "6": {
      inputs: {
        text: "((masterpiece)), full body portrait, best quality, HD, detailed eyes, (embedding:SimplepositiveXLv1:0.8), (RPG character portrait), ((A nun with fiery red hair and piercing green eyes, perched atop a church, scanning the horizon with an intense anger):1.5)",
        clip: ["10", 1]
      },
      class_type: "CLIPTextEncode"
    },
    "7": {
      inputs: {
        text: "(watermark:1.2), (logo:1.2), (Text:1.2) (website:1.2), close up, (lowres), (grainy, blurry), (double frame, cropped, out of frame), (low quality:1.2), (worst quality:1.2), mutated, deformed, extra limbs, extra fingers, extra claws, (embedding:unaestheticXLv13), extra face, nsfw:2, (female nudity:2), nsfw, naked, (tits:2), (penis:2), (bad eyes:1.8)",
        clip: ["10", 1]
      },
      class_type: "CLIPTextEncode"
    },
    "8": {
      inputs: {
        samples: ["3", 0],
        vae: ["4", 2]
      },
      class_type: "VAEDecode"
    },
    "9": {
      inputs: {
        filename_prefix: `SagaSage_${new Date().getTime()}`,
        images: ["8", 0]
      },
      class_type: "SaveImage"
    },
    "10": {
      inputs: {
        lora_name: "XL/DetailedEyes_V3.safetensors",
        strength_model: 1,
        strength_clip: 1,
        model: ["4", 0],
        clip: ["4", 1]
      },
      class_type: "LoraLoader"
    }
  }
};

const getWorkflow = (prompt:string) => {
    const seed = Math.floor(Math.random() * MAX_SEED);
    workflow.prompt[3].inputs.seed = seed;
    workflow.prompt[6].inputs.text = `((masterpiece)), full body portrait, best quality, HD, detailed eyes, (embedding:SimplepositiveXLv1:0.8), (RPG character portrait), ((${prompt}):1.5), detailed background`;
    return workflow;
}

export default getWorkflow;