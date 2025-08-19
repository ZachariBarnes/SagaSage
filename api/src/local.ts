import { character, portrait, saveNewCharacter, signUpSignInLetMeBegin} from "./index.js";
import dotenv from 'dotenv';
//import {req} from "./test.js";
import { saveCharacter } from "./processors/character.js";
import { devNull } from "os";

dotenv.config();
const fbReq = {
  httpMethod: "POST",
  headers: {
    Authorization:
      "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ0ZmJkZTdhZGY0ZTU3YWYxZWE4MzAzNmJmZjdkMzUxNTk3ZTMzNWEiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiWmFjaGFyaSBCYXJuZXMgKFRocmFzb25pYykiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0Y2d1NU5aQzZMZnZiUU5vb0Q3bW9iNTRHWGc1LXQxR1ZfMlpQZ1BOOFkxTV9VPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3NhZ2FzYWdlLTM1ZmJiIiwiYXVkIjoic2FnYXNhZ2UtMzVmYmIiLCJhdXRoX3RpbWUiOjE3MDAzMjI3MjEsInVzZXJfaWQiOiJFekxYdkttRmpIaHdmeEpEZWtxcUpYSG1xRjgzIiwic3ViIjoiRXpMWHZLbUZqSGh3ZnhKRGVrcXFKWEhtcUY4MyIsImlhdCI6MTcwMDMyMjcyMSwiZXhwIjoxNzAwMzI2MzIxLCJlbWFpbCI6InNhYmluNjEyMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjEwNzg1NDg1OTI4MDQ3NzE3OTE5NyJdLCJlbWFpbCI6WyJzYWJpbjYxMjBAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.n6cgZyIVql63TCl_J1NDLSmBh-dNSxCAdMG9oyjKhnDE08cWyvzUJVTKnXN27nWa6MEejnewY4laTmySBFnCM9fToq77l0L67JVm6ALijtyLQbmNGOk0uhFAPn_BYuAN6CWd_GMEIqnDvb0CfFeiI6rQ1xcXx2u9Hr6qioQMxiXaBvVXn2kJEPQFOFjoP1-wocGh52oAStvR5Tqah3w2kyJCjxa3v4AWHUDNvWswPd8StsVbnKFs1q6vT5MjGQOxZw5VlGYmxkTnSwZMFUWXylvVKcTlLGU_GvOU5Hdx99gus-CxMyTUQUJ8VbKVIodFFCPjcJWyu-P4lqcRYivX1A",
    overrideUser: process.env.OVERRIDE_USER,
    //Authorization:
    //  "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc3NzBiMDg1YmY2NDliNzI2YjM1NzQ3NjQwMzBlMWJkZTlhMTBhZTYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2ODM4MzU2MzAsImF1ZCI6IjE2NDQwODExMTQ3MS04dXRnYXBqdm82MWo1bWo0OGZiM3VuNmY0cGhvcG9hay5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwNzg1NDg1OTI4MDQ3NzE3OTE5NyIsImVtYWlsIjoic2FiaW42MTIwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhenAiOiIxNjQ0MDgxMTE0NzEtOHV0Z2FwanZvNjFqNW1qNDhmYjN1bjZmNHBob3BvYWsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJuYW1lIjoiWmFjaGFyaSBCYXJuZXMgKFRocmFzb25pYykiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4YUt2VFdHYmdRdnhwemFHVTBpVzgxOVd5NEx3NFItM3RMMWVyVnhoUT1zOTYtYyIsImdpdmVuX25hbWUiOiJaYWNoYXJpIiwiZmFtaWx5X25hbWUiOiJCYXJuZXMiLCJpYXQiOjE2ODM4MzU5MzAsImV4cCI6MTY4MzgzOTUzMCwianRpIjoiZGYzNTFkM2Q4NjZkMjM3ZmVlNWU3ZjE3ODgxMTljM2VjN2RjNTgyNiJ9.te94m4D9KN451VXGHKRg96IeYlI44l2mGVEuMYvVjUbOrq1QvfH-17G_whXQ8eXlGIqPQnKE-CVIFdQe6cpzygUeMxQPd5jjOGS42kGrfnUWmjdI8ZHdSxDBsMzyaH3XsUG99oz6U8NMAv7R-BwCt0JK4FRtiicAzxSB4AtoQuyInb8p-efyswXcT6KaPF-ns4XtFo1KY7XMF0Qh5GiFbIplXL51lZFjPUcZzm_tf-Rv_An9kMYoAm6FvIv3tWpkhrznIL3ksRBteUoeyFUZZjRqFF_02vyYu6y6jUAWbhI09jol3RV3nGXnwP1amarukEReI7VVAqvdmNhf22wzhg",
  },
  body: {
    prompt:
      "a sexy demoness innkeeper who uses a whip in a rustic Inn\nThis character is a shopkeeper so generate a shop inventory for them including a shop description, item descriptions, item rarity, prices and item effects. Additionally, include a physical description for this character, a background for this character, a stat block for this character, and a list of loot and/or personal items for this character.",
    auth: process.env.AUTH_KEY,
    includeSetting: false,
    setting: "",
    ruleset: "Dungeons & Dragons 5th Edition",
    useGold: false,
    useExperimental: false,
    characterOptions: {
      includeDescription: true,
      includeBackground: true,
      includeStats: true,
      includeLoot: true,
      shopkeeper: true,
    },
  },
};


