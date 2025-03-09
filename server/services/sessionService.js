"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
class SessionService {
    constructor() {
        Object.defineProperty(this, "sessions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.sessions = new Map();
    }
    createSession(sessionData) {
        const sessionId = `session_${Date.now()}`;
        const session = {
            id: sessionId,
            ...sessionData,
        };
        this.sessions.set(sessionId, session);
        return session;
    }
    getSession(sessionId) {
        return this.sessions.get(sessionId) || null;
    }
    updateSession(sessionId, updates) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return null;
        const updatedSession = { ...session, ...updates };
        this.sessions.set(sessionId, updatedSession);
        return updatedSession;
    }
    addUserToSession(sessionId, userId, name) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return false;
        if (session.users[userId]) {
            return true;
        }
        session.users[userId] = name;
        return true;
    }
    removeUserFromSession(sessionId, userId) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return false;
        delete session.users[userId];
        delete session.votes[userId];
        return true;
    }
    deleteSession(sessionId) {
        return this.sessions.delete(sessionId);
    }
}
exports.SessionService = SessionService;
