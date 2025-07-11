import { describe, test, expect, beforeEach } from 'vitest';
import { VoteService } from './voteService';
import { VotingType } from '../../src/types';

describe('VoteProcessor', () => {
	let processor: VoteService;

	beforeEach(() => {
		processor = new VoteService();
	});

	test('should handle empty votes', () => {
		const result = processor.processVotes({}, VotingType.NUMERICAL);
		expect(result).toEqual({
			votes: {},
			average: null,
			averageDisplay: 'N/A',
			highestVotes: { value: [], voters: [] },
			lowestVotes: { value: [], voters: [] },
			otherVotes: [],
			totalVoters: 0,
		});
	});

	test('should process votes with same frequency', () => {
		const votes = {
			user1: '5',
			user2: '5',
			user3: '3',
			user4: '3',
		};

		const result = processor.processVotes(votes, VotingType.NUMERICAL);
		expect(result.votes).toMatchObject(votes);
		expect(result.average).toBe(4);
		expect(result.averageDisplay).toBe('4');
		expect(result.highestVotes.value).toEqual(['3', '5']);
		expect(result.highestVotes.voters).toHaveLength(4);
		expect(result.lowestVotes.value).toEqual(['3', '5']);
		expect(result.lowestVotes.voters).toHaveLength(0);
		expect(result.otherVotes).toHaveLength(0);
		expect(result.totalVoters).toBe(4);
	});

	test('should process votes with clear highest', () => {
		const votes = {
			user1: '5',
			user2: '5',
			user3: '5',
			user4: '3',
			user5: '2',
			user6: '9',
		};

		const result = processor.processVotes(votes, VotingType.NUMERICAL);

		expect(result.votes).toMatchObject(votes);
		expect(result.average).toBe(4.83);
		expect(result.averageDisplay).toBe('4.83');
		expect(result.highestVotes.value).toEqual(['5']);
		expect(result.highestVotes.voters).toHaveLength(3);
		expect(result.lowestVotes.value).toEqual(['2', '3', '9']);
		expect(result.lowestVotes.voters).toHaveLength(3);
		expect(result.otherVotes).toHaveLength(0);
		expect(result.totalVoters).toBe(6);
	});

	test('should process votes with clear lowest', () => {
		const votes = {
			user1: '5',
			user2: '5',
			user3: '5',
			user4: '3',
			user5: '3',
			user6: '9',
		};

		const result = processor.processVotes(votes, VotingType.NUMERICAL);

		expect(result.votes).toMatchObject(votes);
		expect(result.average).toBe(5);
		expect(result.averageDisplay).toBe('5');
		expect(result.highestVotes.value).toEqual(['5']);
		expect(result.highestVotes.voters).toHaveLength(3);
		expect(result.lowestVotes.value).toEqual(['9']);
		expect(result.lowestVotes.voters).toHaveLength(1);
		expect(result.otherVotes).toHaveLength(2);
		expect(result.totalVoters).toBe(6);
	});

	test('should handle single vote', () => {
		const votes = {
			user1: '5',
		};

		const result = processor.processVotes(votes, VotingType.NUMERICAL);

		expect(result.votes).toMatchObject(votes);
		expect(result.average).toBe(5);
		expect(result.averageDisplay).toBe('5');
		expect(result.highestVotes.value).toEqual(['5']);
		expect(result.highestVotes.voters).toHaveLength(1);
		expect(result.lowestVotes.value).toEqual(['5']);
		expect(result.lowestVotes.voters).toHaveLength(0);
		expect(result.otherVotes).toHaveLength(0);
		expect(result.totalVoters).toBe(1);
	});

	test('should handle multiple votes with same value', () => {
		const votes = {
			user1: '5',
			user2: '5',
			user3: '5',
		};

		const result = processor.processVotes(votes, VotingType.NUMERICAL);

		expect(result.votes).toMatchObject(votes);
		expect(result.average).toBe(5);
		expect(result.averageDisplay).toBe('5');
		expect(result.highestVotes.value).toEqual(['5']);
		expect(result.highestVotes.voters).toHaveLength(3);
		expect(result.lowestVotes.value).toEqual(['5']);
		expect(result.lowestVotes.voters).toHaveLength(0);
		expect(result.otherVotes).toHaveLength(0);
		expect(result.totalVoters).toBe(3);
	});

	test('should handle votes with multiple modes', () => {
		const votes = {
			user1: '1',
			user2: '1',
			user3: '3',
			user4: '3',
			user5: '2',
		};

		const result = processor.processVotes(votes, VotingType.NUMERICAL);

		expect(result.average).toBe(2);
		expect(result.averageDisplay).toBe('2');
		expect(result.highestVotes.value).toEqual(['1', '3']);
		expect(result.highestVotes.voters).toHaveLength(4);
		expect(result.lowestVotes.value).toEqual(['2']);
		expect(result.lowestVotes.voters).toHaveLength(1);
		expect(result.otherVotes).toHaveLength(0);
		expect(result.totalVoters).toBe(5);
	});

	test('should return N/A average for alphabetical voting', () => {
		const votes = {
			user1: 'A',
			user2: 'B',
			user3: 'A',
		};

		const result = processor.processVotes(votes, VotingType.ALPHABETICAL);

		expect(result.average).toBe(null);
		expect(result.averageDisplay).toBe('N/A');
		expect(result.highestVotes.value).toEqual(['A']);
		expect(result.totalVoters).toBe(3);
	});

	test('should handle decimal voting with average', () => {
		const votes = {
			user1: '1.5',
			user2: '2.5',
			user3: '3.0',
		};

		const result = processor.processVotes(votes, VotingType.DECIMAL);

		expect(result.average).toBe(2.33);
		expect(result.averageDisplay).toBe('2.33');
		expect(result.totalVoters).toBe(3);
	});
});