const testReq = {
  httpMethod: "POST",
  headers: {
    Authorization: process.env.AUTH_OVERRIDE,
    overrideUser: process.env.OVERRIDE_USER,
    //Authorization:
    //  "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc3NzBiMDg1YmY2NDliNzI2YjM1NzQ3NjQwMzBlMWJkZTlhMTBhZTYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2ODM4MzU2MzAsImF1ZCI6IjE2NDQwODExMTQ3MS04dXRnYXBqdm82MWo1bWo0OGZiM3VuNmY0cGhvcG9hay5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwNzg1NDg1OTI4MDQ3NzE3OTE5NyIsImVtYWlsIjoic2FiaW42MTIwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhenAiOiIxNjQ0MDgxMTE0NzEtOHV0Z2FwanZvNjFqNW1qNDhmYjN1bjZmNHBob3BvYWsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJuYW1lIjoiWmFjaGFyaSBCYXJuZXMgKFRocmFzb25pYykiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4YUt2VFdHYmdRdnhwemFHVTBpVzgxOVd5NEx3NFItM3RMMWVyVnhoUT1zOTYtYyIsImdpdmVuX25hbWUiOiJaYWNoYXJpIiwiZmFtaWx5X25hbWUiOiJCYXJuZXMiLCJpYXQiOjE2ODM4MzU5MzAsImV4cCI6MTY4MzgzOTUzMCwianRpIjoiZGYzNTFkM2Q4NjZkMjM3ZmVlNWU3ZjE3ODgxMTljM2VjN2RjNTgyNiJ9.te94m4D9KN451VXGHKRg96IeYlI44l2mGVEuMYvVjUbOrq1QvfH-17G_whXQ8eXlGIqPQnKE-CVIFdQe6cpzygUeMxQPd5jjOGS42kGrfnUWmjdI8ZHdSxDBsMzyaH3XsUG99oz6U8NMAv7R-BwCt0JK4FRtiicAzxSB4AtoQuyInb8p-efyswXcT6KaPF-ns4XtFo1KY7XMF0Qh5GiFbIplXL51lZFjPUcZzm_tf-Rv_An9kMYoAm6FvIv3tWpkhrznIL3ksRBteUoeyFUZZjRqFF_02vyYu6y6jUAWbhI09jol3RV3nGXnwP1amarukEReI7VVAqvdmNhf22wzhg",
  },
  cookies:
    "sagasage=eyJ1c2VySWQiOiI1IiwidXNlcm5hbWUiOiJUaHJhc29uaWMiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0Y2d1NU5aQzZMZnZiUU5vb0Q3bW9iNTRHWGc1LXQxR1ZfMlpQZ1BOOFkxTV9VPXM5Ni1jIiwiZXhwaXJ5IjoiMjAyMy0xMS0yMVQyMToyMTowMS4zODRaIn0=; Expires=21 Nov 2023, 16:42:22 UTC; Domain=sagasage.com; SameSite=None; Secure=true; Path=/",
  body: {
    prompt:
      "a sexy demoness innkeeper who uses a whip in a rustic Inn\nThis character is a shopkeeper so generate a shop inventory for them including a shop description, item descriptions, item rarity, prices and item effects. Additionally, include a physical description for this character, a background for this character, a stat block for this character, and a list of loot and/or personal items for this character.",
    auth: process.env.AUTH_KEY,
    includeSetting: false,
    setting: "",
    ruleset: "Dungeons & Dragons 5th Edition",
    useGold: false,
    useExperimental: false,
    characterOptions: {
      includeDescription: true,
      includeBackground: true,
      includeStats: true,
      includeLoot: true,
      shopkeeper: true,
    },
  },
};

