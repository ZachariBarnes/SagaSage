export interface User {
    id: string;
    userId: number;
    sessionId: string;
    username: string;
    email: string;
    picture: string;
    subscriber: boolean;
    last_login: Date;
    created_date: Date;
    modified_date: Date;
    }