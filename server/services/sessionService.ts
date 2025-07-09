import { Session } from '../../src/types';

export class SessionService {
	public sessions: Map<string, Session>;

	constructor() {
		this.sessions = new Map();
	}

	createSession(sessionData: Partial<Session>): Session {
		const sessionId = `session_${Date.now()}`;
		const session: Session = {
			id: sessionId,
			...sessionData,
		} as Session;
		this.sessions.set(sessionId, session);
		return session;
	}

	getSession(sessionId: string): Session | null {
		return this.sessions.get(sessionId) || null;
	}

	updateSession(sessionId: string, updates: Partial<Session>): Session | null {
		const session = this.sessions.get(sessionId);
		if (!session) return null;

		const updatedSession = { ...session, ...updates };
		this.sessions.set(sessionId, updatedSession);
		return updatedSession;
	}

	addUserToSession(sessionId: string, userId: string, name: string): boolean {
		const session = this.sessions.get(sessionId);
		if (!session) return false;

		if (session.users[userId]) {
			return true;
		}

		session.users[userId] = name;
		return true;
	}

	removeUserFromSession(sessionId: string, userId: string): boolean {
		const session = this.sessions.get(sessionId);
		if (!session) return false;

		delete session.users[userId];
		delete session.votes[userId];
		return true;
	}

	deleteSession(sessionId: string): boolean {
		return this.sessions.delete(sessionId);
	}
}
