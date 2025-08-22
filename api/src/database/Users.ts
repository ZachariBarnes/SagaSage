import query from "../utilities/QueryUtils.ts";
import { User } from "../models/User.ts";

export const createNewUser = async (validatedUser: User) => {
    const queryString = `INSERT INTO users (username, email, picture) VALUES ($1, $2, $3) RETURNING *`;
    const values = [validatedUser.username, validatedUser.email, validatedUser.picture];
    const result = await query(queryString, values);
    if (result.error) {
        console.log("Error in createNewUser:", result.message);
        throw result.message;
    }
    return result.result.rows[0];
}

export const getUserByEmail = async (email: string) => {
    const queryString = `
    SELECT *, 
    (SELECT session_id FROM sessions s WHERE s.user_id=u.id ORDER BY s.created_date DESC LIMIT 1) AS session_id
    FROM users u 
    WHERE email = $1`;
    const values = [email];
    const result = await query(queryString, values);
    console.log("Query Result: ", result)
    if (result.error) {
        throw result.message;
    }
    if (result.result.rowCount === 0) {
        return null;
    }
    if (result.result.rowCount > 1) {
        console.warn(`More than one user found for email: ${email}, returning first one.`);
    }
    return result.result.rows[0];
}

export const getUserById = async (id: string) => {
    const queryString = `SELECT * FROM users WHERE id = $1`;
    const values = [id];
    const result = await query(queryString, values);
    if (result.error) {
        throw result.message;
    }
    if (result.result.rowCount === 0) {
        return null;
    }
    if (result.result.rowCount > 1) {
        //this should never happen
        console.error(`More than one user found for id: ${id}, returning first one.`);
    }
    return result.result.rows[0];
}

export const getUserByUsername = async (username: string) => {
    const queryString = `SELECT * FROM users WHERE username = $1`;
    const values = [username];
    const result = await query(queryString, values);
    if (result.error) {
        throw result.message;
    }
    if (result.result.rowCount === 0) {
        return null;
    }
    if (result.result.rowCount > 1) {
        console.warn(`More than one user found for username: ${username}, returning first one.`);
    }
    return result.result.rows[0];
}

export const updateUser = async (user: any) => {
    const queryString = `UPDATE users SET username = $1, email = $2, picture = $3 WHERE id = $4 RETURNING *`;
    const values = [user.username, user.email, user.picture, user.id];
    const result = await query(queryString, values);
    if (result.error) {
        throw result.message;
    }
    return result.result.rows[0];
}

export const deleteUser = async (id: string) => {
    const queryString = `DELETE FROM users WHERE id = $1`;
    const values = [id];
    const result = await query(queryString, values);
    if (result.error) {
        throw result.message;
    }
    return result.result.rows[0];
}


export const checkExistingUser = async (validatedUser: User) => {
    const queryString = `SELECT * FROM users WHERE email = $1 OR username = $2`;
    const values = [validatedUser.email, validatedUser.username];
    const result = await query(queryString, values);
    if (result.error) {
        throw result.message;
    }
    return result.result.rowCount > 0;
}

export const updateUserLogin = async (user: any) => {
    const queryString = `UPDATE users SET last_login = $1 WHERE id = $2 RETURNING *`;
    const values = [new Date(), user.id];
    const result = await query(queryString, values);
    if (result.error) {
        throw result.message;
    }
    return result.result.rows[0];
}