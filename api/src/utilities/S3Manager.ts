/*Create code to store, delete and retrieve files from S3 in the bucket S3_IMAGE_BUCKET in Typescript use Async/Await style promises */
import {
  S3Client,
  S3ClientConfig,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
import {getTempCredentials} from "./AWSRoleManager.ts";
import dotenv from "dotenv";

dotenv.config();

const S3_IMAGE_BUCKET = process.env.S3_IMAGE_BUCKET;
const REGION = process.env.REGION || "us-east-1";
const ROLE_ARN = process.env.AWS_SAVE_ROLE_ARN;
const credentialDuration = parseInt(process.env.AWS_CREDENTIAL_DURATION_SECONDS!) || 900;

let credentialsValidUntil: Date | null = null;
let credentials: any = null;

export const getClient = async () => {
    if (credentialsValidUntil && credentialsValidUntil > new Date()) {
        const credentialResponse = await getTempCredentials();
        credentials = credentialResponse?.Credentials;
        credentialsValidUntil = new Date(Date.now() + (credentialDuration * 1000));
    }
    const s3Config: S3ClientConfig = {
        region: REGION,
        credentials: credentials,
    };
    return new S3Client(s3Config);
}

export async function uploadImageToS3(image: Buffer, key: string) {
  const params = {
    Bucket: S3_IMAGE_BUCKET!,
    Key: key,
    Body: image,
    ContentType: "image/png",
    ACL: ObjectCannedACL.public_read,
    ContentEncoding: "base64",
  };
  try {
    const s3 = await getClient();
    const command = new PutObjectCommand(params);
    const response = await s3.send(command);
    console.log("Successfully uploaded image to S3", response);
    return response;
  } catch (error) {
    console.error("Error uploading image to S3", error);
    throw error;
  }
}

export async function deleteImageFromS3(key: string) {
  const params = {
    Bucket: S3_IMAGE_BUCKET!,
    Key: key,
  };
  try {
    const s3 = await getClient();
    const command = new DeleteObjectCommand(params);
    const response = await s3.send(command);
    //const response = await s3.deleteObject(params).promise();
    console.log("Successfully deleted image from S3", response);
    return response;
  } catch (error) {
    console.error("Error deleting image from S3", error);
    throw error;
  }
}

export async function retrieveImageFromS3(key: string) {
  const params = {
    Bucket: S3_IMAGE_BUCKET!,
    Key: key,
  };
  try {
    const s3 = await getClient();
    const command = new GetObjectCommand(params);
    const response = await s3.send(command);
    //const response = await s3.getObject(params).promise();
    console.log("Successfully retrieved image from S3", response);
    return response;
  } catch (error) {
    console.error("Error retrieving image from S3", error);
    throw error;
  }
}
