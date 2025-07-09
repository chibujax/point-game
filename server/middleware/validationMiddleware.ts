import { Request, Response, NextFunction } from 'express';
import { VotingType } from '../../src/types';

const validateSessionName = (name: string): boolean => {
	return typeof name === 'string' && name.length >= 3 && /^[a-zA-Z0-9\s]+$/.test(name);
};

const validateDisplayName = (name: string): boolean => {
	return typeof name === 'string' && name.length >= 3 && /^[a-zA-Z0-9]+$/.test(name);
};

const validateVotingType = (votingType: string): boolean => {
	return Object.values(VotingType).includes(votingType as VotingType);
};

const validatePoints = (points: string[], votingType: VotingType): boolean => {
	if (!Array.isArray(points) || points.length === 0) return false;
	
	return points.every(point => {
		if (typeof point !== 'string') return false;
		
		switch (votingType) {
			case VotingType.NUMERICAL:
				return /^[0-9]+$/.test(point) && !isNaN(parseInt(point));
			case VotingType.DECIMAL:
				return /^[0-9]+(\.[0-9]+)?$/.test(point) && !isNaN(parseFloat(point));
			case VotingType.ALPHABETICAL:
				return /^[a-zA-Z]+$/.test(point);
			case VotingType.ALPHANUMERICAL:
				return /^[a-zA-Z0-9]+$/.test(point);
			default:
				return false;
		}
	});
};

const validateUserId = (userId: string): boolean => {
	return !!userId && typeof userId === 'string';
};

export const validateCreateSession = (req: Request, res: Response, next: NextFunction): void => {
	const { sessionName, displayName, points, userId, votingType } = req.body;

	if (!validateSessionName(sessionName)) {
		res.status(400).json({ error: 'Invalid session name. Must be at least 3 characters and contain only letters, numbers, and spaces.' });
		return;
	}

	if (!validateDisplayName(displayName)) {
		res.status(400).json({ error: 'Invalid display name. Must be at least 3 characters and contain only letters and numbers.' });
		return;
	}

	if (!validateVotingType(votingType)) {
		res.status(400).json({ error: 'Invalid voting type. Must be one of: numerical, decimal, alphabetical, alphanumerical.' });
		return;
	}

	if (!validatePoints(points, votingType)) {
		let errorMessage = 'Invalid points. ';
		switch (votingType) {
			case VotingType.NUMERICAL:
				errorMessage += 'Must be an array of whole numbers (e.g., ["1", "2", "3"]).';
				break;
			case VotingType.DECIMAL:
				errorMessage += 'Must be an array of decimal numbers (e.g., ["1.0", "2.5", "3.0"]).';
				break;
			case VotingType.ALPHABETICAL:
				errorMessage += 'Must be an array of letters only (e.g., ["A", "B", "C"]).';
				break;
			case VotingType.ALPHANUMERICAL:
				errorMessage += 'Must be an array of letters and numbers (e.g., ["A1", "B2", "C3"]).';
				break;
		}
		res.status(400).json({ error: errorMessage });
		return;
	}

	if (!validateUserId(userId)) {
		res.status(400).json({ error: 'Invalid user ID.' });
		return;
	}

	next();
};

export const validateJoinSession = (req: Request, res: Response, next: NextFunction): void => {
	const { userId, name } = req.body;

	if (!validateUserId(userId)) {
		res.status(400).json({ error: 'Invalid user ID.' });
		return;
	}

	if (!validateDisplayName(name)) {
		res.status(400).json({ error: 'Invalid display name. Must be at least 3 characters and contain only letters and numbers.' });
		return;
	}

	next();
};

export const validateSessionId = (req: Request, res: Response, next: NextFunction): void => {
	const { sessionId } = req.params;
	
	if (!sessionId || typeof sessionId !== 'string' || !sessionId.startsWith('session_')) {
		res.status(400).json({ error: 'Invalid session ID format.' });
		return;
	}

	next();
};