const testOpenAI = async () => {
  console.log("Testing OpenAI");
  try {
    const newCharacter = await character(
      testReq,
      null,
      null
    );

    console.log(newCharacter);
  }
  catch (error) {
    console.log("Error in TestOpenAI:", error);
  }
}

const testStableDiff = async () => {
  console.log("Testing Stable Dif");
  try {
    testReq.body.prompt = "a sexy demoness innkeeper who uses a whip in a rustic Inn";
    const newPortrait = await portrait(
      testReq,
      null,
      null
    );
    console.log(newPortrait);
    console.log("response: ", newPortrait);
  } catch (error) {
    console.log("Error in TestStableDif:", error);
  }
};


const testSignUpLoginGoogle = async () => {
  console.log("Testing Signup");
  try {
    const user = await signUpSignInLetMeBegin(testReq, null, null);

    console.log(user);
  } catch (error) {
    console.log("Error in TestSignup:", error);
  }
};


const testSignUpLoginFirebase = async () => {
  console.log("Testing Signup");
  try {
    const user = await signUpSignInLetMeBegin(fbReq, null, null);

    console.log(user);
  } catch (error) {
    console.log("Error in TestSignup:", error);
  }
};

const testComfyUI = async () => {
  console.log("Testing ComfyUI");
  try {
    const comfyUIReq = testReq;
    comfyUIReq.body.prompt = "a sexy demoness innkeeper who uses a whip in a rustic Inn";
    comfyUIReq.body.useExperimental = true;
    const newPortrait = await portrait(comfyUIReq, null, null);
    console.log("response: ", newPortrait);
  } catch (error) {
    console.log("Error in TestStableDif:", error);
  }
};

