import { Vote, VoteResults, VotingType } from '../../src/types';

export class VoteService {
	public processVotes(votes: Vote, votingType: VotingType): VoteResults {
		if (Object.keys(votes).length === 0) {
			return this.getEmptyVoteResult();
		}

		const voteEntries = Object.entries(votes);
		const totalVoters = voteEntries.length;

		const voteCount: { [key: string]: number } = {};
		voteEntries.forEach(([, vote]) => {
			voteCount[vote] = (voteCount[vote] || 0) + 1;
		});

		const frequencies = Object.entries(voteCount)
			.map(([value, count]) => ({ value, count }))
			.sort((a, b) => {
				if (b.count !== a.count) return b.count - a.count;
				return this.compareValues(a.value, b.value, votingType);
			});

		const highestCount = frequencies[0]?.count || 0;
		const highestVoteValues = frequencies
			.filter((f) => f.count === highestCount)
			.map((f) => f.value);

		const lowestCount = frequencies[frequencies.length - 1]?.count || 0;
		const lowestVoteValues = frequencies
			.filter((f) => f.count === lowestCount)
			.map((f) => f.value);

		const highestVotes: Array<{ [key: string]: string }> = [];
		const lowestVotes: Array<{ [key: string]: string }> = [];
		const otherVotes: Array<{ [key: string]: string }> = [];

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

		const { average, averageDisplay } = this.calculateAverage(voteEntries, votingType);

		return {
			votes,
			average,
			averageDisplay,
			highestVotes: { value: highestVoteValues, voters: highestVotes },
			lowestVotes: { value: lowestVoteValues, voters: lowestVotes },
			otherVotes,
			totalVoters,
		};
	}

	private calculateAverage(voteEntries: Array<[string, string]>, votingType: VotingType): { average: number | null, averageDisplay: string } {
		if (votingType !== VotingType.NUMERICAL && votingType !== VotingType.DECIMAL) {
			return { average: null, averageDisplay: 'N/A' };
		}

		try {
			const numericVotes = voteEntries.map(([, vote]) => parseFloat(vote));
			
			if (numericVotes.some(isNaN)) {
				return { average: null, averageDisplay: 'N/A' };
			}

			const sum = numericVotes.reduce((acc, vote) => acc + vote, 0);
			const average = sum / numericVotes.length;
			
			const roundedAverage = Math.round(average * 100) / 100;
			
			return { 
				average: roundedAverage, 
				averageDisplay: roundedAverage.toString() 
			};
		} catch (error) {
			return { average: null, averageDisplay: 'N/A' };
		}
	}

	private compareValues(a: string, b: string, votingType: VotingType): number {
		switch (votingType) {
			case VotingType.NUMERICAL:
				const numA = parseFloat(a);
				const numB = parseFloat(b);
				if (!isNaN(numA) && !isNaN(numB)) {
					return numA - numB;
				}
				break;
			case VotingType.DECIMAL:
				const decA = parseFloat(a);
				const decB = parseFloat(b);
				if (!isNaN(decA) && !isNaN(decB)) {
					return decA - decB;
				}
				break;
			case VotingType.ALPHABETICAL:
			case VotingType.ALPHANUMERICAL:
				return a.localeCompare(b);
		}
		// Fallback to string comparison
		return a.localeCompare(b);
	}

	private getEmptyVoteResult(): VoteResults {
		return {
			votes: {},
			average: null,
			averageDisplay: 'N/A',
			highestVotes: { value: [], voters: [] },
			lowestVotes: { value: [], voters: [] },
			otherVotes: [],
			totalVoters: 0,
		};
	}
}
