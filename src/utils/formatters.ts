export const formatDate = (date: Date): string => {
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
};

export const formatPercentage = (value: number): string => {
	return `${(value * 100).toFixed(1)}%`;
};

export const formatVoteResults = (votes: Record<string, number>): string => {
	const total = Object.values(votes).length;
	if (total === 0) return 'No votes yet';

	const average = Object.values(votes).reduce((a, b) => a + b, 0) / total;
	return `Average: ${average.toFixed(1)} (${total} votes)`;
};
