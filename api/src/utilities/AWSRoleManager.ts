import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import dotenv from "dotenv";

dotenv.config();

const REGION = process.env.REGION || "us-east-1";
const ROLE_ARN = process.env.AWS_SAVE_ROLE_ARN;
const credentialDuration = parseInt(process.env.AWS_CREDENTIAL_DURATION_SECONDS!) || 900;

export const client = new STSClient({ region: REGION });

export const getTempCredentials = async () => {
  try {
    // Returns a set of temporary security credentials that you can use to
    // access Amazon Web Services resources that you might not normally
    // have access to.
    const roleCredentials = {
      RoleArn: ROLE_ARN!,
      RoleSessionName: "saveLambda-" + Date.now(),
      DurationSeconds: credentialDuration,
    };
    const command = new AssumeRoleCommand(roleCredentials);
    // The Amazon Resource Name (ARN) of the role to assume.
    //RoleArn: "ROLE_ARN",
    // An identifier for the assumed role session.
    //RoleSessionName: "session1",
    // The duration, in seconds, of the role session. The value specified
    // can range from 900 seconds (15 minutes) up to the maximum session
    // duration set for the role.
    //DurationSeconds: 900,
    //);
    const response = await client.send(command);
    console.log(response);
    return response;

  } catch (err) {
    console.error(err);
  }
};
