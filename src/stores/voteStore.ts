import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { VoteResults } from '../types';

interface VoteState {
	selectedVote: number | null;
	isRevealed: boolean;
	results: VoteResults | null;
	votedUsers: string[];
	setVotedUsers: (users: string[]) => void;
	setVote: (vote: number) => void;
	setResults: (results: VoteResults) => void;
	reveal: () => void;
	reset: () => void;
}

export const useVoteStore = create<VoteState>()(
	devtools(
		(set) => ({
			selectedVote: null,
			isRevealed: false,
			results: null,
			votedUsers: [],
			setVote: (vote) => set({ selectedVote: vote }),
			setVotedUsers: (votedUsers) => set({ votedUsers }),
			setResults: (results) => set({ results, isRevealed: results !== null }),
			reveal: () => set({ isRevealed: true }),
			reset: () =>
				set({
					selectedVote: null,
					isRevealed: false,
					results: null,
				}),
		}),
		{
			name: 'vote-store',
		},
	),
);
