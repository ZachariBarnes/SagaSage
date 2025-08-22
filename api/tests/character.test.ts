import { getChatCompletion } from "../src/utilities/openAI.ts";
import { getUserByEmail } from "../src/database/Users.ts";
import { createNewUsage, updateUsageWithCharacter } from "../src/database/Usage.ts";
import { uploadImageToS3 } from "../src/utilities/S3Manager.ts";
import { uriEncode, getSuccessResponse } from "../src/utilities/utils.ts";
import {
  createNewCharacter,
  getCharacter,
  selectCharacterList,
  updateCharacter,
} from "../src/database/Character.ts";

import {
  createCharacter,
  saveCharacter,
  storeCharacterImage,
  getCharacterOrList,
  getCharacterById,
  getCharacterList,
} from "../src/processors/character.ts";

/**
 * Tests for src/processors/character.ts
 *
 * Note: Mocks are set up for modules that character.ts depends on so tests can run deterministically.
 */

process.env.DEBUG = "false";

jest.mock("../src/utilities/openAI", () => ({
  getChatCompletion: jest.fn(),
  getOpenAIConfiguration: jest.fn(),
}));

jest.mock("../src/database/Users", () => ({
  getUserByEmail: jest.fn(),
}));

jest.mock("../src/database/Usage", () => ({
  createNewUsage: jest.fn(),
  updateUsageWithCharacter: jest.fn(),
}));

jest.mock("../src/database/Character", () => ({
  createNewCharacter: jest.fn(),
  getCharacter: jest.fn(),
  selectCharacterList: jest.fn(),
  updateCharacter: jest.fn(),
}));

jest.mock("../src/utilities/S3Manager", () => ({
  uploadImageToS3: jest.fn(),
}));

jest.mock("../src/utilities/responseFormatter", () => ({
  getFormat: jest.fn(() => "MOCK_FORMAT"),
}));

jest.mock("../src/utilities/utils", () => ({
  RoundCost: jest.fn((c: any) => Number(c).toFixed ? Number(c).toFixed(2) : c),
  getStatusCodeByResponse: jest.fn(() => 200),
  getSuccessResponse: jest.fn((d: any) => ({ success: true, payload: d })),
  uriEncode: jest.fn((k: string) => encodeURIComponent(k)),
}));

jest.mock("../src/utilities/defaults", () => ({
  job: "adventurer",
  ruleset: "mockRuleset",
  setting: "mockSetting",
  goal: "mockGoal",
}));



const mockedGetChatCompletion = getChatCompletion as jest.Mock;
const mockedGetUserByEmail = getUserByEmail as jest.Mock;
const mockedCreateNewUsage = createNewUsage as jest.Mock;
const mockedUpdateUsageWithCharacter = updateUsageWithCharacter as jest.Mock;
const mockedCreateNewCharacter = createNewCharacter as jest.Mock;
const mockedGetCharacter = getCharacter as jest.Mock;
const mockedSelectCharacterList = selectCharacterList as jest.Mock;
const mockedUploadImageToS3 = uploadImageToS3 as jest.Mock;
const mockedUriEncode = uriEncode as jest.Mock;
const mockedGetSuccessResponse = getSuccessResponse as jest.Mock;

