import { Request, Response } from 'express';
import { FileSessionService } from '../services/fileSessionService';
import { Session } from '../../src/types';

export class SessionController {
	constructor(private sessionService: FileSessionService) {}

	createSession = async (req: Request, res: Response): Promise<void> => {
		try {
			const { sessionName, displayName, points, userId } = req.body;

			if (!sessionName || !displayName || !points || !userId) {
				res.status(400).json({ error: 'Missing required fields' });
				return;
			}

			const sessionData: Partial<Session> = {
				name: sessionName,
				points: points,
				users: { [userId]: displayName },
				votes: {},
				owner: userId,
				storedResult: null,
			};

			const session = this.sessionService.createSession(sessionData);

			res.status(201).json({
				sessionId: session.id,
				session,
			});
		} catch (error) {
			console.error('Failed to create session:', error);
			res.status(500).json({ error: 'Failed to create session' });
		}
	};

	getSession = async (req: Request, res: Response): Promise<void> => {
		try {
			const { sessionId } = req.params;
			const session = this.sessionService.getSession(sessionId);

			if (!session) {
				res.status(404).json({ error: 'Session not found' });
				return;
			}

			res.json(session);
		} catch (error) {
			console.error('Failed to get session:', error);
			res.status(500).json({ error: 'Failed to get session' });
		}
	};

	joinSession = async (req: Request, res: Response): Promise<void> => {
		try {
			const { sessionId } = req.params;
			const { userId, name } = req.body;

			if (!userId || !name) {
				res.status(400).json({ error: 'Missing required fields' });
				return;
			}

			const success = this.sessionService.addUserToSession(sessionId, userId, name);

			if (!success) {
				res.status(404).json({ error: 'Session not found' });
				return;
			}

			const session = this.sessionService.getSession(sessionId);
			res.json(session);
		} catch (error) {
			console.error('Failed to join session:', error);
			res.status(500).json({ error: 'Failed to join session' });
		}
	};

	validateSession = async (req: Request, res: Response): Promise<void> => {
		const { sessionId } = req.params;
		const session = this.sessionService.getSession(sessionId);
		if (!session) {
			res.status(404).json({ error: 'Session not found' });
		} else {
			res.json(session);
		}
	};
}
