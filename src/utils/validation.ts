export const isValidSessionName = (name: string): boolean => {
	return name.length >= 3 && name.length <= 50;
};

export const isValidPoints = (points: string): boolean => {
	const pointArray = points.split(',').map(Number);
	return pointArray.every((point) => !isNaN(point) && point > 0);
};

export const validateVote = (vote: number, points: number[]): boolean => {
	return points.includes(vote);
};