const testSave = async () => {
  try {
    const request: any = {
      httpMethod: "POST",
      headers: {
        Authorization:
          "eyJhbGciOiJSUzI1NiIsImtpZCI6ImVkODA2ZjE4NDJiNTg4MDU0YjE4YjY2OWRkMWEwOWE0ZjM2N2FmYzQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxNjQ0MDgxMTE0NzEtOHV0Z2FwanZvNjFqNW1qNDhmYjN1bjZmNHBob3BvYWsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxNjQ0MDgxMTE0NzEtOHV0Z2FwanZvNjFqNW1qNDhmYjN1bjZmNHBob3BvYWsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDc4NTQ4NTkyODA0NzcxNzkxOTciLCJlbWFpbCI6InNhYmluNjEyMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNzA4MTA1MTU4LCJuYW1lIjoiWmFjaGFyaSBCYXJuZXMiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTE5KMlBSenJvZE1XZmtPYXpTQi1ILVNoMUlMSW1fTnNHaXo3NzJTc3liYTF3PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlphY2hhcmkiLCJmYW1pbHlfbmFtZSI6IkJhcm5lcyIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNzA4MTA1NDU4LCJleHAiOjE3MDgxMDkwNTgsImp0aSI6IjRhZmI3MGVkMzcwYWY5ZTMzODg2MzljZDFmY2IyMDlhMTYwNThmMDUifQ.VsaYSOreGPOgDxuUdAiVF0yA4Fv2HqyDq5BgsOiGCT0DwbEe4BqClAqLeLDQ5DEOE8KzO38cOPPVlgj8KjsPv4PduSWtwDlAHSFgQHxHMPXUpjvUY02f2E-XA8AcGllHO0_5nUixzRpCIzBn8jEsk9FdREZvdyBz9P8nGC_F7f0WqA00bKp6pWZ-PJOh6uQ7zFC6RmAIRwRjsLDqnicDqBOy1Q0hTZW4Vu1qfXxwTmjQHktFQ4ua3HuUSKltEhP3fo4gFl6wPF6y30Pcrw2l4uZWDATmpw3FnhZlrpEjUlLJXHKHq8vL83H24yDr860Q7ILFbeBHIfC_iaiFJDlhxw",
        Cookies:
          "sagasage=eyJzZXNzaW9uSWQiOiIzMWEzZmZlMy1mM2E3LTQwMDAtYjMzOS04NGYxNThkMWQ2MGYiLCJ1c2VySWQiOiI1IiwidXNlcm5hbWUiOiJUaHJhc29uaWMiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0Y2d1NU5aQzZMZnZiUU5vb0Q3bW9iNTRHWGc1LXQxR1ZfMlpQZ1BOOFkxTV9VPXM5Ni1jIiwiZXhwaXJ5IjoiMjAyNC0wMi0xN1QxNzo0NDoyMi45MzRaIn0=; Expires=17 Feb 2024, 17:44:22 UTC; Domain=sagasage.com; SameSite=None; Secure=true; Path=/"
        //Authorization:
        //  "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc3NzBiMDg1YmY2NDliNzI2YjM1NzQ3NjQwMzBlMWJkZTlhMTBhZTYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2ODM4MzU2MzAsImF1ZCI6IjE2NDQwODExMTQ3MS04dXRnYXBqdm82MWo1bWo0OGZiM3VuNmY0cGhvcG9hay5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwNzg1NDg1OTI4MDQ3NzE3OTE5NyIsImVtYWlsIjoic2FiaW42MTIwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhenAiOiIxNjQ0MDgxMTE0NzEtOHV0Z2FwanZvNjFqNW1qNDhmYjN1bjZmNHBob3BvYWsuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJuYW1lIjoiWmFjaGFyaSBCYXJuZXMgKFRocmFzb25pYykiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4YUt2VFdHYmdRdnhwemFHVTBpVzgxOVd5NEx3NFItM3RMMWVyVnhoUT1zOTYtYyIsImdpdmVuX25hbWUiOiJaYWNoYXJpIiwiZmFtaWx5X25hbWUiOiJCYXJuZXMiLCJpYXQiOjE2ODM4MzU5MzAsImV4cCI6MTY4MzgzOTUzMCwianRpIjoiZGYzNTFkM2Q4NjZkMjM3ZmVlNWU3ZjE3ODgxMTljM2VjN2RjNTgyNiJ9.te94m4D9KN451VXGHKRg96IeYlI44l2mGVEuMYvVjUbOrq1QvfH-17G_whXQ8eXlGIqPQnKE-CVIFdQe6cpzygUeMxQPd5jjOGS42kGrfnUWmjdI8ZHdSxDBsMzyaH3XsUG99oz6U8NMAv7R-BwCt0JK4FRtiicAzxSB4AtoQuyInb8p-efyswXcT6KaPF-ns4XtFo1KY7XMF0Qh5GiFbIplXL51lZFjPUcZzm_tf-Rv_An9kMYoAm6FvIv3tWpkhrznIL3ksRBteUoeyFUZZjRqFF_02vyYu6y6jUAWbhI09jol3RV3nGXnwP1amarukEReI7VVAqvdmNhf22wzhg",
      },
      body: {}//req
    };
    const newPortrait = await saveNewCharacter(request,null,null );
    console.log("response: ", newPortrait);
  } catch (error) {
    console.log("Error in TestStableDif:", error);
  }
};


async function test() {
  // await testOpenAI();
  // await testStableDiff();
  // await testComfyUI();
  // await testSignUpLoginGoogle();
  // await testSignUpLoginFirebase();
  // await testSave();
}
test();


