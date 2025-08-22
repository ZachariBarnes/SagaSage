import query from "../utilities/QueryUtils.ts";
import dotenv from "dotenv";
import { User } from "../models/User.ts";

dotenv.config();

export const getCharacter = async (generationId: string, characterId = "") => {
  const selectClause = `SELECT * FROM characters WHERE`;
  const whereClause = characterId ? `id = $1` : `generation_id = $1`;
  const queryString = `${selectClause} ${whereClause}`;
  const values = [characterId || generationId];
  const result = await query(queryString, values);
  if (result.error) {
    console.log("Error in getCharacter:", result.message);
    throw result.message;
  }
  return result.result.rowCount !== 0 ? result.result.rows[0] : false;
};

export const createNewCharacter = async (
  character: any,
  imgURL: string,
  ruleset: String,
  validatedUser: User
) => {
  const queryString = `INSERT INTO characters 
    (user_id,
    world,
    ruleset,
    character_name,
    image_url,
    portrait_prompt,
    appearance,
    description,
    goals,
    quirks,
    backstory,
    items,
    shop,
    stat_block,
    generation_id,
    is_private)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING * `;
  const values = [
      validatedUser.userId,
      character.world || null, //probably null
      ruleset,
      character.name,
      imgURL,
      character.portraitPrompt,
      character.appearance,
      character.description,
      { quirks: character.goals }, //Needs to be JSON
      { quirks: character.quirks }, //Needs to be JSON
      character.background,
      { personalItems: character.personalItems, loot: character.loot }, //Needs to be JSON
      character.shop, //Also needs to be JSON but should already be in that format
      character.stats, //Also needs to be JSON but should already be in that format
      character.generationId,
      (character.isPrivate || false)
  ];
  const result = await query(queryString, values);
  if (result.error) {
    console.log("Error in createNewCharacter:", result.message);
    throw result.message;
  }
  return result.result.rows[0];
};

export const updateCharacter = async (
  character: any,
  imgURL: string,
  ruleset: String,
  validatedUser: User
) => {
  const queryString = `UPDATE characters SET 
    world = $1,
    ruleset = $2,
    character_name = $3,
    image_url = $4,
    portrait_prompt = $5,
    appearance = $6,
    description = $7,
    goals = $8,
    quirks = $9,
    backstory = $10,
    items = $11,
    shop = $12,
    stat_block = $13,
    modified_date = (now() AT TIME ZONE 'utc'::text)
    is_private = $14
    WHERE id = $15
    AND generation_id = $16
    RETURNING *`;
  const values = [
    character.world || null, //probably null
    ruleset,
    character.name,
    imgURL,
    character.portraitPrompt,
    character.appearance,
    character.description,
    { goals: character.goals }, //Needs to be JSON
    { quirks: character.quirks }, //Needs to be JSON
    character.background,
    { personalItems: character.personalItems, loot: character.loot }, //Needs to be JSON
    character.shop, //Also needs to be JSON but should already be in that format
    character.stats, //Also needs to be JSON but should already be in that format
    character.isPrivate || false,
    character.id,
    character.generationId
  ];
  const result = await query(queryString, values);
  if (result.error) {
    console.log("Error in updateCharacter:", result.message);
    throw result.message;
  }
  return result.result.rows[0];
};

export async function selectCharacterList(
  sortColumn: string,
  sortOrder: string,
  debug: boolean,
  userId = ""
): Promise<any> {
  const whereClause = userId
    ? `WHERE user_id = $1`
    : debug
    ? ""
    : `WHERE is_private = false AND reports = 0`;
  const orderClause = `ORDER BY ${sortColumn} ${sortOrder}`;
  const queryString = `SELECT id, character_name, ruleset, image_url, portrait_prompt, user_id, world, modified_date, likes, dislikes, reports 
    FROM characters ${whereClause} ${orderClause} LIMIT 100`;
  const values = userId ? [userId] : [];
  const result = await query(queryString, values);
  if (result.error) {
    console.log("Error in getCharacterList:", result.message);
    throw result.message;
  }
  return result.result.rows;
}
