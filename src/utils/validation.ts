import { VotingType } from '@/types';

export const isValidSessionName = (name: string): boolean => {
	return name.length >= 3 && name.length <= 50;
};

export const isValidPoints = (points: string): boolean => {
	const pointArray = points.split(',').map(Number);
	return pointArray.every((point) => !isNaN(point) && point > 0);
};

export const validateVote = (vote: string, points: string[]): boolean => {
	return points.includes(vote);
};

export const validatePointsByType = (points: string[], votingType: VotingType): boolean => {
	if (!Array.isArray(points) || points.length === 0) return false;
	
	return points.every(point => {
		if (typeof point !== 'string' || point.trim() === '') return false;
		
		const trimmedPoint = point.trim();
		
		switch (votingType) {
			case VotingType.NUMERICAL:
				return /^[0-9]+$/.test(trimmedPoint) && !isNaN(parseInt(trimmedPoint));
			case VotingType.DECIMAL:
				return /^[0-9]+(\.[0-9]+)?$/.test(trimmedPoint) && !isNaN(parseFloat(trimmedPoint));
			case VotingType.ALPHABETICAL:
				return /^[a-zA-Z]+$/.test(trimmedPoint);
			case VotingType.ALPHANUMERICAL:
				return /^[a-zA-Z0-9]+$/.test(trimmedPoint);
			default:
				return false;
		}
	});
};

export const validateSinglePoint = (point: string, votingType: VotingType): boolean => {
	if (typeof point !== 'string' || point.trim() === '') return false;
	
	const trimmedPoint = point.trim();
	
	switch (votingType) {
		case VotingType.NUMERICAL:
			return /^[0-9]+$/.test(trimmedPoint) && !isNaN(parseInt(trimmedPoint));
		case VotingType.DECIMAL:
			return /^[0-9]+(\.[0-9]+)?$/.test(trimmedPoint) && !isNaN(parseFloat(trimmedPoint));
		case VotingType.ALPHABETICAL:
			return /^[a-zA-Z]+$/.test(trimmedPoint);
		case VotingType.ALPHANUMERICAL:
			return /^[a-zA-Z0-9]+$/.test(trimmedPoint);
		default:
			return false;
	}
};

export const getValidationErrorMessage = (votingType: VotingType): string => {
	switch (votingType) {
		case VotingType.NUMERICAL:
			return 'Points must be whole numbers (e.g., 1,2,3)';
		case VotingType.DECIMAL:
			return 'Points must be decimal numbers (e.g., 1.0,2.5,3.0)';
		case VotingType.ALPHABETICAL:
			return 'Points must be letters only (e.g., A,B,C)';
		case VotingType.ALPHANUMERICAL:
			return 'Points must be letters and numbers (e.g., 4,S,M,L)';
		default:
			return 'Invalid voting type';
	}
};

export const getPlaceholderByType = (votingType: VotingType): string => {
	switch (votingType) {
		case VotingType.NUMERICAL:
			return 'Enter voting points (e.g., 1,2,3,5,8)';
		case VotingType.DECIMAL:
			return 'Enter voting points (e.g., 1.0,2.5,3.0,5.5)';
		case VotingType.ALPHABETICAL:
			return 'Enter voting points (e.g., A,B,C,D)';
		case VotingType.ALPHANUMERICAL:
			return 'Enter voting points (e.g., 4,S,M,L,XL)';
		default:
			return 'Enter voting points';
	}
};
