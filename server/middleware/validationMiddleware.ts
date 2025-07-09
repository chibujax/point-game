import { Request, Response, NextFunction } from 'express';

const validateSessionName = (name: string): boolean => {
	return typeof name === 'string' && name.length >= 3 && /^[a-zA-Z0-9\s]+$/.test(name);
};

const validateDisplayName = (name: string): boolean => {
	return typeof name === 'string' && name.length >= 3 && /^[a-zA-Z0-9]+$/.test(name);
};

const validatePoints = (points: number[]): boolean => {
	if (!Array.isArray(points) || points.length === 0) return false;
	return points.every(point => Number.isInteger(point) && point >= 0);
};

const validateUserId = (userId: string): boolean => {
	return !!userId && typeof userId === 'string';
};


export const validateCreateSession = (req: Request, res: Response, NextFunction: NextFunction): void => {
	const { sessionName, displayName, points, userId } = req.body;

	if (!validateSessionName(sessionName)) {
		res.status(400).json({ error: 'Invalid session name. Must be at least 3 characters and contain only letters, numbers, and spaces.' });
		return;
	}

	if (!validateDisplayName(displayName)) {
		res.status(400).json({ error: 'Invalid display name. Must be at least 3 characters and contain only letters and numbers.' });
		return;
	}

	if (!validatePoints(points)) {
		res.status(400).json({ error: 'Invalid points. Must be an array of non-negative integers.' });
		return;
	}

	if (!validateUserId(userId)) {
		res.status(400).json({ error: 'Invalid user ID.' });
		return;
	}

	NextFunction();
};

export const validateJoinSession = (req: Request, res: Response, NextFunction: NextFunction): void => {
	const { userId, name } = req.body;

	if (!validateUserId(userId)) {
		res.status(400).json({ error: 'Invalid user ID.' });
		return;
	}

	if (!validateDisplayName(name)) {
		res.status(400).json({ error: 'Invalid display name. Must be at least 3 characters and contain only letters and numbers.' });
		return;
	}

	NextFunction();
};

export const validateSessionId = (req: Request, res: Response, NextFunction: NextFunction): void => {
	const { sessionId } = req.params;
	
	if (!sessionId || typeof sessionId !== 'string' || !sessionId.startsWith('session_')) {
		res.status(400).json({ error: 'Invalid session ID format.' });
		return;
	}

	NextFunction();
};