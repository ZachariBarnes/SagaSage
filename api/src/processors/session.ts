
import { createSession, getSessionById } from "../database/Sessions.js";
import {} from "../utilities/utils.js";
import { v4 as uuidv4 } from 'uuid';

export async function startNewSession(user: any): Promise<any> {
    const sessionId = uuidv4();
    const session = await createSession(user, sessionId);
    const sessionObj = {
        sessionId: session.session_id,
        userId: user.id,
        username: user.username,
        picture: user.picture,
        expiry: session.expiration,
    };
    const sessionString = JSON.stringify(sessionObj);
    const cookie = Buffer.from(sessionString).toString("base64");
    const expiry = new Date(session.expiration); 
    return {cookie, expiry};
}

export async function isSessionValid(cookie:string): Promise<any> {
    try {
        const sessionObj = JSON.parse(Buffer.from(cookie, "base64").toString());
        const sessionId = sessionObj.sessionId;
        const userId = sessionObj.userId;
        const session = await getSessionById(sessionId);
        if (session.expiration < new Date() || session.user_id !== userId) {
            return false;
        }
        return true;
    } catch (error: any) {
        console.log(error);
        return false;
    }
}
export default { startNewSession };
