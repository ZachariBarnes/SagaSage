import axios from "axios";
import https from "https";
import dotenv from "dotenv";

dotenv.config();

export const requestHandler = axios.create({
  baseURL: process.env.API_HOST,
});

requestHandler.defaults.httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

requestHandler.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

