import { Injectable } from '@nestjs/common';
import { Session, User } from './types';

@Injectable()
export class SessionService {
    private sessions: Map<string, Session> = new Map();

    createSession(sessionId?: string, language: 'javascript' | 'python' = 'javascript'): Session {
        const sid = sessionId || this.generateSessionId();

        const session: Session = {
            sessionId: sid,
            code: '// Start coding...\n',
            language,
            users: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        this.sessions.set(sid, session);
        return session;
    }

    getSession(sessionId: string): Session | undefined {
        return this.sessions.get(sessionId);
    }

    getOrCreateSession(sessionId: string): Session {
        let session = this.getSession(sessionId);
        if (!session) {
            session = this.createSession(sessionId);
        }
        return session;
    }

    updateCode(sessionId: string, code: string): boolean {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.code = code;
            session.updatedAt = new Date();
            return true;
        }
        return false;
    }

    updateLanguage(sessionId: string, language: 'javascript' | 'python'): boolean {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.language = language;
            session.updatedAt = new Date();
            return true;
        }
        return false;
    }

    addUser(sessionId: string, user: User): boolean {
        const session = this.getOrCreateSession(sessionId);
        if (session) {
            // Remove existing user with same ID if exists
            session.users = session.users.filter(u => u.id !== user.id);
            session.users.push(user);
            session.updatedAt = new Date();
            return true;
        }
        return false;
    }

    removeUser(sessionId: string, userId: string): boolean {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.users = session.users.filter(u => u.id !== userId);
            session.updatedAt = new Date();
            return true;
        }
        return false;
    }

    getUsers(sessionId: string): User[] {
        const session = this.sessions.get(sessionId);
        return session ? session.users : [];
    }

    private generateSessionId(): string {
        return Math.random().toString(36).substring(2, 10);
    }
}
