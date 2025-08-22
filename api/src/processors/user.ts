
import { checkExistingUser, createNewUser, getUserByEmail, updateUserLogin } from "../database/Users.ts";
import { APIResponse } from "../models/APIResponse.ts";
import { getNickname } from "../utilities/utils.ts";
import { startNewSession } from "./session.ts";


export async function signUpNewUser(validatedUser: any): Promise<APIResponse> {
  console.log("SignUp/SignIn Request received. for user:" + validatedUser.username || validatedUser.name || validatedUser.email);
  try {
    const existingUser: boolean = await checkExistingUser(validatedUser);
    if (existingUser) {
      return login(validatedUser);
      //return new APIResponse(409, "User Already Exists, please login instead", null, null);
    }

    const user = await createNewUser(validatedUser);
    console.log("User Created: ", user.username);
    
    const { cookie, expiry } = await startNewSession(user);

    const response = new APIResponse(
      200,
      { message: `${user.username} Successfully Signed up.` },
      cookie,
      expiry
    );

    console.log("Response:", response);
    return response;
  } catch (error: any) {
    //Something very unexpected happened
    console.log(error);
    return new APIResponse(500, error.message || error, null, null);
  }
}

export async function login(user: any): Promise<APIResponse> {
    console.log("Login Request received. for user:" + user.username);
  try {
      const userExists = await checkExistingUser(user);
      if (!userExists) {
        return new APIResponse(404, { message: "User Not Found, please sign up instead" }, null, null);
      }
      const dbUser = await getUserByEmail(user.email);
    
      const { cookie, expiry } = await startNewSession(dbUser);
      await updateUserLogin(dbUser);
      const response = new APIResponse(
        200,
        { message: `${user.username} Successfully logged in.` },
        cookie,
        expiry
        );
      return response;
    } catch (error: any) {
      //Something very unexpected happened
      console.log(error);
      return new APIResponse(500, error.message || error, null, null);
    }
}

export default { signUpNewUser, login };