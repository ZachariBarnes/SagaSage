import query from "../utilities/QueryUtils.js";
import { User } from "../models/User.js";
import { Usage } from "../models/Usage.js";

export const createNewUsage = async (validatedUser: User, usage: Usage) => {
    const queryString = `INSERT INTO usage (user_id, session_id, prompt_tokens, completion_tokens, total_tokens, cost, model) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [validatedUser.userId, validatedUser.sessionId, usage.prompt_tokens, usage.completion_tokens, usage.total_tokens, usage.cost, usage.model];
    const result = await query(queryString, values);
    //console.log("Query Result: ", result)
    if (result.error) {
        console.log("Error in createNewUsage:", result.message);
        throw result.message;
    }
    return result.result.rows[0];
}

export const updateUsageWithCharacter = async (usageId: string, characterId: string) => {
    const queryString = `UPDATE usage SET character_id = $1 WHERE id = $2 RETURNING *`;
    const values = [characterId, usageId];
    const result = await query(queryString, values);
    //console.log("Query Result: ", result)
    if (result.error) {
        console.log("Error in updateUsageWithCharacter:", result.message);
        throw result.message;
    }
    return result.result.rows[0];
}

