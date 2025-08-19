import { OpenAPIResult } from "./OpenAPIResult.js";

// NOTE*: THIS IS THE ONLY VALID RESPONSE FORMAT FOR AWS LAMBDA
export interface APIResponse {
    statusCode: number;
    headers: {};
    body: string;
}

export class APIResponse {
    constructor(statusCode: number, data: any, cookie: string|null, expiry: Date|null) {
        this.statusCode = statusCode;
        this.headers = {
          // "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
          "Authorization,Content-Type,Set-Cookie,Cookies,Cookie",
          "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
          "Content-Type": "application/json",
          "Access-Control-Expose-Headers": "Set-Cookie",
        };

        if (cookie) {
            const sessionLength = process.env.SESSION_EXPIRY_SECONDS || '86400';
            const expiresDate: Date =
              expiry !== null
                ? expiry
                : new Date(Date.now() + parseInt(sessionLength) * 1000);
            console.log("expiresDate:", expiresDate);

            const expiryString = new Intl.DateTimeFormat("en-GB", {
              dateStyle: "medium",
              timeStyle: "long",
              timeZone: "UTC",
            }).format(expiresDate);
            console.log("expiryString:", expiryString);
            const cookieActual = `sagasage=${cookie}; Expires=${expiryString}; Domain=sagasage.com; SameSite=None; Secure=true; Path=/`;
            this.headers = {
              ...this.headers,
              crossDomain: true,
              //Domain=lambda-url.us-east-1.on.aws
              "Set-Cookie": cookieActual,
            };
            data.cookie = cookieActual;
        }

        this.body = JSON.stringify(data);

    }
}