describe("character processor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createCharacter: fills validatedUser from email, calls OpenAI and usage, injects generationId and userId into response", async () => {
    const mockCompletion = {
      response: '{"name":"TestChar"}',
      usage: { total_tokens: 10, cost: 0.02, model: "gpt-mock", id: "origUsageId" },
    };
    mockedGetChatCompletion.mockResolvedValue(mockCompletion);
    mockedGetUserByEmail.mockResolvedValue({ id: "user-1", username: "tester", session_id: "sess-1" });
    mockedCreateNewUsage.mockResolvedValue({ id: "gen-999", total_tokens: 10, cost: 0.02, model: "gpt-mock" });

    const body = { prompt: "brave warrior" };
    const validatedUser: any = { email: "me@example.com" };

    const resp: any = await createCharacter(body, validatedUser);

    expect(mockedGetUserByEmail).toHaveBeenCalledWith("me@example.com");
    expect(mockedGetChatCompletion).toHaveBeenCalled();
    expect(mockedCreateNewUsage).toHaveBeenCalled();
    expect(resp).toBeDefined();
    expect(resp.statusCode).toBe(200);
    // Ensure generationId and userId were injected into the JSON response string
    const responseBody = JSON.parse(resp.body);
    const response = JSON.parse(responseBody.response);
    expect(response.generationId).toBe("gen-999");
    expect(response.userId).toBe("user-1");
  });

  test("saveCharacter: when imageUrl provided and no imageResult, does not call uploadImageToS3 and saves new character", async () => {
    mockedGetUserByEmail.mockResolvedValue({ id: "user-2", username: "saver", session_id: "sess-2" });
    mockedGetCharacter.mockResolvedValue(null); // no existing character
    mockedCreateNewCharacter.mockResolvedValue({ id: "char-123" });
    mockedUpdateUsageWithCharacter.mockResolvedValue({ id: "usage-updated" });
    mockedUploadImageToS3.mockResolvedValue({ Key: "ignored" });

    const characterObj = { generationId: "gen-321", name: "SavedHero" };
    const body = {
      character: JSON.stringify(characterObj),
      imageUrl: "http://cdn.example.com/hero.png",
      ruleset: "mockRuleset",
    };

    const validatedUser: any = { email: "saver@example.com" };

    const resp: any = await saveCharacter(body, validatedUser);

    // Should use provided imageUrl and therefore not upload image
    expect(mockedUploadImageToS3).not.toHaveBeenCalled();
    expect(mockedCreateNewCharacter).toHaveBeenCalled();
    expect(mockedUpdateUsageWithCharacter).toHaveBeenCalledWith("gen-321", "char-123");
    expect(mockedGetSuccessResponse).toHaveBeenCalled();
    expect(resp).toEqual({ success: true, payload: expect.any(Object) });
  });

  test("storeCharacterImage: uploads to S3 and returns encoded URL", async () => {
    const sample = "abc";
    const base64 = Buffer.from(sample).toString("base64");
    mockedUploadImageToS3.mockResolvedValue({ Key: "ok" });
    mockedUriEncode.mockImplementation((k: string) => encodeURIComponent(k));

    const user = { userId: "u-10" };
    const character = { generationId: "g-10", name: "PicHero" };

    const result = await storeCharacterImage(user, character, base64);

    const expectedKey = `characters/${user.userId}/${character.generationId}-${character.name}.png`;
    // Ensure upload called with buffer and original key
    expect(mockedUploadImageToS3).toHaveBeenCalledWith(expect.any(Buffer), expectedKey);
    // Ensure returned URL uses the encoded key
    expect(result).toBe(`https://s3.amazonaws.com/image-generation.sagasage.com/${encodeURIComponent(expectedKey)}`);
  });

  test("getCharacterOrList routes to getCharacterById and to getCharacterList for /my-characters and default", async () => {
    // getCharacterById -> uses getCharacter('', characterId)
    mockedGetCharacter.mockResolvedValue({ id: "cid-1", name: "FromDB" });
    mockedSelectCharacterList.mockResolvedValue([{ id: "c1" }, { id: "c2" }]);
    mockedGetSuccessResponse.mockImplementation((d: any) => ({ ok: true, data: d }));

    const respChar = await getCharacterOrList({ characterId: "cid-1" } as any, "/character");
    expect(mockedGetCharacter).toHaveBeenCalledWith("", "cid-1");
    expect(respChar).toEqual({ ok: true, data: { id: "cid-1", name: "FromDB" } });

    const respMy = await getCharacterOrList({}, "/my-characters", { userId: "u-777", username: "owner" } as any);
    expect(mockedSelectCharacterList).toHaveBeenCalledWith("modified_date", "desc", false, "u-777");
    expect(respMy).toEqual({ ok: true, data: [{ id: "c1" }, { id: "c2" }] });

    const respDefault = await getCharacterOrList({}, "/unknown");
    expect(mockedSelectCharacterList).toHaveBeenCalledWith("modified_date", "desc", false, false);
    expect(respDefault).toEqual({ ok: true, data: [{ id: "c1" }, { id: "c2" }] });
  });
});