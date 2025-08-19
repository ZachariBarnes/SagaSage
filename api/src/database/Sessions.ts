import query from "../utilities/QueryUtils.js";
import dotenv from "dotenv";

dotenv.config();

export const createSession = async (user: any, sessionId: string) => {
    console.log("Login:", user, sessionId);
  const queryString = `INSERT INTO sessions (user_id, session_id, expiration) VALUES ($1, $2, $3) RETURNING *`;
  const values = [
      user.id,
      sessionId,
      new Date(Date.now() + (parseInt(process.env.SESSION_EXPIRY_SECONDS!) || 86400) * 1000),
  ];
  const result = await query(queryString, values);
  if (result.error) {
    throw result.message;
  }
  return result.result.rows[0];
};

export const getSessionById = async (id: string) => {
  const queryString = `SELECT * FROM sessions WHERE session_id = $1`;
  const values = [id];
  const result = await query(queryString, values);
  if (result.error) {
    throw result.message;
  }
  return result.result.rows[0];
}