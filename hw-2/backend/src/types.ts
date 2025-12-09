export interface User {
    id: string;
    name: string;
}

export interface Session {
    sessionId: string;  
    code: string;
    language: 'javascript' | 'python';
    users: User[];
    createdAt: Date;
    updatedAt: Date;
}

export interface CodeChangePayload {
    sessionId: string;
    code: string;
}

export interface LanguageChangePayload {
    sessionId: string;
    language: 'javascript' | 'python';
}

export interface JoinSessionPayload {
    sessionId: string;
    user: User;
}
