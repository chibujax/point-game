"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSessionService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FileSessionService {
    constructor(filePath = path_1.default.join(__dirname, '../sessions.json')) {
        Object.defineProperty(this, "sessions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "filePath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.filePath = filePath;
        this.sessions = new Map();
        this.loadSessionsFromFile();
    }
    loadSessionsFromFile() {
        try {
            if (fs_1.default.existsSync(this.filePath)) {
                const data = fs_1.default.readFileSync(this.filePath, 'utf8');
                const sessionsObj = JSON.parse(data);
                this.sessions = new Map(Object.entries(sessionsObj));
                console.log(`Loaded ${this.sessions.size} sessions from file`);
            }
            else {
                this.sessions = new Map();
                console.log('No sessions file found, starting with empty sessions');
            }
        }
        catch (error) {
            console.error('Error loading sessions from file:', error);
            this.sessions = new Map();
        }
    }
    saveSessionsToFile() {
        try {
            const sessionsObj = Object.fromEntries(this.sessions);
            fs_1.default.writeFileSync(this.filePath, JSON.stringify(sessionsObj, null, 2), 'utf8');
        }
        catch (error) {
            console.error('Error saving sessions to file:', error);
        }
    }
    createSession(sessionData) {
        const sessionId = `session_${Date.now()}`;
        const session = {
            id: sessionId,
            ...sessionData,
        };
        this.sessions.set(sessionId, session);
        this.saveSessionsToFile();
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
        this.saveSessionsToFile();
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
        this.saveSessionsToFile();
        return true;
    }
    removeUserFromSession(sessionId, userId) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return false;
        delete session.users[userId];
        delete session.votes[userId];
        this.saveSessionsToFile();
        return true;
    }
    deleteSession(sessionId) {
        const deleted = this.sessions.delete(sessionId);
        if (deleted) {
            this.saveSessionsToFile();
        }
        return deleted;
    }
    get allSessions() {
        return this.sessions;
    }
}
exports.FileSessionService = FileSessionService;
