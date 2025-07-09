import fs from 'fs';
import path from 'path';
import { Session, VotingType } from '../../src/types';

export class FileSessionService {
	public sessions: Map<string, Session>;
	private filePath: string;

	constructor(filePath = path.join(__dirname, '../sessions.json')) {
		this.filePath = filePath;
		this.sessions = new Map();
		this.loadSessionsFromFile();
	}

	private loadSessionsFromFile(): void {
		try {
			if (fs.existsSync(this.filePath)) {
				const data = fs.readFileSync(this.filePath, 'utf8');
				const sessionsObj = JSON.parse(data);
				
				Object.entries(sessionsObj).forEach(([, session]) => {
					const sessionData = session as Session;
					if (!sessionData.votingType) {
						sessionData.votingType = VotingType.NUMERICAL;
						if (sessionData.points && typeof sessionData.points[0] === 'number') {
							sessionData.points = (sessionData.points as unknown as number[]).map(p => p.toString());
						}
					}
				});
				
				this.sessions = new Map(Object.entries(sessionsObj));
				console.log(`Loaded ${this.sessions.size} sessions from file`);
			} else {
				this.sessions = new Map();
				console.log('No sessions file found, starting with empty sessions');
			}
		} catch (error) {
			console.error('Error loading sessions from file:', error);
			this.sessions = new Map();
		}
	}

	private saveSessionsToFile(): void {
		try {
			const sessionsObj = Object.fromEntries(this.sessions);
			fs.writeFileSync(this.filePath, JSON.stringify(sessionsObj, null, 2), 'utf8');
		} catch (error) {
			console.error('Error saving sessions to file:', error);
		}
	}

	createSession(sessionData: Partial<Session>): Session {
		const sessionId = `session_${Date.now()}`;
		const session: Session = {
			id: sessionId,
			votingType: VotingType.NUMERICAL,
			...sessionData,
		} as Session;
		
		this.sessions.set(sessionId, session);
		this.saveSessionsToFile();
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
		this.saveSessionsToFile();
		return updatedSession;
	}

	addUserToSession(sessionId: string, userId: string, name: string): boolean {
		const session = this.sessions.get(sessionId);
		if (!session) return false;

		if (session.users[userId]) {
			return true;
		}

		session.users[userId] = name;
		this.saveSessionsToFile();
		return true;
	}

	removeUserFromSession(sessionId: string, userId: string): boolean {
		const session = this.sessions.get(sessionId);
		if (!session) return false;

		delete session.users[userId];
		delete session.votes[userId];
		this.saveSessionsToFile();
		return true;
	}

	deleteSession(sessionId: string): boolean {
		const deleted = this.sessions.delete(sessionId);
		if (deleted) {
			this.saveSessionsToFile();
		}
		return deleted;
	}
	
	get allSessions(): Map<string, Session> {
		return this.sessions;
	}
}