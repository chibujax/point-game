import { Vote, VoteResults } from '../../src/types';

export class VoteService {
	public processVotes(votes: Vote): VoteResults {
		if (Object.keys(votes).length === 0) {
			return this.getEmptyVoteResult();
		}

		const voteEntries = Object.entries(votes);
		const totalVoters = voteEntries.length;

		const voteCount: { [key: number]: number } = {};
		voteEntries.forEach(([, vote]) => {
			voteCount[vote] = (voteCount[vote] || 0) + 1;
		});

		const frequencies = Object.entries(voteCount)
			.map(([value, count]) => ({ value: parseInt(value), count }))
			.sort((a, b) => b.count - a.count || a.value - b.value);

		const highestCount = frequencies[0]?.count || 0;
		const highestVoteValues = frequencies
			.filter((f) => f.count === highestCount)
			.map((f) => f.value);

		const lowestCount = frequencies[frequencies.length - 1]?.count || 0;
		const lowestVoteValues = frequencies
			.filter((f) => f.count === lowestCount)
			.map((f) => f.value);

		const highestVotes: Array<{ [key: string]: number }> = [];
		const lowestVotes: Array<{ [key: string]: number }> = [];
		const otherVotes: Array<{ [key: string]: number }> = [];

		voteEntries.forEach(([userId, vote]) => {
			const voteObj = { [userId]: vote };
			if (highestVoteValues.includes(vote)) {
				highestVotes.push(voteObj);
			} else if (lowestVoteValues.includes(vote)) {
				lowestVotes.push(voteObj);
			} else {
				otherVotes.push(voteObj);
			}
		});

		const sum = voteEntries.reduce((acc, [, vote]) => acc + vote, 0);
		const average = Math.round((sum / totalVoters) * 100) / 100;

		return {
			votes,
			average,
			highestVotes: { value: highestVoteValues, voters: highestVotes },
			lowestVotes: { value: lowestVoteValues, voters: lowestVotes },
			otherVotes,
			totalVoters,
		};
	}

	private getEmptyVoteResult(): VoteResults {
		return {
			votes: {},
			average: 0,
			highestVotes: { value: [], voters: [] },
			lowestVotes: { value: [], voters: [] },
			otherVotes: [],
			totalVoters: 0,
		};
	}
}
