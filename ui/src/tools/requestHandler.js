import axios from "axios";
const debug = process.env.NODE_ENV === "development";

export async function postToAPI(url, requestBody, credentials) {
  if (!requestBody) {
      requestBody = {
          prompt: "lorem ipsum",
          auth: process.env.REACT_APP_AUTH_KEY
      }
  }

  if(!requestBody.auth) {
      requestBody.auth = process.env.REACT_APP_AUTH_KEY
  }

  const requestOptions = {
    crossDomain: true,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      },
  };

  if (typeof credentials !=='string') {
    if (debug) { console.log("no credentials, fetching cookie"); }
    const allCookies = document.cookie;
    const cookie = allCookies
      .split(";")
      .find((cookie) => cookie.includes("sagasage"));
    if (cookie) {
      requestOptions.headers.cookies = cookie;
    }
  }
  else {
    requestOptions.headers.Authorization = credentials;
  }

  const result = await axios.post(url, requestBody, requestOptions);
  let data = result.data;
  if (debug && data.cookie) {
    //console.log("bodyCookie:", result.data.cookie);
    document.cookie =data.cookie.replace("Domain=sagasage.com", "Domain=localhost")
  } else if (data.cookie) {
    document.cookie = data.cookie;
  }
  if (data === false || data === 'false') {
    data = { status: 404, code: "404_NOT_FOUND", error: "Error fetching data." };
  }
  else {
    data.status = result.status;
    data.code = result.code;
  }
  return data;
}
